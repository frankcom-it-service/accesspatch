import assert from 'node:assert/strict';
import test from 'node:test';
import {
  JourneyEvidenceSchema,
  RepairPlanSchema,
} from '../../packages/shared-types/src/index.ts';
import {
  mutableEvidence,
  mutablePlan,
  validEvidence,
  validRepairPlan,
} from './fixtures.ts';

test('valid evidence schema accepts the controlled evidence shape', () => {
  assert.deepEqual(JourneyEvidenceSchema.parse(validEvidence()), validEvidence());
});

test('malformed evidence is rejected', () => {
  const evidence = structuredClone(validEvidence()) as unknown as Record<
    string,
    unknown
  >;
  evidence.schemaVersion = 'invalid';
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('duplicate evidence findings are rejected', () => {
  const evidence = structuredClone(validEvidence());
  evidence.findings[1] = structuredClone(evidence.findings[0]);
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('missing evidence finding is rejected', () => {
  const evidence = structuredClone(validEvidence()) as unknown as {
    findings: unknown[];
  };
  evidence.findings = evidence.findings.slice(0, 1);
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('duplicate source-context allowlist entries are rejected', () => {
  const evidence = mutableEvidence();
  evidence.sourceContextPolicy.allowedFiles = [
    'apps/demo-checkout/src/App.tsx',
    'apps/demo-checkout/src/App.tsx',
  ];
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('mismatched controlled affected selector is rejected', () => {
  const evidence = mutableEvidence();
  evidence.findings[0].affectedSelector = '#other-email';
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('mismatched controlled source-file hint is rejected', () => {
  const evidence = mutableEvidence();
  evidence.findings[0].sourceFileHint = 'apps/demo-checkout/src/styles.css';
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('source-context file differing from its finding hint is rejected', () => {
  const evidence = mutableEvidence();
  const sourceContext = evidence.findings[0].sourceContext as Record<
    string,
    unknown
  >;
  sourceContext.file = 'apps/demo-checkout/src/styles.css';
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('focus evidence claiming a visible indicator is rejected', () => {
  const evidence = mutableEvidence();
  const focusMetadata = evidence.findings[1].focusMetadata as Record<
    string,
    unknown
  >;
  focusMetadata.visibleIndicatorDetected = true;
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('email finding with focus metadata instead of axe metadata is rejected', () => {
  const evidence = mutableEvidence();
  evidence.findings[0].axeMetadata = null;
  evidence.findings[0].focusMetadata = structuredClone(
    evidence.findings[1].focusMetadata,
  );
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('focus finding with axe metadata instead of focus metadata is rejected', () => {
  const evidence = mutableEvidence();
  evidence.findings[1].focusMetadata = null;
  evidence.findings[1].axeMetadata = structuredClone(
    evidence.findings[0].axeMetadata,
  );
  assert.equal(JourneyEvidenceSchema.safeParse(evidence).success, false);
});

test('valid repair-plan schema accepts the bounded plan shape', () => {
  assert.deepEqual(RepairPlanSchema.parse(validRepairPlan()), validRepairPlan());
});

test('repair-plan schema rejects a disallowed fix class', () => {
  const plan = mutablePlan();
  plan.repairs[0].safeFixClass = 'rewrite_checkout';
  assert.equal(RepairPlanSchema.safeParse(plan).success, false);
});
