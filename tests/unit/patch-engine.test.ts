import assert from 'node:assert/strict';
import { type ChildProcess } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { existsSync } from 'node:fs';
import {
  access,
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import test, { type TestContext } from 'node:test';
import type { RepairPlan } from '../../packages/shared-types/src/index.ts';
import {
  applyExplicitLabelTemplate,
  applyFocusVisibleTemplate,
  assertMutationGuardFixtureIntegrity,
  assertAllowedFileChanges,
  assertApprovedRepairTargets,
  assertReviewedArtifactHash,
  calculateMutationGuardFixtureSha256,
  controlledTemplateFixtures,
  createMutationChildEnvironment,
  createMutationDetectorSpec,
  createReplaySpec,
  evaluateMutationDetection,
  injectAriaHiddenFocusableMutation,
  isApprovedMutationTargetFocusable,
  MUTATION_GUARD_FIXTURE_FILES,
  MUTATION_GUARD_FIXTURE_ID,
  MUTATION_GUARD_EXPECTED_FIXTURE_SHA256,
  MUTATION_GUARD_ID,
  MUTATION_GUARD_RULE,
  MUTATION_GUARD_SCHEMA_VERSION,
  MUTATION_GUARD_TARGET_PATH,
  MUTATION_GUARD_TARGET_SELECTOR,
  MUTATION_GUARD_TYPE,
  MutationGuardResultSchema,
  mutationGuardSuccessOutput,
  prepareMutationRuntimePaths,
  runMutationDetector,
  runMutationGuardCore,
  validateGeneratedPatch,
} from '../../packages/patch-engine/src/index.ts';
import { mutablePlan } from './fixtures.ts';

const validPatch = `--- a/apps/demo-checkout/src/App.tsx
+++ b/apps/demo-checkout/src/App.tsx
@@ -1 +1 @@
-                <span className="field-label">Email address</span>
+                <label className="field-label" htmlFor="email">
--- a/apps/demo-checkout/src/styles.css
+++ b/apps/demo-checkout/src/styles.css
@@ -1,2 +0,0 @@
-  outline: none;
-  box-shadow: none;
`;

test('exact controlled templates repair only their intended source regions', async () => {
  const appSource = await readFile('apps/demo-checkout/src/App.tsx', 'utf8');
  const stylesSource = await readFile('apps/demo-checkout/src/styles.css', 'utf8');
  const repairedApp = applyExplicitLabelTemplate(appSource);
  const repairedStyles = applyFocusVisibleTemplate(stylesSource);

  assert.equal(repairedApp.includes('htmlFor="email"'), true);
  assert.equal(repairedApp.includes('id="email"'), true);
  assert.equal(repairedApp.includes('Email address'), true);
  assert.equal(repairedStyles.includes('controlled-focus-defect:focus'), false);
  assert.equal(repairedStyles.includes('button:focus-visible'), true);
});

test('missing expected TSX precondition fails closed', () => {
  assert.throws(() => applyExplicitLabelTemplate('<input id="email" />'), {
    message: 'email_precondition_count:0',
  });
});

test('duplicate expected TSX precondition fails closed', () => {
  const source = `${controlledTemplateFixtures.emailDefect}\n${controlledTemplateFixtures.emailDefect}`;
  assert.throws(() => applyExplicitLabelTemplate(source), {
    message: 'email_precondition_count:2',
  });
});

test('missing expected CSS precondition fails closed', () => {
  assert.throws(() => applyFocusVisibleTemplate('.button { color: blue; }'), {
    message: 'focus_precondition_count:0',
  });
});

test('duplicate expected CSS precondition fails closed', () => {
  const source = `${controlledTemplateFixtures.focusDefect}\n${controlledTemplateFixtures.focusDefect}`;
  assert.throws(() => applyFocusVisibleTemplate(source), {
    message: 'focus_precondition_count:2',
  });
});

test('already-repaired input is rejected', () => {
  const source = `${controlledTemplateFixtures.emailDefect}\n<label htmlFor="email">Email</label>`;
  assert.throws(() => applyExplicitLabelTemplate(source), {
    message: 'email_already_repaired',
  });
});

test('already-repaired focus rule is rejected', () => {
  assert.throws(
    () =>
      applyFocusVisibleTemplate(
        'button:focus-visible { outline: 3px solid #1359c5; }',
      ),
    { message: 'focus_precondition_count:0' },
  );
});

test('wrong reviewed evidence hash is rejected', () => {
  assert.throws(() => assertReviewedArtifactHash('evidence', '0'.repeat(64)), {
    message: 'evidence_hash_mismatch',
  });
});

test('wrong reviewed repair-plan hash is rejected', () => {
  assert.throws(() => assertReviewedArtifactHash('repairPlan', '0'.repeat(64)), {
    message: 'repairPlan_hash_mismatch',
  });
});

test('disallowed repair-plan target file is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].intendedTargetFile = 'apps/demo-checkout/src/main.tsx';
  assert.throws(() => assertApprovedRepairTargets(plan as RepairPlan), {
    message: 'repair_target_not_approved:CONTROLLED_BARRIER_EMAIL_NAME',
  });
});

