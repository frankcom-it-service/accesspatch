import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, test } from 'node:test';
import {
  JUDGE_SAMPLE_APPROVED_HASHES,
} from '../../packages/proof-bundle/src/index.ts';
import {
  JUDGE_WORKFLOW_FINAL_OUTPUT,
  JUDGE_WORKFLOW_OUTPUT_DIRECTORY,
  JUDGE_WORKFLOW_RUNTIME_CONFIG_DIRECTORY,
  JUDGE_WORKFLOW_STAGES,
  PHASE2C_GOVERNANCE_COMMIT,
  PHASE2C_IMPLEMENTATION_COMMIT,
  assertRepositorySnapshotUnchanged,
  createJudgeChildEnvironment,
  createJudgeRuntimeConfiguration,
  judgeRuntimeConfigurationPaths,
  runJudgeWorkflow,
  type GitRunner,
  type RepositorySnapshot,
  validateRepositoryContract,
} from '../../scripts/judge-workflow.ts';

const temporaryRoots: string[] = [];

async function runProcess(
  command: string,
  arguments_: string[],
  options: { cwd: string; env: NodeJS.ProcessEnv },
): Promise<{ status: number; stdout: string; stderr: string }> {
  return new Promise((resolveProcess, reject) => {
    const child = spawn(command, arguments_, {
      cwd: options.cwd,
      env: options.env,
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
      resolveProcess({ status: status ?? 1, stdout, stderr });
    });
  });
}

function expectedTrackedSampleFiles(): string[] {
  return [
    'examples/judge-sample/README.md',
    'examples/judge-sample/SHA256SUMS',
    ...Object.keys(JUDGE_SAMPLE_APPROVED_HASHES).map(
      (path) => `examples/judge-sample/proof-bundle/${path}`,
    ),
  ].sort();
}

async function createRepositoryFixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-judge-workflow-test-'));
  temporaryRoots.push(root);
  const files: Record<string, string> = {
    'package.json': '{"packageManager":"pnpm@11.13.0"}\n',
    'pnpm-lock.yaml': 'lockfileVersion: test\n',
    'AGENTS.md': '# Test\n',
    'examples/judge-sample/README.md': 'fixture\n',
    'examples/judge-sample/SHA256SUMS': 'fixture\n',
    'apps/demo-checkout/src/App.tsx':
      '<span className="field-label">Email address</span>\nclassName="button button-primary controlled-focus-defect"\n',
    'apps/demo-checkout/src/styles.css':
      '.controlled-focus-defect:focus,\n.controlled-focus-defect:focus-visible {\noutline: none;\nbox-shadow: none;\n}\n',
  };
  for (const path of Object.keys(JUDGE_SAMPLE_APPROVED_HASHES)) {
    files[`examples/judge-sample/proof-bundle/${path}`] = 'fixture\n';
  }
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), content);
  }
  return root;
}

function fixtureGitRunner(options: {
  modifiedSample?: boolean;
  untracked?: string[];
  missingAncestor?: string;
} = {}): GitRunner {
  return async (arguments_) => {
    const command = arguments_.join(' ');
    if (arguments_[0] === 'merge-base') {
      return {
        status: arguments_[2] === options.missingAncestor ? 1 : 0,
        stdout: '',
        stderr: '',
      };
    }
    if (command === 'ls-files -z -- examples/judge-sample') {
      return {
        status: 0,
        stdout: `${expectedTrackedSampleFiles().join('\0')}\0`,
        stderr: '',
      };
    }
    if (command.startsWith('status --porcelain=v1 --untracked-files=no')) {
      return {
        status: 0,
        stdout: options.modifiedSample ? ' M examples/judge-sample/README.md\n' : '',
        stderr: '',
      };
    }
    if (arguments_[0] === 'diff') {
      return { status: 0, stdout: '', stderr: '' };
    }
    if (command === 'ls-files --others --exclude-standard -z') {
      const paths = options.untracked ?? [];
      return { status: 0, stdout: paths.length ? `${paths.join('\0')}\0` : '', stderr: '' };
    }
    throw new Error(`unexpected_git_call:${command}`);
  };
}

