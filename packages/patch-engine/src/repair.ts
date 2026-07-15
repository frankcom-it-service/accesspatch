import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import { execFile as execFileCallback } from 'node:child_process';
import {
  PATCH_AUDIT_SCHEMA_VERSION,
  PATCH_ENGINE_VERSION,
  ISOLATED_WORKING_COPY_STRATEGY,
  PHASE1C_CHANGED_FILES,
  PHASE1C_OUTPUT_DIRECTORY,
  PHASE1C_SAFE_FIX_CLASSES,
  REVIEWED_PHASE1B_HASHES,
  VERIFICATION_SCHEMA_VERSION,
} from './constants.ts';
import { copyRepositoryWithoutSymlinks } from './copy-policy.ts';
import { loadValidatedPhase1Inputs, sha256 } from './input-validation.ts';
import { MANUAL_REVIEW_CONTENT } from './manual-review.ts';
import {
  assertAllowedFileChanges,
  assertApprovedRepairTargets,
  validateGeneratedPatch,
} from './patch-policy.ts';
import { createReplaySpec } from './replay-template.ts';
import {
  PatchAuditSchema,
  RepairedFocusValuesSchema,
  VerificationSchema,
  type PatchAudit,
  type Verification,
} from './schemas.ts';
import {
  applyExplicitLabelTemplate,
  applyFocusVisibleTemplate,
} from './templates.ts';

const execFile = promisify(execFileCallback);
interface ReplayResult {
  focusValues: {
    outlineStyle: string;
    outlineWidth: string;
    boxShadow: string;
    visibleIndicatorDetected: true;
  };
  axeViolationCount: 0;
  axeRuleIds: [];
  confirmationReached: true;
}

interface FileChanges {
  changed: string[];
  created: string[];
  deleted: string[];
}

function repositoryRelativePath(repositoryRoot: string, path: string): string {
  return relative(repositoryRoot, path).split(sep).join('/');
}

async function inventoryFiles(root: string): Promise<Map<string, string>> {
  const inventory = new Map<string, string>();

  async function visit(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
      } else if (entry.isFile()) {
        inventory.set(repositoryRelativePath(root, path), sha256(await readFile(path)));
      } else if (entry.isSymbolicLink()) {
        const stats = await lstat(path);
        inventory.set(repositoryRelativePath(root, path), `symlink:${stats.size}`);
      }
    }
  }

  await visit(root);
  return inventory;
}

function compareInventories(
  before: Map<string, string>,
  after: Map<string, string>,
): FileChanges {
  const changed = [...before.keys()].filter(
    (path) => after.has(path) && before.get(path) !== after.get(path),
  );
  const created = [...after.keys()].filter((path) => !before.has(path));
  const deleted = [...before.keys()].filter((path) => !after.has(path));
  return {
    changed: changed.sort(),
    created: created.sort(),
    deleted: deleted.sort(),
  };
}

async function createUnifiedDiff(
  repositoryRoot: string,
  workingCopyRoot: string,
): Promise<string> {
  const parts: string[] = [];
  for (const file of PHASE1C_CHANGED_FILES) {
    try {
      await execFile(
        'diff',
        [
          '-u',
          '--label',
          `a/${file}`,
          '--label',
          `b/${file}`,
          join(repositoryRoot, file),
          join(workingCopyRoot, file),
        ],
        { maxBuffer: 2_000_000 },
      );
      throw new Error(`expected_changed_file_was_identical:${file}`);
    } catch (error) {
      const result = error as NodeJS.ErrnoException & {
        code?: number;
        stdout?: string;
      };
      if (result.code !== 1 || typeof result.stdout !== 'string') {
        throw error;
      }
      parts.push(result.stdout);
    }
  }
  return parts.join('');
}

async function getAvailablePort(): Promise<number> {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('unable_to_resolve_replay_port'));
        return;
      }
      const port = address.port;
      server.close((error) => (error ? reject(error) : resolvePort(port)));
    });
  });
}

