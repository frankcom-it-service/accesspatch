import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CONTROLLED_FINDING_IDS,
  type JudgeBaselineObservation,
  validateJudgeBaselineObservation,
} from '../e2e/judge-baseline-contract.ts';

function validObservation(): JudgeBaselineObservation {
  return {
    productPageReached: true,
    productAddedToCart: true,
    checkoutOpened: true,
    checkoutFormReached: true,
    emailAccessibleName: '',
    emailLabelsCount: 0,
    emailAriaLabel: null,
    emailAriaLabelledby: null,
    primaryActionFocused: true,
    focus: {
      outlineStyle: 'none',
      outlineWidth: '3px',
      boxShadow: 'none',
      visibleIndicatorDetected: false,
    },
    axeViolations: [{ id: 'label', targets: ['#email'] }],
    confirmationReached: true,
    findingIds: [...CONTROLLED_FINDING_IDS],
  };
}

test('accepts the exact passing judge baseline proof', () => {
  assert.deepEqual(validateJudgeBaselineObservation(validObservation()), validObservation());
});

test('rejects a repaired email accessible name', () => {
  const observation = validObservation();
  observation.emailAccessibleName = 'Email address';
  assert.throws(
    () => validateJudgeBaselineObservation(observation),
    /judge_baseline_contract_failed:email_accessible_name/,
  );
});

test('rejects restored focus visibility', () => {
  const observation = validObservation();
  observation.focus = {
    outlineStyle: 'solid',
    outlineWidth: '3px',
    boxShadow: 'none',
    visibleIndicatorDetected: true,
  };
  assert.throws(
    () => validateJudgeBaselineObservation(observation),
    /judge_baseline_contract_failed:focus_outline_style/,
  );
});

test('rejects an extra axe violation', () => {
  const observation = validObservation();
  observation.axeViolations.push({ id: 'color-contrast', targets: ['.other'] });
  assert.throws(
    () => validateJudgeBaselineObservation(observation),
    /judge_baseline_contract_failed:axe_violation_count/,
  );
});

test('rejects a journey that does not reach confirmation', () => {
  const observation = validObservation();
  observation.confirmationReached = false;
  assert.throws(
    () => validateJudgeBaselineObservation(observation),
    /judge_baseline_contract_failed:confirmation/,
  );
});