test('unexpected third changed file is rejected', () => {
  assert.throws(
    () =>
      assertAllowedFileChanges(
        [
          'apps/demo-checkout/src/App.tsx',
          'apps/demo-checkout/src/styles.css',
          'apps/demo-checkout/src/main.tsx',
        ],
        ['tests/e2e/replay.spec.ts'],
        [],
      ),
    /changed_files_not_allowed/,
  );
});

test('attempted dependency or manifest change is rejected', () => {
  assert.throws(
    () =>
      assertAllowedFileChanges(
        [
          'apps/demo-checkout/src/App.tsx',
          'apps/demo-checkout/src/styles.css',
          'package.json',
        ],
        ['tests/e2e/replay.spec.ts'],
        [],
      ),
    /changed_files_not_allowed/,
  );
  assert.throws(
    () => validateGeneratedPatch(`${validPatch}\n--- a/package.json\n+++ b/package.json\n`),
    /manifest_or_lockfile_change/,
  );
});

test('patch output containing an unauthorized path is rejected', () => {
  const patch = validPatch.replace(
    'a/apps/demo-checkout/src/App.tsx',
    'a/../outside/App.tsx',
  );
  assert.throws(() => validateGeneratedPatch(patch), /unauthorized_patch_path/);
});

test('valid two-file patch passes deterministic patch policy', () => {
  assert.doesNotThrow(() => validateGeneratedPatch(validPatch));
});

test('unexpected created or deleted files are rejected', () => {
  assert.throws(
    () =>
      assertAllowedFileChanges(
        ['apps/demo-checkout/src/App.tsx', 'apps/demo-checkout/src/styles.css'],
        ['tests/e2e/replay.spec.ts', 'report.html'],
        [],
      ),
    /created_files_not_allowed/,
  );
  assert.throws(
    () =>
      assertAllowedFileChanges(
        ['apps/demo-checkout/src/App.tsx', 'apps/demo-checkout/src/styles.css'],
        ['tests/e2e/replay.spec.ts'],
        ['README.md'],
      ),
    /deleted_files_not_allowed/,
  );
});

test('generated replay contains all repaired journey gates', () => {
  const replay = createReplaySpec();
  assert.match(replay, /toHaveAccessibleName\('Email address'\)/);
  assert.match(replay, /visibleIndicatorDetected/);
  assert.match(replay, /expect\(ruleIds\)\.toEqual\(\[\]\)/);
  assert.match(replay, /Order ready for review/);
  assert.doesNotMatch(replay, /expect\.soft/);
});

const focusEvidence = {
  exists: true,
  tagName: 'BUTTON',
  disabled: false,
  tabIndex: 0,
  visible: true,
  activeElement: true,
  keyboardFocusConfirmed: true,
} as const;

