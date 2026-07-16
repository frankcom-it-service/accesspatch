import { createServer } from 'node:net';
import { spawn, type ChildProcess } from 'node:child_process';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import { execFile as execFileCallback } from 'node:child_process';
import {
  PATCH_AUDIT_SCHEMA_VERSION,
  PATCH_ENGINE_VERSION,
  ISOLATED_WORKING_COPY_STRATEGY,
  MUTATION_GUARD_FIXTURE_FILES,
  MUTATION_GUARD_FIXTURE_ID,
  MUTATION_GUARD_EXPECTED_FIXTURE_SHA256,
  MUTATION_GUARD_ID,
  MUTATION_GUARD_OUTPUT_DIRECTORY,
  MUTATION_GUARD_RULE,
  MUTATION_GUARD_SCHEMA_VERSION,
  MUTATION_GUARD_TARGET_PATH,
  MUTATION_GUARD_TARGET_SELECTOR,
  MUTATION_GUARD_TYPE,
  MUTATION_GUARD_WORK_DIRECTORY,
  PHASE1C_CHANGED_FILES,
  PHASE1C_OUTPUT_DIRECTORY,
  PHASE1C_SAFE_FIX_CLASSES,
  REVIEWED_PHASE1B_HASHES,
  VERIFICATION_SCHEMA_VERSION,
} from './constants.ts';
import {
  copyMutationFixtureWithoutSymlinks,
  copyRepositoryWithoutSymlinks,
} from './copy-policy.ts';
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
  MutationDetectionObservationSchema,
  MutationGuardResultSchema,
  RepairedFocusValuesSchema,
  VerificationSchema,
  type MutationDetectionObservation,
  type MutationGuardResult,
  type PatchAudit,
  type Verification,
} from './schemas.ts';
import {
  applyExplicitLabelTemplate,
  applyFocusVisibleTemplate,
  controlledTemplateFixtures,
  injectAriaHiddenFocusableMutation,
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

async function waitForServer(
  url: string,
  processExited: () => boolean,
  signal?: AbortSignal,
): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (signal?.aborted) {
      throw new Error('mutation_guard_interrupted');
    }
    if (processExited()) {
      throw new Error('isolated_vite_server_exited');
    }
    try {
      const response = await fetch(url, { signal });
      if (response.ok) {
        return;
      }
    } catch {
      if (signal?.aborted) {
        throw new Error('mutation_guard_interrupted');
      }
      await new Promise<void>((resolveDelay, rejectDelay) => {
        const timeout = setTimeout(resolveDelay, 150);
        signal?.addEventListener(
          'abort',
          () => {
            clearTimeout(timeout);
            rejectDelay(new Error('mutation_guard_interrupted'));
          },
          { once: true },
        );
      });
    }
  }
  throw new Error('isolated_vite_server_timeout');
}

