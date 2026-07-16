import { createHash } from 'node:crypto';
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  rmdir,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import {
  JUDGE_SAMPLE_APPROVED_HASHES,
  JUDGE_SAMPLE_DIRECTORY,
  validateJudgeSample,
} from '../packages/proof-bundle/src/index.ts';

export const PHASE2C_IMPLEMENTATION_COMMIT =
  'e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce';
export const PHASE2C_GOVERNANCE_COMMIT =
  '378da8333ed9d83aa9fc35b2a6c7f638ca80ef68';
export const JUDGE_WORKFLOW_OUTPUT_DIRECTORY =
  '.accesspatch/work/judge-verify';
export const JUDGE_WORKFLOW_RUNTIME_CONFIG_DIRECTORY =
  `${JUDGE_WORKFLOW_OUTPUT_DIRECTORY}/runtime-config`;

export const JUDGE_WORKFLOW_STAGES = [
  { id: 'repository-contract-preflight', command: null },
  { id: 'api-free-unit-tests', command: ['pnpm', 'test:unit'] },
  { id: 'typescript-type-check', command: ['pnpm', 'typecheck'] },
  { id: 'production-build', command: ['pnpm', 'build'] },
  { id: 'application-smoke', command: ['pnpm', 'test:smoke'] },
  { id: 'controlled-baseline-proof', command: ['pnpm', 'test:judge-baseline'] },
  { id: 'tracked-judge-sample-validator', command: ['pnpm', 'judge:sample:validate'] },
  {
    id: 'tracked-report-smoke',
    command: ['pnpm', 'test:judge-sample-report'],
  },
] as const;

export const JUDGE_WORKFLOW_FINAL_OUTPUT = [
  'JUDGE_WORKFLOW_SAMPLE_PATH=examples/judge-sample/proof-bundle',
  'JUDGE_WORKFLOW_FINDINGS=2',
  'JUDGE_WORKFLOW_WCAG_MAPPINGS=3',
  'JUDGE_WORKFLOW_BASELINE=expected-controlled-defects-confirmed',
  'JUDGE_WORKFLOW_REPAIRED_EVIDENCE=validated',
  'JUDGE_WORKFLOW_REPORT_AXE_VIOLATIONS=0',
  'JUDGE_WORKFLOW_SECURITY=passed',
  'JUDGE_WORKFLOW_VALID',
] as const;

const EXPECTED_REPOSITORY_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
);
const REQUIRED_ROOT_FILES = [
  'package.json',
  'pnpm-lock.yaml',
  'AGENTS.md',
  'examples/judge-sample/SHA256SUMS',
] as const;
const CONTROLLED_SOURCE_MARKERS = {
  'apps/demo-checkout/src/App.tsx': [
    '<span className="field-label">Email address</span>',
    'className="button button-primary controlled-focus-defect"',
  ],
  'apps/demo-checkout/src/styles.css': [
    '.controlled-focus-defect:focus,',
    '.controlled-focus-defect:focus-visible {',
    'outline: none;',
    'box-shadow: none;',
  ],
} as const;
const EXECUTION_SENSITIVE_UNTRACKED_PREFIXES = [
  'apps/',
  'examples/judge-sample/',
  'packages/',
  'scripts/',
  'tests/',
] as const;

export interface ProcessResult {
  status: number;
  stdout: string;
  stderr: string;
}

export type GitRunner = (
  arguments_: readonly string[],
  repositoryRoot: string,
) => Promise<ProcessResult>;

export interface RepositorySnapshot {
  trackedHashes: Record<string, string>;
  sampleFiles: Record<string, { hash: string; mtimeNs: string }>;
  status: string;
}

export interface JudgeWorkflowDependencies {
  validateContract?: typeof validateRepositoryContract;
  captureSnapshot?: typeof captureRepositorySnapshot;
  runStage?: (stage: (typeof JUDGE_WORKFLOW_STAGES)[number], root: string) => Promise<void>;
  prepareRuntimeConfiguration?: typeof createJudgeRuntimeConfiguration;
  cleanup?: (root: string) => Promise<void>;
  log?: (line: string) => void;
}

export interface JudgeRuntimeConfiguration {
  gitConfigPath: string;
  npmConfigPath: string;
}

function slash(path: string): string {
  return path.split(sep).join('/');
}