async function waitForServer(url: string, processExited: () => boolean): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (processExited()) {
      throw new Error('isolated_vite_server_exited');
    }
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 150));
    }
  }
  throw new Error('isolated_vite_server_timeout');
}

async function stopProcess(process: ReturnType<typeof spawn>): Promise<void> {
  if (process.exitCode !== null) {
    return;
  }
  process.kill('SIGTERM');
  await new Promise<void>((resolveExit) => {
    const timeout = setTimeout(() => {
      process.kill('SIGKILL');
    }, 5_000);
    process.once('exit', () => {
      clearTimeout(timeout);
      resolveExit();
    });
  });
}

async function writeTemporaryViteConfig(
  repositoryRoot: string,
  directory: string,
): Promise<string> {
  const reactRoot = resolve(
    repositoryRoot,
    'apps/demo-checkout/node_modules/react',
  );
  const reactDomRoot = resolve(
    repositoryRoot,
    'apps/demo-checkout/node_modules/react-dom',
  );
  const configPath = join(directory, 'vite.config.mjs');
  const aliases = [
    { find: '^react$', replacement: resolve(reactRoot, 'index.js') },
    {
      find: '^react/jsx-runtime$',
      replacement: resolve(reactRoot, 'jsx-runtime.js'),
    },
    {
      find: '^react/jsx-dev-runtime$',
      replacement: resolve(reactRoot, 'jsx-dev-runtime.js'),
    },
    { find: '^react-dom$', replacement: resolve(reactDomRoot, 'index.js') },
    {
      find: '^react-dom/client$',
      replacement: resolve(reactDomRoot, 'client.js'),
    },
  ];
  const config = `export default {
  resolve: {
    alias: ${JSON.stringify(aliases, null, 2)}.map(({ find, replacement }) => ({
      find: new RegExp(find),
      replacement,
    })),
  },
};
`;
  await writeFile(configPath, config, 'utf8');
  return configPath;
}

async function runIsolatedBuild(
  repositoryRoot: string,
  workingCopyRoot: string,
): Promise<void> {
  const configDirectory = await mkdtemp(join(tmpdir(), 'accesspatch-phase1c-vite-'));
  try {
    const configPath = await writeTemporaryViteConfig(
      repositoryRoot,
      configDirectory,
    );
    await execFile(
      resolve(repositoryRoot, 'apps/demo-checkout/node_modules/.bin/vite'),
      ['build', '--config', configPath],
      {
        cwd: resolve(workingCopyRoot, 'apps/demo-checkout'),
        maxBuffer: 4_000_000,
      },
    );
  } finally {
    await rm(configDirectory, { recursive: true, force: true });
  }
}