async function stopProcess(process: ReturnType<typeof spawn>): Promise<void> {
  if (process.exitCode !== null) {
    return;
  }
  try {
    process.kill('SIGTERM');
  } catch {
    return;
  }
  await new Promise<void>((resolveExit) => {
    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      resolveExit();
    };
    const timeout = setTimeout(() => {
      try {
        process.kill('SIGKILL');
      } finally {
        finish();
      }
    }, 5_000);
    process.once('exit', finish);
    process.once('error', finish);
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

export interface MutationDetectorEvaluation {
  detected: boolean;
  detectionCount: number;
  focusEvidence: MutationDetectionObservation['focusEvidence'];
  ariaHiddenValue: string | null;
  ariaHiddenTrueMatchCount: number;
}

export interface MutationGuardDependencies {
  detectMutation?: (
    repositoryRoot: string,
    workingCopyRoot: string,
    runtimeRoot: string,
    signal?: AbortSignal,
  ) => Promise<MutationDetectionObservation>;
  removeRuntimeRoot?: (
    path: string,
    rootType: 'contained' | 'external',
  ) => Promise<void>;
  signal?: AbortSignal;
}

export interface MutationDetectorDependencies {
  executePlaywright?: (
    executable: string,
    arguments_: string[],
    options: {
      cwd: string;
      env: NodeJS.ProcessEnv;
      maxBuffer: number;
      signal?: AbortSignal;
    },
  ) => Promise<{ stdout: string; stderr: string }>;
  getPort?: () => Promise<number>;
  resolveChromiumExecutable?: () => Promise<string | undefined>;
  spawnVite?: (
    executable: string,
    arguments_: string[],
    options: {
      cwd: string;
      env: NodeJS.ProcessEnv;
      stdio: ['ignore', 'ignore', 'ignore'];
    },
  ) => ChildProcess;
  stopVite?: (process: ChildProcess) => Promise<void>;
  waitForVite?: (
    url: string,
    processExited: () => boolean,
    signal?: AbortSignal,
  ) => Promise<void>;
}

export interface MutationChildDirectories {
  home: string;
  config: string;
  cache: string;
  temporary: string;
  appData: string;
  localAppData: string;
}

export interface MutationRuntimePaths {
  workParent: string;
  evidenceParent: string;
  outputDirectory: string;
}

function mutationChildDirectories(runtimeRoot: string): MutationChildDirectories {
  return {
    home: resolve(runtimeRoot, 'home'),
    config: resolve(runtimeRoot, 'config'),
    cache: resolve(runtimeRoot, 'cache'),
    temporary: resolve(runtimeRoot, 'tmp'),
    appData: resolve(runtimeRoot, 'config', 'appdata'),
    localAppData: resolve(runtimeRoot, 'cache', 'localappdata'),
  };
}

export function createMutationChildEnvironment(
  environment: NodeJS.ProcessEnv,
  runtimeRoot: string,
): NodeJS.ProcessEnv {
  const directories = mutationChildDirectories(runtimeRoot);
  const result: NodeJS.ProcessEnv = {};
  for (const key of ['PATH', 'SYSTEMROOT']) {
    if (environment[key]) {
      result[key] = environment[key];
    }
  }
  return {
    ...result,
    ALL_PROXY: 'http://127.0.0.1:9',
    APPDATA: directories.appData,
    CI: '1',
    HOME: directories.home,
    HTTP_PROXY: 'http://127.0.0.1:9',
    HTTPS_PROXY: 'http://127.0.0.1:9',
    LOCALAPPDATA: directories.localAppData,
    NO_COLOR: '1',
    NO_PROXY: '127.0.0.1,localhost',
    TEMP: directories.temporary,
    TMP: directories.temporary,
    TMPDIR: directories.temporary,
    USERPROFILE: directories.home,
    XDG_CACHE_HOME: directories.cache,
    XDG_CONFIG_HOME: directories.config,
    all_proxy: 'http://127.0.0.1:9',
    http_proxy: 'http://127.0.0.1:9',
    https_proxy: 'http://127.0.0.1:9',
    no_proxy: '127.0.0.1,localhost',
  };
}

async function lstatIfPresent(path: string) {
  try {
    return await lstat(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

function assertContainedPath(
  realRepositoryRoot: string,
  candidate: string,
  category: string,
): void {
  const containment = relative(realRepositoryRoot, candidate);
  if (
    containment === '..' ||
    containment.startsWith(`..${sep}`) ||
    isAbsolute(containment)
  ) {
    throw new Error(`${category}_escape`);
  }
}

async function ensureSafeDirectory(
  realRepositoryRoot: string,
  directory: string,
  category: string,
): Promise<void> {
  let stats = await lstatIfPresent(directory);
  if (!stats) {
    await mkdir(directory, { mode: 0o700 });
    stats = await lstat(directory);
  }
  if (stats.isSymbolicLink()) {
    throw new Error(`${category}_symlink`);
  }
  if (!stats.isDirectory()) {
    throw new Error(`${category}_not_directory`);
  }
  const resolvedDirectory = await realpath(directory);
  assertContainedPath(realRepositoryRoot, resolvedDirectory, category);
}

async function assertOptionalSafeDirectory(
  realRepositoryRoot: string,
  directory: string,
  category: string,
): Promise<void> {
  const stats = await lstatIfPresent(directory);
  if (!stats) {
    return;
  }
  if (stats.isSymbolicLink()) {
    throw new Error(`${category}_symlink`);
  }
  if (!stats.isDirectory()) {
    throw new Error(`${category}_not_directory`);
  }
  const resolvedDirectory = await realpath(directory);
  assertContainedPath(realRepositoryRoot, resolvedDirectory, category);
}

export async function prepareMutationRuntimePaths(
  repositoryRoot: string,
): Promise<MutationRuntimePaths> {
  const resolvedRepositoryRoot = resolve(repositoryRoot);
  const realRepositoryRoot = await realpath(resolvedRepositoryRoot);
  const accessPatchDirectory = resolve(resolvedRepositoryRoot, '.accesspatch');
  const workParent = resolve(resolvedRepositoryRoot, MUTATION_GUARD_WORK_DIRECTORY);
  const runsDirectory = resolve(resolvedRepositoryRoot, '.accesspatch/runs');
  const evidenceParent = resolve(resolvedRepositoryRoot, '.accesspatch/runs/phase5a');
  const outputDirectory = resolve(
    resolvedRepositoryRoot,
    MUTATION_GUARD_OUTPUT_DIRECTORY,
  );

  for (const [directory, category] of [
    [accessPatchDirectory, 'mutation_runtime_accesspatch'],
    [workParent, 'mutation_runtime_work'],
    [runsDirectory, 'mutation_runtime_runs'],
    [evidenceParent, 'mutation_runtime_phase5a'],
    [outputDirectory, 'mutation_runtime_output'],
  ] as const) {
    await assertOptionalSafeDirectory(
      realRepositoryRoot,
      directory,
      category,
    );
  }

  await ensureSafeDirectory(
    realRepositoryRoot,
    accessPatchDirectory,
    'mutation_runtime_accesspatch',
  );
  await ensureSafeDirectory(
    realRepositoryRoot,
    workParent,
    'mutation_runtime_work',
  );
  await ensureSafeDirectory(
    realRepositoryRoot,
    runsDirectory,
    'mutation_runtime_runs',
  );
  await ensureSafeDirectory(
    realRepositoryRoot,
    evidenceParent,
    'mutation_runtime_phase5a',
  );
  await assertOptionalSafeDirectory(
    realRepositoryRoot,
    outputDirectory,
    'mutation_runtime_output',
  );

  return { workParent, evidenceParent, outputDirectory };
}

async function prepareMutationChildDirectories(runtimeRoot: string): Promise<void> {
  const runtimeStats = await lstatIfPresent(runtimeRoot);
  if (!runtimeStats) {
    await mkdir(runtimeRoot, { mode: 0o700 });
  } else if (runtimeStats.isSymbolicLink() || !runtimeStats.isDirectory()) {
    throw new Error('mutation_child_runtime_invalid');
  }
  const realRuntimeRoot = await realpath(runtimeRoot);
  for (const [name, directory] of Object.entries(
    mutationChildDirectories(runtimeRoot),
  )) {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const stats = await lstat(directory);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw new Error(`mutation_child_${name}_invalid`);
    }
    assertContainedPath(
      realRuntimeRoot,
      await realpath(directory),
      `mutation_child_${name}`,
    );
  }
}

async function resolveMutationChromiumExecutable(): Promise<string | undefined> {
  const configuredBrowser = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const systemBrowser = '/usr/bin/chromium';
  const candidate = configuredBrowser ?? systemBrowser;
  try {
    const stats = await lstat(candidate);
    if (stats.isSymbolicLink() || !stats.isFile()) {
      throw new Error('mutation_detector_browser_invalid');
    }
    return candidate;
  } catch (error) {
    if (
      !configuredBrowser &&
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return undefined;
    }
    if (
      error instanceof Error &&
      error.message === 'mutation_detector_browser_invalid'
    ) {
      throw error;
    }
    throw new Error('mutation_detector_browser_invalid');
  }
}

interface ManagedMutationViteProcess {
  process: ChildProcess;
  processExited: () => boolean;
}

function startManagedMutationViteProcess(
  executable: string,
  arguments_: string[],
  options: {
    cwd: string;
    env: NodeJS.ProcessEnv;
    stdio: ['ignore', 'ignore', 'ignore'];
  },
  spawnVite: NonNullable<MutationDetectorDependencies['spawnVite']>,
): ManagedMutationViteProcess {
  let viteProcess: ChildProcess | undefined;
  let spawnFailed = false;
  try {
    viteProcess = spawnVite(executable, arguments_, options);
    viteProcess.once('error', () => {
      spawnFailed = true;
    });
    return {
      process: viteProcess,
      processExited: () => {
        if (spawnFailed) {
          throw new Error('mutation_detector_vite_spawn_failed');
        }
        return viteProcess?.exitCode !== null;
      },
    };
  } catch {
    if (viteProcess && viteProcess.exitCode === null) {
      try {
        viteProcess.kill('SIGTERM');
      } catch {}
    }
    throw new Error('mutation_detector_vite_spawn_failed');
  }
}

export function isApprovedMutationTargetFocusable(
  evidence: MutationDetectionObservation['focusEvidence'],
): boolean {
  return (
    evidence.exists &&
    evidence.tagName === 'BUTTON' &&
    !evidence.disabled &&
    evidence.tabIndex >= 0 &&
    evidence.visible &&
    evidence.activeElement &&
    evidence.keyboardFocusConfirmed
  );
}

export function evaluateMutationDetection(
  observation: MutationDetectionObservation,
): MutationDetectorEvaluation {
  const validated = MutationDetectionObservationSchema.parse(observation);
  const detected =
    validated.targetMatchCount === 1 &&
    validated.ariaHiddenTrueMatchCount === 1 &&
    validated.ariaHiddenValue === 'true' &&
    isApprovedMutationTargetFocusable(validated.focusEvidence);
  return {
    detected,
    detectionCount: detected ? 1 : 0,
    focusEvidence: validated.focusEvidence,
    ariaHiddenValue: validated.ariaHiddenValue,
    ariaHiddenTrueMatchCount: validated.ariaHiddenTrueMatchCount,
  };
}

export function createMutationDetectorSpec(): string {
  return `import { expect, test } from '@playwright/test';

test('detects the controlled aria-hidden focusable mutation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Insulated sample mug', level: 1 })).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Add product to cart' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Cart: 1 item')).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Open checkout' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\\/checkout$/);
  await expect(page.getByRole('heading', { name: 'Shipping and contact', level: 1 })).toBeFocused();

  for (let index = 0; index < 7; index += 1) {
    await page.keyboard.press('Tab');
  }

  const target = page.locator('${MUTATION_GUARD_TARGET_SELECTOR}');
  await expect(target).toHaveCount(1);
  await expect(target).toBeFocused();
  const targetMatchCount = await target.count();
  const ariaHiddenTrueMatchCount = await page
    .locator('${MUTATION_GUARD_TARGET_SELECTOR}[aria-hidden="true"]')
    .count();
  const targetState = await target.evaluate((element) => {
    const control = element as HTMLButtonElement;
    const styles = getComputedStyle(control);
    const visible =
      styles.display !== 'none' &&
      styles.visibility !== 'hidden' &&
      control.getClientRects().length > 0;
    const activeElement = document.activeElement === control;
    return {
      ariaHiddenValue: control.getAttribute('aria-hidden'),
      focusEvidence: {
        exists: true,
        tagName: control.tagName,
        disabled: control.disabled,
        tabIndex: control.tabIndex,
        visible,
        activeElement,
        keyboardFocusConfirmed: activeElement,
      },
    };
  });
  console.log(
    'MUTATION_GUARD_DETECTION_OBSERVATION=' +
      JSON.stringify({
        targetMatchCount,
        ariaHiddenTrueMatchCount,
        ...targetState,
      }),
  );
});
`;
}

async function fixtureHash(root: string): Promise<string> {
  const entries = await Promise.all(
    MUTATION_GUARD_FIXTURE_FILES.map(async (path) => {
      const content = await readFile(resolve(root, path));
      return `${path}\0${sha256(content)}`;
    }),
  );
  return sha256(entries.join('\n'));
}

async function changedMutationFixtureFiles(
  root: string,
  before: Record<string, string>,
): Promise<string[]> {
  const changed: string[] = [];
  for (const path of MUTATION_GUARD_FIXTURE_FILES) {
    if (sha256(await readFile(resolve(root, path))) !== before[path]) {
      changed.push(path);
    }
  }
  return changed;
}

export async function runMutationDetector(
  repositoryRoot: string,
  workingCopyRoot: string,
  runtimeRoot: string,
  signal?: AbortSignal,
  dependencies: MutationDetectorDependencies = {},
): Promise<MutationDetectionObservation> {
  const port = await (dependencies.getPort ?? getAvailablePort)();
  const baseUrl = `http://127.0.0.1:${port}`;
  await prepareMutationChildDirectories(runtimeRoot);
  const viteConfigPath = await writeTemporaryViteConfig(
    repositoryRoot,
    runtimeRoot,
  );
  const detectorPath = resolve(runtimeRoot, 'mutation-guard.spec.ts');
  const configPath = resolve(runtimeRoot, 'playwright.config.mjs');
  await writeFile(detectorPath, createMutationDetectorSpec(), 'utf8');

  const executablePath = await (
    dependencies.resolveChromiumExecutable ??
    resolveMutationChromiumExecutable
  )();
  const config = {
    testDir: runtimeRoot,
    fullyParallel: false,
    forbidOnly: true,
    retries: 0,
    workers: 1,
    reporter: [['line']],
    outputDir: resolve(runtimeRoot, 'test-results'),
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
          ...(executablePath
            ? { launchOptions: { executablePath } }
            : {}),
        },
      },
    ],
  };
  await writeFile(configPath, `export default ${JSON.stringify(config, null, 2)};\n`);
  const environment = createMutationChildEnvironment(
    process.env,
    runtimeRoot,
  );
  const managedViteProcess = startManagedMutationViteProcess(
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
      env: environment,
      stdio: ['ignore', 'ignore', 'ignore'],
    },
    dependencies.spawnVite ?? spawn,
  );

  try {
    await (dependencies.waitForVite ?? waitForServer)(
      baseUrl,
      managedViteProcess.processExited,
      signal,
    );
    let output: string;
    try {
      const result = await (dependencies.executePlaywright ?? execFile)(
        resolve(repositoryRoot, 'node_modules/.bin/playwright'),
        ['test', 'mutation-guard.spec.ts', `--config=${configPath}`],
        {
          cwd: runtimeRoot,
          env: environment,
          maxBuffer: 8_000_000,
          signal,
        },
      );
      output = `${result.stdout}${result.stderr}`;
    } catch (error) {
      if (signal?.aborted) {
        throw new Error('mutation_guard_interrupted');
      }
      const failure = error as {
        stdout?: string;
        stderr?: string;
      };
      const failureOutput = `${failure.stdout ?? ''}${failure.stderr ?? ''}`;
      const failureCategory = failureOutput.includes('toBeFocused')
        ? 'focus_assertion'
        : failureOutput.includes('No tests found')
          ? 'test_discovery'
          : failureOutput.includes('chrome_crashpad_handler')
            ? 'browser_crashpad'
            : failureOutput.includes('Permission denied') ||
                failureOutput.includes('EACCES')
              ? 'browser_permission'
              : failureOutput.includes('Target page, context or browser has been closed')
                ? 'browser_closed'
                : failureOutput.includes('browserType.launch')
                  ? 'browser_launch'
            : failureOutput.includes('page.goto')
              ? 'navigation'
              : 'unknown';
      throw new Error(
        `mutation_detector_process_failed_${failureCategory}`,
      );
    }
    const match = output.match(
      /MUTATION_GUARD_DETECTION_OBSERVATION=(\{[^\n]+\})/,
    );
    if (!match?.[1]) {
      throw new Error('mutation_detector_observation_missing');
    }
    return MutationDetectionObservationSchema.parse(JSON.parse(match[1]));
  } finally {
    await (dependencies.stopVite ?? stopProcess)(
      managedViteProcess.process,
    );
  }
}