function validMutationResult() {
  return {
    schemaVersion: MUTATION_GUARD_SCHEMA_VERSION,
    mutationId: MUTATION_GUARD_ID,
    mutationType: MUTATION_GUARD_TYPE,
    sourceFixtureId: MUTATION_GUARD_FIXTURE_ID,
    targetRelativePath: MUTATION_GUARD_TARGET_PATH,
    targetSelector: MUTATION_GUARD_TARGET_SELECTOR,
    mutationDescription: 'Controlled mutation.',
    originalFixtureSha256Before: 'a'.repeat(64),
    disposableCopySha256Before: 'a'.repeat(64),
    disposableCopySha256After: 'b'.repeat(64),
    injectedMutationCount: 1,
    detectorResult: 'detected',
    detectedRuleId: MUTATION_GUARD_RULE,
    focusEvidence,
    ariaHiddenEvidence: {
      attributeName: 'aria-hidden',
      attributeValue: 'true',
      matchingElementCount: 1,
    },
    mutationDetectionCount: 1,
    cleanupResult: 'removed',
    originalFixtureSha256After: 'a'.repeat(64),
    originalFixtureUnchanged: true,
    finalStatus: 'passed',
  } as const;
}

function detectedObservation() {
  return {
    targetMatchCount: 1,
    ariaHiddenTrueMatchCount: 1,
    ariaHiddenValue: 'true',
    focusEvidence: { ...focusEvidence },
  };
}

async function createMutationFixture(root: string): Promise<void> {
  for (const path of MUTATION_GUARD_FIXTURE_FILES) {
    const file = join(root, path);
    await mkdir(dirname(file), { recursive: true });
    await copyFile(resolve(path), file);
  }
}

function assertBeneath(root: string, path: string): void {
  const containment = relative(resolve(root), resolve(path));
  assert.equal(
    containment !== '..' &&
      !containment.startsWith(`..${sep}`) &&
      !containment.startsWith('/') &&
      !containment.startsWith('\\'),
    true,
    path,
  );
}

async function assertRejectsSymlinkTest(
  context: TestContext,
  createLink: () => Promise<void>,
  action: () => Promise<unknown>,
  expected: RegExp,
): Promise<void> {
  try {
    await createLink();
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'EPERM' || code === 'EACCES' || code === 'ENOTSUP') {
      context.skip(`Symlink creation unavailable: ${code}`);
      return;
    }
    throw error;
  }
  await assert.rejects(action(), expected);
}

function fakeViteProcess(): ChildProcess {
  const process = new EventEmitter() as ChildProcess;
  Object.assign(process, {
    exitCode: null,
    kill: () => true,
  });
  return process;
}

test('valid mutation guard result schema is accepted', () => {
  assert.deepEqual(
    MutationGuardResultSchema.parse(validMutationResult()),
    validMutationResult(),
  );
});

test('invalid mutation guard result schema is rejected', () => {
  const invalid = {
    ...validMutationResult(),
    mutationDetectionCount: 0,
  };
  assert.equal(MutationGuardResultSchema.safeParse(invalid).success, false);
});

test('exact one-target mutation injection adds aria-hidden only once', () => {
  const mutated = injectAriaHiddenFocusableMutation(
    controlledTemplateFixtures.mutationGuardTarget,
  );
  assert.equal((mutated.match(/aria-hidden="true"/g) ?? []).length, 1);
  assert.match(mutated, /className="button button-primary controlled-focus-defect"/);
});

test('zero mutation target fails closed', () => {
  assert.throws(
    () => injectAriaHiddenFocusableMutation('<button type="button">Other</button>'),
    { message: 'mutation_target_precondition_count:0' },
  );
});

test('multiple mutation targets fail closed', () => {
  const source = `${controlledTemplateFixtures.mutationGuardTarget}\n${controlledTemplateFixtures.mutationGuardTarget}`;
  assert.throws(() => injectAriaHiddenFocusableMutation(source), {
    message: 'mutation_target_precondition_count:2',
  });
});

test('already-mutated target fails closed', () => {
  assert.throws(
    () =>
      injectAriaHiddenFocusableMutation(
        controlledTemplateFixtures.mutationGuardInjectedTarget,
      ),
    { message: 'mutation_target_already_mutated' },
  );
});

test('selected native button evidence is deterministically focusable', () => {
  assert.equal(isApprovedMutationTargetFocusable(focusEvidence), true);
  assert.equal(
    isApprovedMutationTargetFocusable({ ...focusEvidence, disabled: true }),
    false,
  );
});

test('detector accepts aria-hidden true on the focused target', () => {
  assert.deepEqual(evaluateMutationDetection(detectedObservation()), {
    detected: true,
    detectionCount: 1,
    focusEvidence,
    ariaHiddenValue: 'true',
    ariaHiddenTrueMatchCount: 1,
  });
});