function stableSnapshot(): RepositorySnapshot {
  return {
    trackedHashes: { 'package.json': 'hash' },
    sampleFiles: {
      'examples/judge-sample/README.md': { hash: 'hash', mtimeNs: '1' },
    },
    status: ' M package.json\n',
  };
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

test('defines the exact required judge workflow stage order', () => {
  assert.deepEqual(JUDGE_WORKFLOW_STAGES.map((stage) => stage.id), [
    'repository-contract-preflight',
    'api-free-unit-tests',
    'typescript-type-check',
    'production-build',
    'application-smoke',
    'controlled-baseline-proof',
    'tracked-judge-sample-validator',
    'tracked-report-smoke',
  ]);
});

test('workflow plan excludes install audit model repair bundle and network commands', () => {
  const serialized = JSON.stringify(JUDGE_WORKFLOW_STAGES);
  for (const forbidden of [
    'install',
    'audit',
    'licenses',
    'phase1:reason',
    'phase1:repair',
    'phase2:bundle',
    'curl',
    'wget',
    'openai',
  ]) {
    assert.doesNotMatch(serialized, new RegExp(forbidden, 'i'));
  }
});

test('runs every stage once in the exact order and emits the stable summary', async () => {
  const stages: string[] = [];
  const output: string[] = [];
  await runJudgeWorkflow('/repository', {
    prepareRuntimeConfiguration: async () => ({
      gitConfigPath: 'gitconfig',
      npmConfigPath: 'npmrc',
    }),
    validateContract: async () => {
      stages.push('repository-contract-preflight');
    },
    captureSnapshot: async () => stableSnapshot(),
    runStage: async (stage) => {
      stages.push(stage.id);
    },
    cleanup: async () => {},
    log: (line) => output.push(line),
  });
  assert.deepEqual(stages, JUDGE_WORKFLOW_STAGES.map((stage) => stage.id));
  assert.deepEqual(output.slice(-JUDGE_WORKFLOW_FINAL_OUTPUT.length), JUDGE_WORKFLOW_FINAL_OUTPUT);
});

test('propagates a failed child stage and does not emit success summary', async () => {
  const output: string[] = [];
  await assert.rejects(
    runJudgeWorkflow('/repository', {
      prepareRuntimeConfiguration: async () => ({
        gitConfigPath: 'gitconfig',
        npmConfigPath: 'npmrc',
      }),
      validateContract: async () => {},
      captureSnapshot: async () => stableSnapshot(),
      runStage: async (stage) => {
        if (stage.id === 'production-build') throw new Error('child_failed');
      },
      cleanup: async () => {},
      log: (line) => output.push(line),
    }),
    /child_failed/,
  );
  assert.equal(output.includes('JUDGE_WORKFLOW_VALID'), false);
});

test('rejects invocation outside the expected repository root', async () => {
  const root = await createRepositoryFixture();
  const other = await mkdtemp(join(tmpdir(), 'accesspatch-other-root-'));
  temporaryRoots.push(other);
  await assert.rejects(
    validateRepositoryContract(root, {
      expectedRoot: other,
      gitRunner: fixtureGitRunner(),
      sampleValidator: async () => {},
    }),
    /judge_repository_root_invalid/,
  );
});

test('rejects a missing repository-contract file', async () => {
  const root = await createRepositoryFixture();
  await unlink(join(root, 'pnpm-lock.yaml'));
  await assert.rejects(
    validateRepositoryContract(root, {
      expectedRoot: root,
      gitRunner: fixtureGitRunner(),
      sampleValidator: async () => {},
    }),
    /judge_repository_contract_file_invalid:pnpm-lock\.yaml/,
  );
});

test('rejects a missing Judge Sample file', async () => {
  const root = await createRepositoryFixture();
  await unlink(join(root, 'examples/judge-sample/proof-bundle/summary.json'));
  await assert.rejects(
    validateRepositoryContract(root, {
      expectedRoot: root,
      gitRunner: fixtureGitRunner(),
      sampleValidator: async () => {},
    }),
    /judge_repository_sample_inventory_invalid/,
  );
});

test('rejects a modified tracked Judge Sample', async () => {
  const root = await createRepositoryFixture();
  await assert.rejects(
    validateRepositoryContract(root, {
      expectedRoot: root,
      gitRunner: fixtureGitRunner({ modifiedSample: true }),
      sampleValidator: async () => {},
    }),
    /judge_repository_tracked_sample_modified/,
  );
});

test('rejects an execution-sensitive untracked file but tolerates unrelated notes', async () => {
  const root = await createRepositoryFixture();
  await assert.rejects(
    validateRepositoryContract(root, {
      expectedRoot: root,
      gitRunner: fixtureGitRunner({ untracked: ['tests/unit/injected.test.ts'] }),
      sampleValidator: async () => {},
    }),
    /judge_repository_execution_sensitive_untracked/,
  );
  await assert.doesNotReject(
    validateRepositoryContract(root, {
      expectedRoot: root,
      gitRunner: fixtureGitRunner({ untracked: ['notes/local.txt'] }),
      sampleValidator: async () => {},
    }),
  );
});

test('requires both approved Phase 2C commits to be ancestors', async () => {
  const root = await createRepositoryFixture();
  for (const commit of [PHASE2C_IMPLEMENTATION_COMMIT, PHASE2C_GOVERNANCE_COMMIT]) {
    await assert.rejects(
      validateRepositoryContract(root, {
        expectedRoot: root,
        gitRunner: fixtureGitRunner({ missingAncestor: commit }),
        sampleValidator: async () => {},
      }),
      /judge_repository_git_check_failed:required_commit/,
    );
  }
});

test('repository contract is independent of absent ignored runs', async () => {
  const root = await createRepositoryFixture();
  await assert.rejects(stat(join(root, '.accesspatch/runs')), /ENOENT/);
  await assert.doesNotReject(
    validateRepositoryContract(root, {
      expectedRoot: root,
      gitRunner: fixtureGitRunner(),
      sampleValidator: async () => {},
    }),
  );
});

test('child environment excludes secrets and enables local-only network guards', () => {
  const binaryPath = ['', 'bin'].join('/');
  const homePath = ['', 'home', 'example'].join('/');
  const repositoryRoot = join(homePath, 'accesspatch');
  const runtimeConfiguration = judgeRuntimeConfigurationPaths(repositoryRoot);
  const environment = createJudgeChildEnvironment({
    PATH: binaryPath,
    HOME: homePath,
    OPENAI_API_KEY: 'secret',
    ACCESS_TOKEN: 'secret',
  }, repositoryRoot);
  assert.equal(environment.OPENAI_API_KEY, undefined);
  assert.equal(environment.ACCESS_TOKEN, undefined);
  assert.equal(environment.ACCESSPATCH_JUDGE_WORKFLOW, '1');
  assert.equal(environment.NO_PROXY, '127.0.0.1,localhost');
  assert.equal(environment.HTTPS_PROXY, 'http://127.0.0.1:9');
  assert.equal(environment.GIT_CONFIG_GLOBAL, runtimeConfiguration.gitConfigPath);
  assert.equal(environment.GIT_CONFIG_NOSYSTEM, '1');
  assert.equal(environment.GIT_TERMINAL_PROMPT, '0');
  assert.equal(environment.GCM_INTERACTIVE, 'Never');
  assert.equal(environment.NPM_CONFIG_USERCONFIG, runtimeConfiguration.npmConfigPath);
  assert.equal(environment.npm_config_userconfig, runtimeConfiguration.npmConfigPath);
  assert.equal(environment.NPM_CONFIG_GLOBALCONFIG, runtimeConfiguration.npmConfigPath);
  assert.equal(environment.npm_config_globalconfig, runtimeConfiguration.npmConfigPath);
  assert.equal(environment.npm_config_verify_deps_before_run, 'false');
  assert.equal(environment.pnpm_config_verify_deps_before_run, 'false');
  assert.equal(environment.NPM_CONFIG_UPDATE_NOTIFIER, 'false');
  assert.equal(environment.NPM_CONFIG_AUDIT, 'false');
  assert.equal(environment.NPM_CONFIG_FUND, 'false');
  assert.doesNotMatch(JSON.stringify(JUDGE_WORKFLOW_FINAL_OUTPUT), /secret|environment/i);
});

test('creates empty regular runtime configuration beneath reserved output', async () => {
  const root = await createRepositoryFixture();
  const configuration = await createJudgeRuntimeConfiguration(root);
  const reservedRoot = join(root, JUDGE_WORKFLOW_OUTPUT_DIRECTORY);
  for (const path of [configuration.gitConfigPath, configuration.npmConfigPath]) {
    const metadata = await stat(path);
    assert.equal(metadata.isFile(), true);
    assert.equal(metadata.isSymbolicLink(), false);
    assert.equal(metadata.size, 0);
    assert.equal(path.startsWith(`${reservedRoot}/`), true);
    if (process.platform !== 'win32') {
      assert.equal(metadata.mode & 0o077, 0);
    }
  }
  assert.equal(dirname(configuration.gitConfigPath), join(root, JUDGE_WORKFLOW_RUNTIME_CONFIG_DIRECTORY));
});

test('isolated Git configuration does not observe fake HOME configuration', async () => {
  const root = await createRepositoryFixture();
  const fakeHome = await mkdtemp(join(tmpdir(), 'accesspatch-fake-home-git-'));
  temporaryRoots.push(fakeHome);
  await writeFile(join(fakeHome, '.gitconfig'), '[accesspatch]\nmarker = HOME_GIT_MARKER\n');
  await createJudgeRuntimeConfiguration(root);
  const result = await runProcess(
    'git',
    ['config', '--global', '--get', 'accesspatch.marker'],
    {
      cwd: root,
      env: createJudgeChildEnvironment({ ...process.env, HOME: fakeHome }, root),
    },
  );
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.doesNotMatch(result.stderr, /HOME_GIT_MARKER|\\.gitconfig/);
});

test('isolated pnpm configuration does not observe fake HOME configuration', async (context) => {
  const root = await createRepositoryFixture();
  const fakeHome = await mkdtemp(join(tmpdir(), 'accesspatch-fake-home-pnpm-'));
  temporaryRoots.push(fakeHome);
  await writeFile(join(fakeHome, '.npmrc'), 'accesspatch-marker=HOME_NPM_MARKER\n');
  await createJudgeRuntimeConfiguration(root);
  const originalHome = process.env.HOME;
  if (!originalHome) {
    context.skip('HOME is unavailable for locating the already installed Corepack cache');
    return;
  }
  const corepackHome = process.env.COREPACK_HOME ?? join(originalHome, '.cache/node/corepack');
  if (!(await stat(corepackHome).catch(() => null))) {
    context.skip('The already installed Corepack cache is unavailable');
    return;
  }
  const result = await runProcess(
    'pnpm',
    ['config', 'get', 'accesspatch-marker'],
    {
      cwd: root,
      env: createJudgeChildEnvironment({
        ...process.env,
        COREPACK_HOME: corepackHome,
        HOME: fakeHome,
      }, root),
    },
  );
  assert.equal(result.status, 0);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /HOME_NPM_MARKER|\\.npmrc/);
});

