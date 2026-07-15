import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import type { RepairPlan } from '../../packages/shared-types/src/index.ts';
import {
  applyExplicitLabelTemplate,
  applyFocusVisibleTemplate,
  assertAllowedFileChanges,
  assertApprovedRepairTargets,
  assertReviewedArtifactHash,
  controlledTemplateFixtures,
  createReplaySpec,
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