function sha256(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

async function assertRegularFile(root: string, path: string): Promise<void> {
  const stats = await lstat(join(root, path)).catch(() => null);
  if (!stats?.isFile() || stats.isSymbolicLink()) {
    throw new Error(`judge_repository_contract_file_invalid:${path}`);
  }
}

async function listSampleFiles(root: string): Promise<string[]> {
  const sampleRoot = join(root, JUDGE_SAMPLE_DIRECTORY);
  const files: string[] = [];
  async function visit(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolutePath = join(directory, entry.name);
      const relativePath = slash(relative(root, absolutePath));
      if (entry.isSymbolicLink()) {
        throw new Error(`judge_repository_sample_symlink:${relativePath}`);
      }
      if (entry.isDirectory()) {
        await visit(absolutePath);
      } else if (entry.isFile()) {
        files.push(relativePath);
      } else {
        throw new Error(`judge_repository_sample_special_file:${relativePath}`);
      }
    }
  }
  await visit(sampleRoot);
  return files.sort();
}

function expectedSampleFiles(): string[] {
  return [
    'examples/judge-sample/README.md',
    'examples/judge-sample/SHA256SUMS',
    ...Object.keys(JUDGE_SAMPLE_APPROVED_HASHES).map(
      (path) => `examples/judge-sample/proof-bundle/${path}`,
    ),
  ].sort();
}

function parseNullSeparated(output: string): string[] {
  return output.split('\0').filter(Boolean);
}