function mutationResultMarkdown(result: MutationGuardResult): string {
  return `# Accessibility Mutation Guard Result

- Status: passed
- Mutation: \`${result.mutationId}\`
- Detector rule: \`${result.detectedRuleId}\`
- Target: \`${result.targetRelativePath}\` / \`${result.targetSelector}\`
- Injected mutations: ${result.injectedMutationCount}
- Detected mutations: ${result.mutationDetectionCount}
- Keyboard focus confirmed: ${result.focusEvidence.keyboardFocusConfirmed}
- \`aria-hidden\` value: \`${result.ariaHiddenEvidence.attributeValue}\`
- Disposable copy cleanup: ${result.cleanupResult}
- Original fixture unchanged: ${result.originalFixtureUnchanged}

This optional demonstration covers one controlled mutation class in one disposable checkout fixture. It is not broad mutation testing, complete WCAG coverage, accessibility certification, legal-compliance verification, retained patch application, or a replacement for qualified human review.
`;
}

async function writeMutationGuardArtifacts(
  repositoryRoot: string,
  result: MutationGuardResult,
): Promise<void> {
  const {
    evidenceParent: outputParent,
    outputDirectory,
  } = await prepareMutationRuntimePaths(repositoryRoot);
  const temporaryDirectory = await mkdtemp(
    join(outputParent, '.mutation-guard-'),
  );
  try {
    const temporaryStats = await lstat(temporaryDirectory);
    if (temporaryStats.isSymbolicLink() || !temporaryStats.isDirectory()) {
      throw new Error('mutation_runtime_temporary_invalid');
    }
    await writeFile(
      resolve(temporaryDirectory, 'result.json'),
      `${JSON.stringify(MutationGuardResultSchema.parse(result), null, 2)}\n`,
      'utf8',
    );
    await writeFile(
      resolve(temporaryDirectory, 'result.md'),
      mutationResultMarkdown(result),
      'utf8',
    );
    await prepareMutationRuntimePaths(repositoryRoot);
    await rm(outputDirectory, { recursive: true, force: true });
    await rename(temporaryDirectory, outputDirectory);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

function occurrenceCount(content: string, expected: string): number {
  return content.split(expected).length - 1;
}

export async function calculateMutationGuardFixtureSha256(
  repositoryRoot: string,
): Promise<string> {
  const entries = await Promise.all(
    MUTATION_GUARD_FIXTURE_FILES.map(async (path) => {
      try {
        const stats = await lstat(resolve(repositoryRoot, path));
        if (stats.isSymbolicLink() || !stats.isFile()) {
          throw new Error(`mutation_fixture_not_regular:${path}`);
        }
        return `${path}\0${sha256(await readFile(resolve(repositoryRoot, path)))}`;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new Error(`mutation_fixture_file_missing:${path}`);
        }
        throw error;
      }
    }),
  );
  return sha256(entries.join('\n'));
}

export async function assertMutationGuardFixtureIntegrity(
  repositoryRoot: string,
): Promise<string> {
  const targetPath = resolve(repositoryRoot, MUTATION_GUARD_TARGET_PATH);
  let targetStats;
  try {
    targetStats = await lstat(targetPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `mutation_fixture_file_missing:${MUTATION_GUARD_TARGET_PATH}`,
      );
    }
    throw error;
  }
  if (targetStats.isSymbolicLink() || !targetStats.isFile()) {
    throw new Error(
      `mutation_fixture_not_regular:${MUTATION_GUARD_TARGET_PATH}`,
    );
  }
  const source = await readFile(
    targetPath,
    'utf8',
  );
  const injectedCount = occurrenceCount(
    source,
    controlledTemplateFixtures.mutationGuardInjectedTarget,
  );
  if (injectedCount !== 0) {
    throw new Error(`mutation_fixture_already_mutated:${injectedCount}`);
  }
  const targetCount = occurrenceCount(
    source,
    controlledTemplateFixtures.mutationGuardTarget,
  );
  if (targetCount !== 1) {
    throw new Error(`mutation_fixture_target_count:${targetCount}`);
  }
  const fixtureSha256 = await calculateMutationGuardFixtureSha256(
    repositoryRoot,
  );
  if (fixtureSha256 !== MUTATION_GUARD_EXPECTED_FIXTURE_SHA256) {
    throw new Error('mutation_fixture_hash_mismatch');
  }
  return fixtureSha256;
}

