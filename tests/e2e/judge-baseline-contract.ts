export const CONTROLLED_FINDING_IDS = [
  'CONTROLLED_BARRIER_EMAIL_NAME',
  'CONTROLLED_BARRIER_FOCUS_VISIBLE',
] as const;

export interface JudgeBaselineObservation {
  productPageReached: boolean;
  productAddedToCart: boolean;
  checkoutOpened: boolean;
  checkoutFormReached: boolean;
  emailAccessibleName: string;
  emailLabelsCount: number;
  emailAriaLabel: string | null;
  emailAriaLabelledby: string | null;
  primaryActionFocused: boolean;
  focus: {
    outlineStyle: string;
    outlineWidth: string;
    boxShadow: string;
    visibleIndicatorDetected: boolean;
  };
  axeViolations: Array<{
    id: string;
    targets: string[];
  }>;
  confirmationReached: boolean;
  findingIds: string[];
}

function requireCondition(condition: boolean, category: string): void {
  if (!condition) {
    throw new Error(`judge_baseline_contract_failed:${category}`);
  }
}

export function validateJudgeBaselineObservation(
  observation: JudgeBaselineObservation,
): JudgeBaselineObservation {
  requireCondition(observation.productPageReached, 'product_page');
  requireCondition(observation.productAddedToCart, 'cart');
  requireCondition(observation.checkoutOpened, 'checkout_opened');
  requireCondition(observation.checkoutFormReached, 'checkout_form');
  requireCondition(observation.emailAccessibleName === '', 'email_accessible_name');
  requireCondition(observation.emailLabelsCount === 0, 'email_label_count');
  requireCondition(observation.emailAriaLabel === null, 'email_aria_label');
  requireCondition(observation.emailAriaLabelledby === null, 'email_aria_labelledby');
  requireCondition(observation.primaryActionFocused, 'primary_action_focus');
  requireCondition(observation.focus.outlineStyle === 'none', 'focus_outline_style');
  requireCondition(observation.focus.outlineWidth === '3px', 'focus_outline_width');
  requireCondition(observation.focus.boxShadow === 'none', 'focus_box_shadow');
  requireCondition(!observation.focus.visibleIndicatorDetected, 'focus_visibility');
  requireCondition(observation.axeViolations.length === 1, 'axe_violation_count');
  requireCondition(observation.axeViolations[0]?.id === 'label', 'axe_rule');
  requireCondition(
    JSON.stringify(observation.axeViolations[0]?.targets) === JSON.stringify(['#email']),
    'axe_targets',
  );
  requireCondition(observation.confirmationReached, 'confirmation');
  requireCondition(
    JSON.stringify(observation.findingIds) === JSON.stringify(CONTROLLED_FINDING_IDS),
    'finding_ids',
  );
  return observation;
}