export async function defaultGitRunner(
  arguments_: readonly string[],
  repositoryRoot: string,
): Promise<ProcessResult> {
  return new Promise((resolveResult, reject) => {
    const child = spawn('git', [...arguments_], {
      cwd: repositoryRoot,
      env: createJudgeChildEnvironment(process.env, repositoryRoot),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.once('error', reject);
    child.once('close', (status) => {
      resolveResult({ status: status ?? 1, stdout, stderr });
    });
  });
}

async function requireGitSuccess(
  gitRunner: GitRunner,
  root: string,
  arguments_: readonly string[],
  category: string,
): Promise<ProcessResult> {
  const result = await gitRunner(arguments_, root);
  if (result.status !== 0) {
    throw new Error(`judge_repository_git_check_failed:${category}`);
  }
  return result;
}

export async function validateRepositoryContract(
  repositoryRoot: string,
  options: {
    expectedRoot?: string;
    gitRunner?: GitRunner;
    sampleValidator?: (sampleDirectory: string) => Promise<unknown>;
  } = {},
): Promise<void> {
  const expectedRoot = options.expectedRoot ?? EXPECTED_REPOSITORY_ROOT;
  const [actualRealRoot, expectedRealRoot] = await Promise.all([
    realpath(repositoryRoot),
    realpath(expectedRoot),
  ]);
  if (actualRealRoot !== expectedRealRoot) {
    throw new Error('judge_repository_root_invalid');
  }

  await Promise.all(REQUIRED_ROOT_FILES.map((path) => assertRegularFile(repositoryRoot, path)));
  const sampleFiles = await listSampleFiles(repositoryRoot);
  if (JSON.stringify(sampleFiles) !== JSON.stringify(expectedSampleFiles())) {
    throw new Error(`judge_repository_sample_inventory_invalid:${sampleFiles.join(',')}`);
  }

  for (const [path, markers] of Object.entries(CONTROLLED_SOURCE_MARKERS)) {
    const content = await readFile(join(repositoryRoot, path), 'utf8');
    if (markers.some((marker) => !content.includes(marker))) {
      throw new Error(`judge_repository_controlled_marker_missing:${path}`);
    }
  }

  await (options.sampleValidator ?? validateJudgeSample)(
    join(repositoryRoot, JUDGE_SAMPLE_DIRECTORY),
  );

  const gitRunner = options.gitRunner ?? defaultGitRunner;
  for (const commit of [PHASE2C_IMPLEMENTATION_COMMIT, PHASE2C_GOVERNANCE_COMMIT]) {
    await requireGitSuccess(
      gitRunner,
      repositoryRoot,
      ['merge-base', '--is-ancestor', commit, 'HEAD'],
      'required_commit',
    );
  }
  const trackedSample = await requireGitSuccess(
    gitRunner,
    repositoryRoot,
    ['ls-files', '-z', '--', JUDGE_SAMPLE_DIRECTORY],
    'tracked_sample',
  );
  if (
    JSON.stringify(parseNullSeparated(trackedSample.stdout).sort()) !==
    JSON.stringify(expectedSampleFiles())
  ) {
    throw new Error('judge_repository_tracked_sample_inventory_invalid');
  }
  const sampleStatus = await requireGitSuccess(
    gitRunner,
    repositoryRoot,
    ['status', '--porcelain=v1', '--untracked-files=no', '--', JUDGE_SAMPLE_DIRECTORY],
    'sample_status',
  );
  if (sampleStatus.stdout !== '') {
    throw new Error('judge_repository_tracked_sample_modified');
  }
  await requireGitSuccess(
    gitRunner,
    repositoryRoot,
    [
      'diff',
      '--quiet',
      'HEAD',
      '--',
      'apps/demo-checkout/src/App.tsx',
      'apps/demo-checkout/src/styles.css',
    ],
    'controlled_fixture_diff',
  );
  const untracked = await requireGitSuccess(
    gitRunner,
    repositoryRoot,
    ['ls-files', '--others', '--exclude-standard', '-z'],
    'untracked_files',
  );
  const unsafeUntracked = parseNullSeparated(untracked.stdout).filter((path) =>
    EXECUTION_SENSITIVE_UNTRACKED_PREFIXES.some((prefix) => path.startsWith(prefix)),
  );
  if (unsafeUntracked.length > 0) {
    throw new Error(`judge_repository_execution_sensitive_untracked:${unsafeUntracked.sort().join(',')}`);
  }
}

export function createJudgeChildEnvironment(
  environment: NodeJS.ProcessEnv,
  repositoryRoot: string,
): NodeJS.ProcessEnv {
  const allowedKeys = [
    'APPDATA',
    'COREPACK_HOME',
    'HOME',
    'LOCALAPPDATA',
    'PATH',
    'PLAYWRIGHT_BROWSERS_PATH',
    'PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH',
    'PNPM_HOME',
    'SYSTEMROOT',
    'TEMP',
    'TMP',
    'TMPDIR',
    'USERPROFILE',
  ];
  const result: NodeJS.ProcessEnv = {};
  for (const key of allowedKeys) {
    if (environment[key]) result[key] = environment[key];
  }
  const runtimeConfiguration = judgeRuntimeConfigurationPaths(repositoryRoot);
  return {
    ...result,
    ACCESSPATCH_JUDGE_WORKFLOW: '1',
    ALL_PROXY: 'http://127.0.0.1:9',
    CI: '1',
    GCM_INTERACTIVE: 'Never',
    GIT_CONFIG_GLOBAL: runtimeConfiguration.gitConfigPath,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_TERMINAL_PROMPT: '0',
    HTTP_PROXY: 'http://127.0.0.1:9',
    HTTPS_PROXY: 'http://127.0.0.1:9',
    NPM_CONFIG_AUDIT: 'false',
    NPM_CONFIG_FUND: 'false',
    NPM_CONFIG_GLOBALCONFIG: runtimeConfiguration.npmConfigPath,
    NPM_CONFIG_UPDATE_NOTIFIER: 'false',
    NPM_CONFIG_USERCONFIG: runtimeConfiguration.npmConfigPath,
    NO_COLOR: '1',
    NO_PROXY: '127.0.0.1,localhost',
    npm_config_audit: 'false',
    npm_config_fund: 'false',
    npm_config_globalconfig: runtimeConfiguration.npmConfigPath,
    npm_config_update_notifier: 'false',
    npm_config_userconfig: runtimeConfiguration.npmConfigPath,
    npm_config_verify_deps_before_run: 'false',
    pnpm_config_verify_deps_before_run: 'false',
  };
}

export function judgeRuntimeConfigurationPaths(
  repositoryRoot: string,
): JudgeRuntimeConfiguration {
  const directory = join(repositoryRoot, JUDGE_WORKFLOW_RUNTIME_CONFIG_DIRECTORY);
  return {
    gitConfigPath: join(directory, 'gitconfig'),
    npmConfigPath: join(directory, 'npmrc'),
  };
}

export async function createJudgeRuntimeConfiguration(
  repositoryRoot: string,
): Promise<JudgeRuntimeConfiguration> {
  const configuration = judgeRuntimeConfigurationPaths(repositoryRoot);
  const directory = dirname(configuration.gitConfigPath);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await Promise.all([
    writeFile(configuration.gitConfigPath, '', { flag: 'wx', mode: 0o600 }),
    writeFile(configuration.npmConfigPath, '', { flag: 'wx', mode: 0o600 }),
  ]);
  for (const path of [configuration.gitConfigPath, configuration.npmConfigPath]) {
    const stats = await lstat(path);
    if (!stats.isFile() || stats.isSymbolicLink() || stats.size !== 0) {
      throw new Error('judge_runtime_configuration_invalid');
    }
  }
  return configuration;
}

export async function runJudgeStage(
  stage: (typeof JUDGE_WORKFLOW_STAGES)[number],
  repositoryRoot: string,
): Promise<void> {
  if (!stage.command) return;
  await new Promise<void>((resolveStage, reject) => {
    const [command, ...arguments_] = stage.command;
    const child = spawn(command, arguments_, {
      cwd: repositoryRoot,
      env: createJudgeChildEnvironment(process.env, repositoryRoot),
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('close', (status) => {
      if (status === 0) {
        resolveStage();
      } else {
        reject(new Error(`judge_workflow_stage_failed:${stage.id}`));
      }
    });
  });
}

export async function captureRepositorySnapshot(
  repositoryRoot: string,
  gitRunner: GitRunner = defaultGitRunner,
): Promise<RepositorySnapshot> {
  const tracked = await requireGitSuccess(
    gitRunner,
    repositoryRoot,
    ['ls-files', '-z'],
    'snapshot_tracked',
  );
  const trackedHashes: Record<string, string> = {};
  for (const path of parseNullSeparated(tracked.stdout).sort()) {
    trackedHashes[path] = sha256(await readFile(join(repositoryRoot, path)));
  }

  const sampleFiles: RepositorySnapshot['sampleFiles'] = {};
  for (const path of expectedSampleFiles()) {
    const absolutePath = join(repositoryRoot, path);
    const [content, stats] = await Promise.all([
      readFile(absolutePath),
      lstat(absolutePath, { bigint: true }),
    ]);
    sampleFiles[path] = {
      hash: sha256(content),
      mtimeNs: stats.mtimeNs.toString(),
    };
  }
  const status = await requireGitSuccess(
    gitRunner,
    repositoryRoot,
    ['status', '--porcelain=v1', '--untracked-files=all'],
    'snapshot_status',
  );
  return { trackedHashes, sampleFiles, status: status.stdout };
}

export function assertRepositorySnapshotUnchanged(
  before: RepositorySnapshot,
  after: RepositorySnapshot,
): void {
  if (JSON.stringify(after.trackedHashes) !== JSON.stringify(before.trackedHashes)) {
    throw new Error('judge_workflow_tracked_bytes_changed');
  }
  if (JSON.stringify(after.sampleFiles) !== JSON.stringify(before.sampleFiles)) {
    throw new Error('judge_workflow_sample_state_changed');
  }
  if (after.status !== before.status) {
    throw new Error('judge_workflow_repository_status_changed');
  }
}

export async function cleanupJudgeWorkflowOutput(repositoryRoot: string): Promise<void> {
  await rm(join(repositoryRoot, JUDGE_WORKFLOW_OUTPUT_DIRECTORY), {
    recursive: true,
    force: true,
  });
  for (const path of ['.accesspatch/work', '.accesspatch']) {
    await rmdir(join(repositoryRoot, path)).catch((error: NodeJS.ErrnoException) => {
      if (!['ENOENT', 'ENOTEMPTY'].includes(error.code ?? '')) throw error;
    });
  }
}

export async function runJudgeWorkflow(
  repositoryRoot = process.cwd(),
  dependencies: JudgeWorkflowDependencies = {},
): Promise<void> {
  const validateContract = dependencies.validateContract ?? validateRepositoryContract;
  const captureSnapshot = dependencies.captureSnapshot ?? captureRepositorySnapshot;
  const runStage = dependencies.runStage ?? runJudgeStage;
  const prepareRuntimeConfiguration =
    dependencies.prepareRuntimeConfiguration ?? createJudgeRuntimeConfiguration;
  const cleanup = dependencies.cleanup ?? cleanupJudgeWorkflowOutput;
  const log = dependencies.log ?? console.log;

  await cleanup(repositoryRoot);
  let workflowError: unknown;
  let before: RepositorySnapshot | undefined;
  try {
    await prepareRuntimeConfiguration(repositoryRoot);
    const preflight = JUDGE_WORKFLOW_STAGES[0];
    log(`JUDGE_STAGE_START=1:${preflight.id}`);
    await validateContract(repositoryRoot);
    log(`JUDGE_STAGE_PASS=1:${preflight.id}`);

    before = await captureSnapshot(repositoryRoot);
    for (const [index, stage] of JUDGE_WORKFLOW_STAGES.slice(1).entries()) {
      const stageNumber = index + 2;
      log(`JUDGE_STAGE_START=${stageNumber}:${stage.id}`);
      await runStage(stage, repositoryRoot);
      log(`JUDGE_STAGE_PASS=${stageNumber}:${stage.id}`);
    }
  } catch (error) {
    workflowError = error;
  } finally {
    try {
      if (before) {
        const after = await captureSnapshot(repositoryRoot);
        assertRepositorySnapshotUnchanged(before, after);
      }
    } finally {
      await cleanup(repositoryRoot);
    }
  }

  if (workflowError) throw workflowError;
  for (const line of JUDGE_WORKFLOW_FINAL_OUTPUT) log(line);
}