async function runIsolatedReplay(
  repositoryRoot: string,
  workingCopyRoot: string,
): Promise<ReplayResult> {
  const port = await getAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const configDirectory = await mkdtemp(join(tmpdir(), 'accesspatch-phase1c-'));
  const viteConfigPath = await writeTemporaryViteConfig(
    repositoryRoot,
    configDirectory,
  );
  const viteProcess = spawn(
    resolve(repositoryRoot, 'apps/demo-checkout/node_modules/.bin/vite'),
    [
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
      '--config',
      viteConfigPath,
    ],
    {
      cwd: resolve(workingCopyRoot, 'apps/demo-checkout'),
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  const serverOutput: Buffer[] = [];
  viteProcess.stdout?.on('data', (chunk: Buffer) => serverOutput.push(chunk));
  viteProcess.stderr?.on('data', (chunk: Buffer) => serverOutput.push(chunk));

  const configPath = join(configDirectory, 'playwright.config.mjs');
  const configuredBrowser = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const systemBrowser = '/usr/bin/chromium';
  let executablePath = configuredBrowser;
  if (!executablePath) {
    try {
      await lstat(systemBrowser);
      executablePath = systemBrowser;
    } catch {
      executablePath = undefined;
    }
  }
  const launchOptions = executablePath ? { executablePath } : undefined;
  const config = {
    testDir: resolve(workingCopyRoot, 'tests/e2e'),
    fullyParallel: false,
    forbidOnly: true,
    retries: 0,
    workers: 1,
    reporter: [['line']],
    outputDir: resolve(workingCopyRoot, 'test-results'),
    use: {
      baseURL: baseUrl,
      screenshot: 'off',
      trace: 'off',
    },
    projects: [
      {
        name: 'chromium',
        use: {
          viewport: { width: 1280, height: 720 },
          ...(launchOptions ? { launchOptions } : {}),
        },
      },
    ],
  };
  await writeFile(configPath, `export default ${JSON.stringify(config, null, 2)};\n`);

  try {
    await waitForServer(baseUrl, () => viteProcess.exitCode !== null);
    const { stdout, stderr } = await execFile(
      resolve(repositoryRoot, 'node_modules/.bin/playwright'),
      ['test', 'replay.spec.ts', `--config=${configPath}`],
      {
        cwd: workingCopyRoot,
        maxBuffer: 8_000_000,
      },
    );
    const output = `${stdout}${stderr}`;
    const match = output.match(/PHASE1C_REPLAY_RESULT=(\{[^\n]+\})/);
    if (!match?.[1]) {
      throw new Error('replay_result_marker_missing');
    }
    const parsed = JSON.parse(match[1]) as ReplayResult;
    const focusValues = RepairedFocusValuesSchema.parse(parsed.focusValues);
    if (
      parsed.axeViolationCount !== 0 ||
      parsed.axeRuleIds.length !== 0 ||
      parsed.confirmationReached !== true
    ) {
      throw new Error('replay_result_not_accepted');
    }
    console.log(output.trim());
    return { ...parsed, focusValues };
  } catch (error) {
    const details = Buffer.concat(serverOutput).toString('utf8').trim();
    if (details) {
      console.error(details);
    }
    throw error;
  } finally {
    await stopProcess(viteProcess);
    await rm(configDirectory, { recursive: true, force: true });
  }
}

async function writeValidatedJson(
  outputPath: string,
  value: unknown,
  parser: { parse(input: unknown): unknown },
): Promise<void> {
  const validated = parser.parse(value);
  await writeFile(outputPath, `${JSON.stringify(validated, null, 2)}\n`, 'utf8');
}

export async function runPhase1Repair(repositoryRoot = process.cwd()): Promise<{
  verification: Verification;
  audit: PatchAudit;
}> {
  const inputs = await loadValidatedPhase1Inputs(repositoryRoot);
  assertApprovedRepairTargets(inputs.repairPlan);

  const baseGitCommit = (
    await execFile('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot })
  ).stdout.trim();
  const originalSourceHashes = Object.fromEntries(
    await Promise.all(
      PHASE1C_CHANGED_FILES.map(async (file) => [
        file,
        sha256(await readFile(resolve(repositoryRoot, file))),
      ]),
    ),
  );
  const workParent = resolve(repositoryRoot, '.accesspatch/work');
  await mkdir(workParent, { recursive: true });
  const workingCopyRoot = await mkdtemp(join(workParent, 'phase1c-'));
  const replaySpec = createReplaySpec();
  let patch = '';
  let replayResult: ReplayResult | undefined;
  let cleanupResult: 'removed' | 'failed' = 'failed';

  try {
    await copyRepositoryWithoutSymlinks(repositoryRoot, workingCopyRoot);
    const before = await inventoryFiles(workingCopyRoot);
    const appPath = resolve(workingCopyRoot, PHASE1C_CHANGED_FILES[0]);
    const stylesPath = resolve(workingCopyRoot, PHASE1C_CHANGED_FILES[1]);
    await writeFile(
      appPath,
      applyExplicitLabelTemplate(await readFile(appPath, 'utf8')),
      'utf8',
    );
    await writeFile(
      stylesPath,
      applyFocusVisibleTemplate(await readFile(stylesPath, 'utf8')),
      'utf8',
    );
    const replayPath = resolve(workingCopyRoot, 'tests/e2e/replay.spec.ts');
    await writeFile(replayPath, replaySpec, 'utf8');

    const after = await inventoryFiles(workingCopyRoot);
    const changes = compareInventories(before, after);
    assertAllowedFileChanges(changes.changed, changes.created, changes.deleted);

    patch = await createUnifiedDiff(repositoryRoot, workingCopyRoot);
    validateGeneratedPatch(patch);
    await runIsolatedBuild(repositoryRoot, workingCopyRoot);
    replayResult = await runIsolatedReplay(repositoryRoot, workingCopyRoot);
  } finally {
    await rm(workingCopyRoot, { recursive: true, force: true });
    try {
      await lstat(workingCopyRoot);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        cleanupResult = 'removed';
      } else {
        throw error;
      }
    }
  }

  if (!replayResult || cleanupResult !== 'removed') {
    throw new Error('phase1c_verification_incomplete');
  }

  for (const file of PHASE1C_CHANGED_FILES) {
    const currentHash = sha256(await readFile(resolve(repositoryRoot, file)));
    if (currentHash !== originalSourceHashes[file]) {
      throw new Error(`original_repository_source_changed:${file}`);
    }
  }

  const verification: Verification = VerificationSchema.parse({
    schemaVersion: VERIFICATION_SCHEMA_VERSION,
    baseGitCommit,
    evidenceSha256: REVIEWED_PHASE1B_HASHES.evidence,
    repairPlanSha256: REVIEWED_PHASE1B_HASHES.repairPlan,
    patchSha256: sha256(patch),
    replaySpecSha256: sha256(replaySpec),
    journeyId: inputs.evidence.journey.journeyId,
    repairedFindingIds: inputs.evidence.findings.map((finding) => finding.findingId),
    filesChanged: [...PHASE1C_CHANGED_FILES],
    buildResult: 'passed',
    replayResult: 'passed',
    axeResult: {
      violationCount: 0,
      ruleIds: [],
      emailLabelViolationPresent: false,
    },
    repairedFocusComputedValues: replayResult.focusValues,
    confirmationReached: replayResult.confirmationReached,
    originalRepositoryUnchanged: true,
    overallVerificationStatus: 'passed',
  });
  const audit: PatchAudit = PatchAuditSchema.parse({
    schemaVersion: PATCH_AUDIT_SCHEMA_VERSION,
    timestampUtc: new Date().toISOString(),
    patchEngineVersion: PATCH_ENGINE_VERSION,
    approvedInputHashes: {
      evidenceSha256: REVIEWED_PHASE1B_HASHES.evidence,
      repairPlanSha256: REVIEWED_PHASE1B_HASHES.repairPlan,
      modelAuditSha256: REVIEWED_PHASE1B_HASHES.modelAudit,
    },
    allowedFiles: [...PHASE1C_CHANGED_FILES],
    safeFixClasses: [...PHASE1C_SAFE_FIX_CLASSES],
    isolatedWorkingCopyStrategy:
      ISOLATED_WORKING_COPY_STRATEGY,
    changedFiles: [...PHASE1C_CHANGED_FILES],
    policyResult: 'accepted',
    verificationResult: 'passed',
    cleanupResult,
  });

  const outputDirectory = resolve(repositoryRoot, PHASE1C_OUTPUT_DIRECTORY);
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, 'patch.diff'), patch, 'utf8');
  await writeFile(resolve(outputDirectory, 'replay.spec.ts'), replaySpec, 'utf8');
  await writeFile(
    resolve(outputDirectory, 'manual-review.md'),
    MANUAL_REVIEW_CONTENT,
    'utf8',
  );

  await writeValidatedJson(
    resolve(outputDirectory, 'verification.json'),
    verification,
    VerificationSchema,
  );
  await writeValidatedJson(
    resolve(outputDirectory, 'patch-audit.json'),
    audit,
    PatchAuditSchema,
  );

  return { verification, audit };
}