test('does not create a persistent workflow result file', async () => {
  const root = await createRepositoryFixture();
  await runJudgeWorkflow(root, {
    validateContract: async () => {},
    captureSnapshot: async () => stableSnapshot(),
    runStage: async () => {},
    log: () => {},
  });
  await assert.rejects(stat(join(root, 'judge-workflow-result.json')), /ENOENT/);
  await assert.rejects(stat(join(root, JUDGE_WORKFLOW_OUTPUT_DIRECTORY)), /ENOENT/);
});

test('preserves tracked and Judge Sample state after success', async () => {
  const snapshot = stableSnapshot();
  assert.doesNotThrow(() => assertRepositorySnapshotUnchanged(snapshot, snapshot));
});

test('rejects changed tracked bytes, sample mtimes, or repository status', () => {
  const before = stableSnapshot();
  assert.throws(
    () =>
      assertRepositorySnapshotUnchanged(before, {
        ...before,
        trackedHashes: { 'package.json': 'changed' },
      }),
    /judge_workflow_tracked_bytes_changed/,
  );
  assert.throws(
    () =>
      assertRepositorySnapshotUnchanged(before, {
        ...before,
        sampleFiles: {
          'examples/judge-sample/README.md': { hash: 'hash', mtimeNs: '2' },
        },
      }),
    /judge_workflow_sample_state_changed/,
  );
  assert.throws(
    () => assertRepositorySnapshotUnchanged(before, { ...before, status: '' }),
    /judge_workflow_repository_status_changed/,
  );
});

test('cleans reserved output after a failed child stage', async () => {
  const root = await createRepositoryFixture();
  await assert.rejects(
    runJudgeWorkflow(root, {
      validateContract: async () => {},
      captureSnapshot: async () => stableSnapshot(),
      runStage: async () => {
        const output = join(root, JUDGE_WORKFLOW_OUTPUT_DIRECTORY, 'partial.txt');
        await mkdir(dirname(output), { recursive: true });
        await writeFile(output, 'partial');
        throw new Error('child_failed');
      },
      log: () => {},
    }),
    /child_failed/,
  );
  await assert.rejects(stat(join(root, JUDGE_WORKFLOW_OUTPUT_DIRECTORY)), /ENOENT/);
});

test('cleans reserved output after repository preflight failure', async () => {
  const root = await createRepositoryFixture();
  await assert.rejects(
    runJudgeWorkflow(root, {
      validateContract: async () => {
        throw new Error('preflight_failed');
      },
      captureSnapshot: async () => stableSnapshot(),
      runStage: async () => {},
      log: () => {},
    }),
    /preflight_failed/,
  );
  await assert.rejects(stat(join(root, JUDGE_WORKFLOW_OUTPUT_DIRECTORY)), /ENOENT/);
});
