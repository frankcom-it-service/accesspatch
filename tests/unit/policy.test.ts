import assert from 'node:assert/strict';
import test from 'node:test';
import { validateRepairPlanPolicy } from '../../packages/repair-reasoner/src/policy.ts';
import { mutablePlan, validRepairPlan } from './fixtures.ts';

test('valid deterministic plan is accepted', () => {
  const result = validateRepairPlanPolicy(validRepairPlan());
  assert.equal(result.accepted, true);
});

test('duplicate findings are rejected', () => {
  const plan = mutablePlan();
  plan.repairs[1].findingId = 'CONTROLLED_BARRIER_EMAIL_NAME';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('missing findings are rejected', () => {
  const plan = mutablePlan();
  plan.repairs = plan.repairs.slice(0, 1);
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('disallowed fix class is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].safeFixClass = 'redesign_checkout';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('wrong finding-to-fix mapping is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].safeFixClass = 'restore_focus_visible';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('disallowed target path is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].intendedTargetFile = 'apps/demo-checkout/src/main.tsx';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('absolute target path is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].intendedTargetFile = '/tmp/App.tsx';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('path traversal target is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].intendedTargetFile = '../apps/demo-checkout/src/App.tsx';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('missing automated verification is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].automatedVerificationSteps = [];
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('missing human review is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].humanReviewSteps = [];
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('positive legal or compliance claim is rejected', () => {
  const plan = mutablePlan();
  plan.evidenceBasedSummary = 'This guarantees compliance for the checkout.';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('dependency change request is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].permittedChangeDescription = 'Install a dependency for labels.';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('unwrapped CSS declaration is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[1].permittedChangeDescription = 'outline: 3px solid black;';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('CSS selector block is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[1].permittedChangeDescription =
    '.controlled-focus-defect:focus { outline: 3px solid black; }';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('JSX-style attribute assignment is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].permittedChangeDescription = 'Set htmlFor="email" on the label.';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});

test('JavaScript assignment expression is rejected', () => {
  const plan = mutablePlan();
  plan.repairs[0].permittedChangeDescription = 'emailInput.id = "email";';
  assert.equal(validateRepairPlanPolicy(plan).accepted, false);
});