test('detector has no false positive before mutation', () => {
  const result = evaluateMutationDetection({
    ...detectedObservation(),
    ariaHiddenTrueMatchCount: 0,
    ariaHiddenValue: null,
  });
  assert.equal(result.detected, false);
  assert.equal(result.detectionCount, 0);
});

test('detector rejects multiple controlled mutation matches', () => {
  const result = evaluateMutationDetection({
    ...detectedObservation(),
    targetMatchCount: 2,
    ariaHiddenTrueMatchCount: 2,
  });
  assert.equal(result.detected, false);
  assert.equal(result.detectionCount, 0);
});

test('mutation core preserves original fixture and removes disposable copy', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-mutation-core-'));
  try {
    await createMutationFixture(root);
    const original = await readFile(
      join(root, MUTATION_GUARD_TARGET_PATH),
      'utf8',
    );
    const result = await runMutationGuardCore(root, {
      detectMutation: async (_repositoryRoot, workingCopyRoot) => {
        const mutated = await readFile(
          join(workingCopyRoot, MUTATION_GUARD_TARGET_PATH),
          'utf8',
        );
        assert.match(mutated, /aria-hidden="true"/);
        return detectedObservation();
      },
    });
    assert.equal(result.originalFixtureUnchanged, true);
    assert.equal(
      await readFile(join(root, MUTATION_GUARD_TARGET_PATH), 'utf8'),
      original,
    );
    assert.deepEqual(
      await readdir(join(root, '.accesspatch/work')),
      [],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('mutation core removes disposable copy after detector failure', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-mutation-failure-'));
  try {
    await createMutationFixture(root);
    await assert.rejects(
      runMutationGuardCore(root, {
        detectMutation: async () => {
          throw new Error('detector_failed_for_test');
        },
      }),
      /detector_failed_for_test/,
    );
    assert.deepEqual(
      await readdir(join(root, '.accesspatch/work')),
      [],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('mutation guard success output is stable', () => {
  const result = MutationGuardResultSchema.parse(validMutationResult());
  assert.deepEqual(mutationGuardSuccessOutput(result), [
    'MUTATION_GUARD_ID=CONTROLLED_MUTATION_ARIA_HIDDEN_FOCUSABLE',
    'MUTATION_GUARD_RULE=FOCUSABLE_ELEMENT_ARIA_HIDDEN',
    'MUTATION_GUARD_INJECTED=1',
    'MUTATION_GUARD_DETECTED=1',
    'MUTATION_GUARD_ORIGINAL_UNCHANGED=true',
    'MUTATION_GUARD_CLEANUP=passed',
    'MUTATION_GUARD_VALID',
  ]);
});

test('generated mutation detector uses hard keyboard and DOM assertions', () => {
  const detector = createMutationDetectorSpec();
  assert.match(detector, /for \(let index = 0; index < 7/);
  assert.match(detector, /toBeFocused\(\)/);
  assert.match(detector, /aria-hidden="true"/);
  assert.doesNotMatch(detector, /expect\.soft/);
});

test('mutation child environment isolates every user and temporary directory', () => {
  const runtimeRoot = '/isolated/runtime';
  const environment = createMutationChildEnvironment(
    {
      PATH: '/usr/bin',
      SYSTEMROOT: 'C:\\Windows',
      HOME: '/real/home',
      XDG_CONFIG_HOME: '/real/config',
      XDG_CACHE_HOME: '/real/cache',
      TMPDIR: '/real/tmp',
      TMP: '/real/tmp-parent',
      TEMP: '/real/temp',
      USERPROFILE: 'C:\\Users\\real',
      APPDATA: 'C:\\Users\\real\\AppData\\Roaming',
      LOCALAPPDATA: 'C:\\Users\\real\\AppData\\Local',
      OPENAI_API_KEY: 'not-a-real-key',
      GITHUB_TOKEN: 'not-a-real-token',
      NPM_TOKEN: 'not-a-real-token',
      AUTHORIZATION: 'not-a-real-header',
      OPENAI_PROJECT_ID: 'not-a-real-project',
      OPENAI_ORGANIZATION_ID: 'not-a-real-organization',
    },
    runtimeRoot,
  );

  for (const key of [
    'HOME',
    'XDG_CONFIG_HOME',
    'XDG_CACHE_HOME',
    'TMPDIR',
    'TMP',
    'TEMP',
    'USERPROFILE',
    'APPDATA',
    'LOCALAPPDATA',
  ]) {
    assertBeneath(runtimeRoot, environment[key] ?? '');
  }
  assert.equal(environment.PATH, '/usr/bin');
  assert.equal(environment.SYSTEMROOT, 'C:\\Windows');
  assert.equal(environment.HOME, '/isolated/runtime/home');
  assert.equal(environment.XDG_CONFIG_HOME, '/isolated/runtime/config');
  assert.equal(environment.XDG_CACHE_HOME, '/isolated/runtime/cache');
  assert.equal(environment.TMPDIR, '/isolated/runtime/tmp');
  for (const key of [
    'OPENAI_API_KEY',
    'GITHUB_TOKEN',
    'NPM_TOKEN',
    'AUTHORIZATION',
    'OPENAI_PROJECT_ID',
    'OPENAI_ORGANIZATION_ID',
  ]) {
    assert.equal(environment[key], undefined);
  }
  assert.equal(environment.HTTP_PROXY, 'http://127.0.0.1:9');
  assert.equal(environment.HTTPS_PROXY, 'http://127.0.0.1:9');
  assert.equal(environment.NO_PROXY, '127.0.0.1,localhost');
  assert.equal(environment.http_proxy, 'http://127.0.0.1:9');
  assert.equal(environment.https_proxy, 'http://127.0.0.1:9');
  assert.equal(environment.no_proxy, '127.0.0.1,localhost');
});

test('mutation runtime paths safely create a missing fixed directory chain', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-create-'));
  try {
    const paths = await prepareMutationRuntimePaths(root);
    for (const path of [paths.workParent, paths.evidenceParent]) {
      const stats = await lstat(path);
      assert.equal(stats.isDirectory(), true);
      assert.equal(stats.isSymbolicLink(), false);
      assertBeneath(root, path);
    }
    await assert.rejects(access(paths.outputDirectory), { code: 'ENOENT' });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('mutation runtime paths accept existing normal directories', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-existing-'));
  try {
    await mkdir(join(root, '.accesspatch/work'), { recursive: true });
    await mkdir(join(root, '.accesspatch/runs/phase5a/mutation-guard'), {
      recursive: true,
    });
    const paths = await prepareMutationRuntimePaths(root);
    assert.equal(paths.workParent, join(root, '.accesspatch/work'));
    assert.equal(
      paths.outputDirectory,
      join(root, '.accesspatch/runs/phase5a/mutation-guard'),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('mutation runtime rejects a symlinked .accesspatch directory', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-root-link-'));
  const outside = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-outside-'));
  try {
    await assertRejectsSymlinkTest(
      context,
      () => symlink(outside, join(root, '.accesspatch'), 'dir'),
      () => prepareMutationRuntimePaths(root),
      /mutation_runtime_accesspatch_symlink/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test('mutation runtime rejects a symlinked work directory', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-work-link-'));
  const outside = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-outside-'));
  try {
    await mkdir(join(root, '.accesspatch'), { recursive: true });
    await assertRejectsSymlinkTest(
      context,
      () => symlink(outside, join(root, '.accesspatch/work'), 'dir'),
      () => prepareMutationRuntimePaths(root),
      /mutation_runtime_work_symlink/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test('mutation runtime rejects a symlinked runs ancestor', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-runs-link-'));
  const outside = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-outside-'));
  try {
    await mkdir(join(root, '.accesspatch'), { recursive: true });
    await assertRejectsSymlinkTest(
      context,
      () => symlink(outside, join(root, '.accesspatch/runs'), 'dir'),
      () => prepareMutationRuntimePaths(root),
      /mutation_runtime_runs_symlink/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test('mutation runtime rejects a symlinked Phase 5A ancestor', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-phase-link-'));
  const outside = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-outside-'));
  try {
    await mkdir(join(root, '.accesspatch/runs'), { recursive: true });
    await assertRejectsSymlinkTest(
      context,
      () => symlink(outside, join(root, '.accesspatch/runs/phase5a'), 'dir'),
      () => prepareMutationRuntimePaths(root),
      /mutation_runtime_phase5a_symlink/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test('mutation runtime rejects a non-directory ancestor', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-file-'));
  try {
    await mkdir(join(root, '.accesspatch'), { recursive: true });
    await writeFile(join(root, '.accesspatch/runs'), 'not a directory\n');
    await assert.rejects(
      prepareMutationRuntimePaths(root),
      /mutation_runtime_runs_not_directory/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('unsafe evidence output symlink is rejected without deleting external content', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-output-link-'));
  const outside = await mkdtemp(join(tmpdir(), 'accesspatch-runtime-outside-'));
  const sentinel = join(outside, 'sentinel.txt');
  try {
    await mkdir(join(root, '.accesspatch/runs/phase5a'), { recursive: true });
    await writeFile(sentinel, 'preserve me\n');
    await assertRejectsSymlinkTest(
      context,
      () =>
        symlink(
          outside,
          join(root, '.accesspatch/runs/phase5a/mutation-guard'),
          'dir',
        ),
      () => prepareMutationRuntimePaths(root),
      /mutation_runtime_output_symlink/,
    );
    assert.equal(await readFile(sentinel, 'utf8'), 'preserve me\n');
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test('approved fixture ID is explicitly bound to the approved four-file hash', async () => {
  assert.equal(MUTATION_GUARD_FIXTURE_ID, 'demo-checkout-controlled-v1');
  assert.equal(
    MUTATION_GUARD_EXPECTED_FIXTURE_SHA256,
    '50a88ce11e4afc62f66c595b313156f2f1a7f1fc98eb2f6ad1206b8260fbbfd4',
  );
  assert.equal(
    await assertMutationGuardFixtureIntegrity(process.cwd()),
    MUTATION_GUARD_EXPECTED_FIXTURE_SHA256,
  );
  assert.equal(
    await calculateMutationGuardFixtureSha256(process.cwd()),
    MUTATION_GUARD_EXPECTED_FIXTURE_SHA256,
  );
});

test('one-byte fixture change fails before runtime creation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-fixture-changed-'));
  try {
    await createMutationFixture(root);
    const path = join(root, 'apps/demo-checkout/src/styles.css');
    await writeFile(path, `${await readFile(path, 'utf8')} `, 'utf8');
    await assert.rejects(
      runMutationGuardCore(root, { detectMutation: async () => detectedObservation() }),
      /mutation_fixture_hash_mismatch/,
    );
    await assert.rejects(access(join(root, '.accesspatch')), { code: 'ENOENT' });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('already-mutated retained fixture fails integrity preflight', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-fixture-mutated-'));
  try {
    await createMutationFixture(root);
    const path = join(root, MUTATION_GUARD_TARGET_PATH);
    await writeFile(
      path,
      injectAriaHiddenFocusableMutation(await readFile(path, 'utf8')),
      'utf8',
    );
    await assert.rejects(
      assertMutationGuardFixtureIntegrity(root),
      /mutation_fixture_already_mutated:1/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('missing allowlisted fixture file fails integrity preflight', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-fixture-missing-'));
  try {
    await createMutationFixture(root);
    await rm(join(root, 'apps/demo-checkout/src/main.tsx'));
    await assert.rejects(
      assertMutationGuardFixtureIntegrity(root),
      /mutation_fixture_file_missing:apps\/demo-checkout\/src\/main\.tsx/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('abort signal removes disposable state and writes no success artifact', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-mutation-abort-'));
  const controller = new AbortController();
  let observedRuntimeRoot = '';
  let detectorStartedResolve: (() => void) | undefined;
  const detectorStarted = new Promise<void>((resolveStarted) => {
    detectorStartedResolve = resolveStarted;
  });
  try {
    await createMutationFixture(root);
    const original = await readFile(
      join(root, MUTATION_GUARD_TARGET_PATH),
      'utf8',
    );
    const run = runMutationGuardCore(root, {
      signal: controller.signal,
      detectMutation: async (_repositoryRoot, _workingCopyRoot, runtimeRoot, signal) =>
        new Promise((_, reject) => {
          observedRuntimeRoot = runtimeRoot;
          detectorStartedResolve?.();
          signal?.addEventListener(
            'abort',
            () => reject(new Error('mutation_guard_interrupted')),
            { once: true },
          );
        }),
    });
    await detectorStarted;
    controller.abort();
    await assert.rejects(run, /mutation_guard_interrupted/);
    assert.deepEqual(await readdir(join(root, '.accesspatch/work')), []);
    await assert.rejects(access(observedRuntimeRoot), { code: 'ENOENT' });
    await assert.rejects(
      access(join(root, '.accesspatch/runs/phase5a/mutation-guard/result.json')),
      { code: 'ENOENT' },
    );
    assert.equal(
      await readFile(join(root, MUTATION_GUARD_TARGET_PATH), 'utf8'),
      original,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('mutation detector completes all configuration preparation before spawning Vite', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-detector-order-'));
  const runtimeRoot = join(root, 'runtime');
  const workingCopyRoot = join(root, 'working');
  const order: string[] = [];
  try {
    await mkdir(join(workingCopyRoot, 'apps/demo-checkout'), {
      recursive: true,
    });
    const observation = await runMutationDetector(
      process.cwd(),
      workingCopyRoot,
      runtimeRoot,
      undefined,
      {
        getPort: async () => 4178,
        resolveChromiumExecutable: async () => {
          order.push('browser');
          return undefined;
        },
        spawnVite: (_executable, _arguments, options) => {
          order.push('spawn');
          for (const path of [
            join(runtimeRoot, 'vite.config.mjs'),
            join(runtimeRoot, 'mutation-guard.spec.ts'),
            join(runtimeRoot, 'playwright.config.mjs'),
            join(runtimeRoot, 'home'),
            join(runtimeRoot, 'config'),
            join(runtimeRoot, 'cache'),
            join(runtimeRoot, 'tmp'),
          ]) {
            assert.equal(existsSync(path), true, path);
          }
          assert.equal(options.env.HOME, join(runtimeRoot, 'home'));
          return fakeViteProcess();
        },
        waitForVite: async () => {
          order.push('wait');
        },
        executePlaywright: async () => ({
          stdout: `MUTATION_GUARD_DETECTION_OBSERVATION=${JSON.stringify(detectedObservation())}\n`,
          stderr: '',
        }),
        stopVite: async () => {
          order.push('stop');
        },
      },
    );
    assert.deepEqual(observation, detectedObservation());
    assert.deepEqual(order, ['browser', 'spawn', 'wait', 'stop']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('mutation detector sanitizes an asynchronous Vite spawn error', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-detector-spawn-'));
  const runtimeRoot = join(root, 'runtime');
  const workingCopyRoot = join(root, 'working');
  let cleanupCalled = false;
  try {
    await mkdir(join(workingCopyRoot, 'apps/demo-checkout'), {
      recursive: true,
    });
    await assert.rejects(
      runMutationDetector(
        process.cwd(),
        workingCopyRoot,
        runtimeRoot,
        undefined,
        {
          getPort: async () => 4178,
          resolveChromiumExecutable: async () => undefined,
          spawnVite: () => {
            const process = fakeViteProcess();
            queueMicrotask(() => {
              process.emit('error', new Error('raw spawn detail'));
            });
            return process;
          },
          waitForVite: async (_url, processExited) => {
            await new Promise<void>((resolveTurn) => {
              queueMicrotask(resolveTurn);
            });
            processExited();
          },
          stopVite: async () => {
            cleanupCalled = true;
          },
        },
      ),
      { message: 'mutation_detector_vite_spawn_failed' },
    );
    assert.equal(cleanupCalled, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('mutation detector always stops Vite after a post-start exception', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-detector-failure-'));
  const runtimeRoot = join(root, 'runtime');
  const workingCopyRoot = join(root, 'working');
  let cleanupCalled = false;
  try {
    await mkdir(join(workingCopyRoot, 'apps/demo-checkout'), {
      recursive: true,
    });
    await assert.rejects(
      runMutationDetector(
        process.cwd(),
        workingCopyRoot,
        runtimeRoot,
        undefined,
        {
          getPort: async () => 4178,
          resolveChromiumExecutable: async () => undefined,
          spawnVite: fakeViteProcess,
          waitForVite: async () => {
            throw new Error('simulated_navigation_failure');
          },
          stopVite: async () => {
            cleanupCalled = true;
          },
        },
      ),
      /simulated_navigation_failure/,
    );
    assert.equal(cleanupCalled, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('abort during mutation server waiting always stops Vite', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-detector-abort-'));
  const runtimeRoot = join(root, 'runtime');
  const workingCopyRoot = join(root, 'working');
  const controller = new AbortController();
  let cleanupCalled = false;
  let waitStartedResolve: (() => void) | undefined;
  const waitStarted = new Promise<void>((resolveStarted) => {
    waitStartedResolve = resolveStarted;
  });
  try {
    await mkdir(join(workingCopyRoot, 'apps/demo-checkout'), {
      recursive: true,
    });
    const run = runMutationDetector(
      process.cwd(),
      workingCopyRoot,
      runtimeRoot,
      controller.signal,
      {
        getPort: async () => 4178,
        resolveChromiumExecutable: async () => undefined,
        spawnVite: fakeViteProcess,
        waitForVite: async (_url, _processExited, signal) =>
          new Promise((_, reject) => {
            waitStartedResolve?.();
            signal?.addEventListener(
              'abort',
              () => reject(new Error('mutation_guard_interrupted')),
              { once: true },
            );
          }),
        stopVite: async () => {
          cleanupCalled = true;
        },
      },
    );
    await waitStarted;
    controller.abort();
    await assert.rejects(run, /mutation_guard_interrupted/);
    assert.equal(cleanupCalled, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('external runtime cleanup is attempted when contained cleanup fails', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-cleanup-contained-'));
  let externalRuntimeRoot = '';
  const attempts: string[] = [];
  try {
    await createMutationFixture(root);
    const original = await readFile(
      join(root, MUTATION_GUARD_TARGET_PATH),
      'utf8',
    );
    await assert.rejects(
      runMutationGuardCore(root, {
        detectMutation: async (
          _repositoryRoot,
          _workingCopyRoot,
          runtimeRoot,
        ) => {
          externalRuntimeRoot = runtimeRoot;
          return detectedObservation();
        },
        removeRuntimeRoot: async (path, rootType) => {
          attempts.push(rootType);
          if (rootType === 'contained') {
            throw new Error('simulated_contained_cleanup_failure');
          }
          await rm(path, { recursive: true, force: true });
        },
      }),
      { message: 'mutation_guard_cleanup_failed' },
    );
    assert.deepEqual(attempts, ['contained', 'external']);
    await assert.rejects(access(externalRuntimeRoot), { code: 'ENOENT' });
    await assert.rejects(
      access(join(root, '.accesspatch/runs/phase5a/mutation-guard/result.json')),
      { code: 'ENOENT' },
    );
    assert.equal(
      await readFile(join(root, MUTATION_GUARD_TARGET_PATH), 'utf8'),
      original,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('contained cleanup is attempted when external runtime cleanup fails', async () => {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-cleanup-external-'));
  let externalRuntimeRoot = '';
  const attempts: string[] = [];
  try {
    await createMutationFixture(root);
    const original = await readFile(
      join(root, MUTATION_GUARD_TARGET_PATH),
      'utf8',
    );
    await assert.rejects(
      runMutationGuardCore(root, {
        detectMutation: async (
          _repositoryRoot,
          _workingCopyRoot,
          runtimeRoot,
        ) => {
          externalRuntimeRoot = runtimeRoot;
          return detectedObservation();
        },
        removeRuntimeRoot: async (path, rootType) => {
          attempts.push(rootType);
          if (rootType === 'external') {
            throw new Error('simulated_external_cleanup_failure');
          }
          await rm(path, { recursive: true, force: true });
        },
      }),
      { message: 'mutation_guard_cleanup_failed' },
    );
    assert.deepEqual(attempts, ['contained', 'external']);
    assert.deepEqual(await readdir(join(root, '.accesspatch/work')), []);
    await assert.rejects(
      access(join(root, '.accesspatch/runs/phase5a/mutation-guard/result.json')),
      { code: 'ENOENT' },
    );
    assert.equal(
      await readFile(join(root, MUTATION_GUARD_TARGET_PATH), 'utf8'),
      original,
    );
  } finally {
    if (externalRuntimeRoot) {
      await rm(externalRuntimeRoot, { recursive: true, force: true });
    }
    await rm(root, { recursive: true, force: true });
  }
});