async function assertMutationGuardRepositoryPreflight(
  repositoryRoot: string,
): Promise<void> {
  const root = (
    await execFile('git', ['rev-parse', '--show-toplevel'], {
      cwd: repositoryRoot,
    })
  ).stdout.trim();
  if (resolve(root) !== resolve(repositoryRoot)) {
    throw new Error('mutation_guard_repository_root_invalid');
  }
  try {
    await execFile(
      'git',
      ['check-ignore', '-q', `${MUTATION_GUARD_OUTPUT_DIRECTORY}/result.json`],
      { cwd: repositoryRoot },
    );
    await execFile(
      'git',
      ['check-ignore', '-q', `${MUTATION_GUARD_WORK_DIRECTORY}/probe`],
      { cwd: repositoryRoot },
    );
  } catch {
    throw new Error('mutation_guard_runtime_paths_not_ignored');
  }
  await assertMutationGuardFixtureIntegrity(repositoryRoot);
}

export async function runMutationGuardCore(
  repositoryRoot: string,
  dependencies: MutationGuardDependencies = {},
): Promise<MutationGuardResult> {
  const originalFixtureSha256Before =
    await assertMutationGuardFixtureIntegrity(repositoryRoot);
  const { outputDirectory, workParent } =
    await prepareMutationRuntimePaths(repositoryRoot);
  await rm(outputDirectory, { recursive: true, force: true });
  const originalFileHashes = Object.fromEntries(
    await Promise.all(
      MUTATION_GUARD_FIXTURE_FILES.map(async (path) => [
        path,
        sha256(await readFile(resolve(repositoryRoot, path))),
      ]),
    ),
  );
  const runRoot = await mkdtemp(join(workParent, 'mutation-guard-'));
  const runRootStats = await lstat(runRoot);
  if (runRootStats.isSymbolicLink() || !runRootStats.isDirectory()) {
    throw new Error('mutation_runtime_run_root_invalid');
  }
  const workingCopyRoot = resolve(runRoot, 'repository');
  let runtimeRoot: string | undefined;
  const detectMutation = dependencies.detectMutation ?? runMutationDetector;
  let disposableCopySha256Before = '';
  let disposableCopySha256After = '';
  let evaluation: MutationDetectorEvaluation | undefined;
  let cleanupResult: 'removed' | 'failed' = 'failed';
  let operationError: unknown;

  try {
    runtimeRoot = await mkdtemp(join(tmpdir(), 'accesspatch-mutation-runtime-'));
    const runtimeStats = await lstat(runtimeRoot);
    if (runtimeStats.isSymbolicLink() || !runtimeStats.isDirectory()) {
      throw new Error('mutation_runtime_external_root_invalid');
    }
    if (dependencies.signal?.aborted) {
      throw new Error('mutation_guard_interrupted');
    }
    await copyMutationFixtureWithoutSymlinks(
      repositoryRoot,
      workingCopyRoot,
    );
    disposableCopySha256Before = await fixtureHash(workingCopyRoot);
    if (disposableCopySha256Before !== originalFixtureSha256Before) {
      throw new Error('mutation_guard_copy_hash_mismatch');
    }
    const targetPath = resolve(workingCopyRoot, MUTATION_GUARD_TARGET_PATH);
    await writeFile(
      targetPath,
      injectAriaHiddenFocusableMutation(
        await readFile(targetPath, 'utf8'),
      ),
      'utf8',
    );
    if (dependencies.signal?.aborted) {
      throw new Error('mutation_guard_interrupted');
    }
    disposableCopySha256After = await fixtureHash(workingCopyRoot);
    const changedFiles = await changedMutationFixtureFiles(
      workingCopyRoot,
      originalFileHashes,
    );
    if (
      JSON.stringify(changedFiles) !==
      JSON.stringify([MUTATION_GUARD_TARGET_PATH])
    ) {
      throw new Error(
        `mutation_guard_changed_files_invalid:${changedFiles.join(',')}`,
      );
    }
    const observation = await detectMutation(
      repositoryRoot,
      workingCopyRoot,
      runtimeRoot,
      dependencies.signal,
    );
    if (dependencies.signal?.aborted) {
      throw new Error('mutation_guard_interrupted');
    }
    evaluation = evaluateMutationDetection(observation);
    if (!evaluation.detected || evaluation.detectionCount !== 1) {
      throw new Error(
        `controlled_mutation_not_detected:${evaluation.detectionCount}`,
      );
    }
  } catch (error) {
    operationError = error;
  } finally {
    const cleanupFailures = new Set<'contained' | 'external'>();
    const removeRuntimeRoot =
      dependencies.removeRuntimeRoot ??
      (async (path: string) => rm(path, { recursive: true, force: true }));
    for (const [path, rootType] of [
      [runRoot, 'contained'],
      [runtimeRoot, 'external'],
    ] as const) {
      if (!path) {
        continue;
      }
      try {
        await removeRuntimeRoot(path, rootType);
      } catch {
        cleanupFailures.add(rootType);
      }
    }
    for (const [path, rootType] of [
      [runRoot, 'contained'],
      [runtimeRoot, 'external'],
    ] as const) {
      if (!path) {
        continue;
      }
      try {
        await lstat(path);
        cleanupFailures.add(rootType);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          cleanupFailures.add(rootType);
        }
      }
    }
    if (cleanupFailures.size === 0) {
      cleanupResult = 'removed';
    }
  }

  const originalFixtureSha256After =
    await calculateMutationGuardFixtureSha256(repositoryRoot);
  const originalFixtureUnchanged =
    originalFixtureSha256After === originalFixtureSha256Before;
  if (!originalFixtureUnchanged) {
    throw new Error('mutation_guard_original_fixture_changed');
  }
  if (cleanupResult !== 'removed') {
    throw new Error('mutation_guard_cleanup_failed');
  }
  if (operationError) {
    throw operationError;
  }
  if (!evaluation) {
    throw new Error('mutation_guard_verification_incomplete');
  }

  const result = MutationGuardResultSchema.parse({
    schemaVersion: MUTATION_GUARD_SCHEMA_VERSION,
    mutationId: MUTATION_GUARD_ID,
    mutationType: MUTATION_GUARD_TYPE,
    sourceFixtureId: MUTATION_GUARD_FIXTURE_ID,
    targetRelativePath: MUTATION_GUARD_TARGET_PATH,
    targetSelector: MUTATION_GUARD_TARGET_SELECTOR,
    mutationDescription:
      'Inject aria-hidden="true" on the existing keyboard-focusable checkout submit button inside a disposable copy.',
    originalFixtureSha256Before,
    disposableCopySha256Before,
    disposableCopySha256After,
    injectedMutationCount: 1,
    detectorResult: 'detected',
    detectedRuleId: MUTATION_GUARD_RULE,
    focusEvidence: evaluation.focusEvidence,
    ariaHiddenEvidence: {
      attributeName: 'aria-hidden',
      attributeValue: 'true',
      matchingElementCount: evaluation.ariaHiddenTrueMatchCount,
    },
    mutationDetectionCount: evaluation.detectionCount,
    cleanupResult,
    originalFixtureSha256After,
    originalFixtureUnchanged,
    finalStatus: 'passed',
  });
  await writeMutationGuardArtifacts(repositoryRoot, result);
  return result;
}

export async function runMutationGuard(
  repositoryRoot = process.cwd(),
  dependencies: MutationGuardDependencies = {},
): Promise<MutationGuardResult> {
  await assertMutationGuardRepositoryPreflight(repositoryRoot);
  return runMutationGuardCore(repositoryRoot, dependencies);
}

export function mutationGuardSuccessOutput(
  result: MutationGuardResult,
): readonly string[] {
  MutationGuardResultSchema.parse(result);
  return [
    `MUTATION_GUARD_ID=${result.mutationId}`,
    `MUTATION_GUARD_RULE=${result.detectedRuleId}`,
    `MUTATION_GUARD_INJECTED=${result.injectedMutationCount}`,
    `MUTATION_GUARD_DETECTED=${result.mutationDetectionCount}`,
    `MUTATION_GUARD_ORIGINAL_UNCHANGED=${result.originalFixtureUnchanged}`,
    'MUTATION_GUARD_CLEANUP=passed',
    'MUTATION_GUARD_VALID',
  ] as const;
}
