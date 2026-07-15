import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PATCH_AUDIT_SCHEMA_VERSION,
  PATCH_ENGINE_VERSION,
  ISOLATED_WORKING_COPY_STRATEGY,
  PatchAuditSchema,
  REVIEWED_PHASE1B_HASHES,
  VERIFICATION_SCHEMA_VERSION,
  VerificationSchema,
} from '../../packages/patch-engine/src/index.ts';

const hash = 'a'.repeat(64);
const gitCommit = 'b'.repeat(40);

function validVerification() {
  return {
    schemaVersion: VERIFICATION_SCHEMA_VERSION,
    baseGitCommit: gitCommit,
    evidenceSha256: REVIEWED_PHASE1B_HASHES.evidence,
    repairPlanSha256: REVIEWED_PHASE1B_HASHES.repairPlan,
    patchSha256: hash,
    replaySpecSha256: hash,
    journeyId: 'demo-checkout-keyboard-v1',
    repairedFindingIds: [
      'CONTROLLED_BARRIER_EMAIL_NAME',
      'CONTROLLED_BARRIER_FOCUS_VISIBLE',
    ],
    filesChanged: [
      'apps/demo-checkout/src/App.tsx',
      'apps/demo-checkout/src/styles.css',
    ],
    buildResult: 'passed',
    replayResult: 'passed',
    axeResult: {
      violationCount: 0,
      ruleIds: [],
      emailLabelViolationPresent: false,
    },
    repairedFocusComputedValues: {
      outlineStyle: 'solid',
      outlineWidth: '3px',
      boxShadow: 'none',
      visibleIndicatorDetected: true,
    },
    confirmationReached: true,
    originalRepositoryUnchanged: true,
    overallVerificationStatus: 'passed',
  };
}

test('valid Phase 1C verification artifact is accepted', () => {
  assert.deepEqual(
    VerificationSchema.parse(validVerification()),
    validVerification(),
  );
});

test('verification artifact rejects an unsuccessful or incomplete replay', () => {
  const artifact = validVerification() as Record<string, unknown>;
  artifact.confirmationReached = false;
  assert.equal(VerificationSchema.safeParse(artifact).success, false);
});

test('valid sanitized patch audit is accepted and has no sensitive fields', () => {
  const audit = PatchAuditSchema.parse({
    schemaVersion: PATCH_AUDIT_SCHEMA_VERSION,
    timestampUtc: '2026-07-15T12:00:00.000Z',
    patchEngineVersion: PATCH_ENGINE_VERSION,
    approvedInputHashes: {
      evidenceSha256: REVIEWED_PHASE1B_HASHES.evidence,
      repairPlanSha256: REVIEWED_PHASE1B_HASHES.repairPlan,
      modelAuditSha256: REVIEWED_PHASE1B_HASHES.modelAudit,
    },
    allowedFiles: [
      'apps/demo-checkout/src/App.tsx',
      'apps/demo-checkout/src/styles.css',
    ],
    safeFixClasses: ['associate_explicit_label', 'restore_focus_visible'],
    isolatedWorkingCopyStrategy:
      ISOLATED_WORKING_COPY_STRATEGY,
    changedFiles: [
      'apps/demo-checkout/src/App.tsx',
      'apps/demo-checkout/src/styles.css',
    ],
    policyResult: 'accepted',
    verificationResult: 'passed',
    cleanupResult: 'removed',
  });
  const serialized = JSON.stringify(audit);
  assert.doesNotMatch(serialized, /apiKey|rawPrompt|rawResponse|\/home\//);
});
