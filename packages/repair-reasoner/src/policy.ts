import { isAbsolute } from 'node:path';
import {
  FINDING_IDS,
  REQUIRED_FORBIDDEN_CHANGES,
  RepairPlanSchema,
  type RepairPlan,
} from '@accesspatch/shared-types';

export type PolicyValidationResult =
  | { accepted: true; plan: RepairPlan; issues: [] }
  | { accepted: false; issues: string[] };

const expectedRepairs = {
  CONTROLLED_BARRIER_EMAIL_NAME: {
    safeFixClass: 'associate_explicit_label',
    targetFile: 'apps/demo-checkout/src/App.tsx',
    targetSelectorOrArea: '#email',
  },
  CONTROLLED_BARRIER_FOCUS_VISIBLE: {
    safeFixClass: 'restore_focus_visible',
    targetFile: 'apps/demo-checkout/src/styles.css',
    targetSelectorOrArea: '.controlled-focus-defect',
  },
} as const;

const prohibitedRequestPatterns = [
  /\b(?:add|change|install|upgrade|remove)\s+(?:a\s+)?(?:dependency|dependencies|package|packages)\b/i,
  /\b(?:rewrite|replace)\s+(?:the\s+)?content\b/i,
  /\b(?:redesign|complex widget)\b/i,
  /\b(?:authentication|payment processing)\b/i,
  /\b(?:auto(?:matic)?(?:ally)?\s+)?(?:merge|push)\b/i,
  /\b(?:fully compliant|guarantees? compliance|certif(?:y|ies|ied)|legal assurance)\b/i,
  /\b(?:WCAG|BFSG|EAA)\b/i,
  /```|diff --git|^\s*[+-]{3}\s/m,
  /\b(?:pnpm|npm|yarn|bash|curl|sudo)\b/i,
  /\bgit\s+(?:push|merge|commit|apply)\b/i,
  /<\/?[a-z][^>]*>|\b(?:const|let|function)\s+[A-Za-z_$]/i,
  /\b(?:outline|outline-offset|box-shadow|border|background|color|display|margin|padding|font(?:-\w+)?)\s*:\s*[^;\n{}]+;/i,
  /(?:^|\s)(?:[.#][A-Za-z_-][\w-]*|[A-Za-z][\w-]*(?::[\w-]+)+|\[[^\]]+\])\s*\{[^{}]*\}/im,
  /\b(?:htmlFor|className|tabIndex|aria-[\w-]+)\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\})/i,
  /\b[A-Za-z_$][\w$]*(?:\.(?:style|className|id|htmlFor|value|setAttribute))\s*=\s*(?!=)[^\n;]+;?/i,
  /=>\s*(?:\{|[A-Za-z_$])/,
];

export function validateRepairPlanPolicy(value: unknown): PolicyValidationResult {
  const parsed = RepairPlanSchema.safeParse(value);
  if (!parsed.success) {
    return {
      accepted: false,
      issues: parsed.error.issues.map(
        (issue) => `schema_invalid:${issue.path.join('.') || 'root'}:${issue.code}`,
      ),
    };
  }

  const plan = parsed.data;
  const issues: string[] = [];
  const findingCounts = new Map<string, number>();

  for (const repair of plan.repairs) {
    findingCounts.set(repair.findingId, (findingCounts.get(repair.findingId) ?? 0) + 1);
    const expected = expectedRepairs[repair.findingId];

    if (repair.safeFixClass !== expected.safeFixClass) {
      issues.push(`wrong_fix_class:${repair.findingId}`);
    }
    if (repair.intendedTargetFile !== expected.targetFile) {
      issues.push(`wrong_target_file:${repair.findingId}`);
    }
    if (repair.intendedTargetSelectorOrArea !== expected.targetSelectorOrArea) {
      issues.push(`wrong_target_area:${repair.findingId}`);
    }
    if (
      isAbsolute(repair.intendedTargetFile) ||
      repair.intendedTargetFile.split('/').includes('..')
    ) {
      issues.push(`unsafe_path:${repair.findingId}`);
    }
    if (repair.riskLevel !== 'low') {
      issues.push(`risk_not_low:${repair.findingId}`);
    }
    if (repair.confidence < 0 || repair.confidence > 1) {
      issues.push(`confidence_out_of_range:${repair.findingId}`);
    }
    if (repair.automatedVerificationSteps.length === 0) {
      issues.push(`missing_automated_verification:${repair.findingId}`);
    }
    if (repair.humanReviewSteps.length === 0) {
      issues.push(`missing_human_review:${repair.findingId}`);
    }

    const forbiddenChangeSet = new Set(repair.forbiddenChanges);
    if (
      forbiddenChangeSet.size !== REQUIRED_FORBIDDEN_CHANGES.length ||
      REQUIRED_FORBIDDEN_CHANGES.some((entry) => !forbiddenChangeSet.has(entry))
    ) {
      issues.push(`incomplete_forbidden_changes:${repair.findingId}`);
    }
  }

  for (const findingId of FINDING_IDS) {
    if (findingCounts.get(findingId) !== 1) {
      issues.push(`finding_count_invalid:${findingId}`);
    }
  }

  const policyText = [
    plan.evidenceBasedSummary,
    ...plan.overallResidualRisks,
    ...plan.repairs.flatMap((repair) => [
      repair.rationale,
      repair.userImpact,
      repair.intendedTargetSelectorOrArea,
      repair.permittedChangeDescription,
      ...repair.automatedVerificationSteps,
      ...repair.humanReviewSteps,
    ]),
  ].join('\n');

  for (const pattern of prohibitedRequestPatterns) {
    if (pattern.test(policyText)) {
      issues.push(`prohibited_content:${pattern.source}`);
    }
  }

  if (!plan.preserveOriginalDemoRepository) {
    issues.push('original_repository_not_preserved');
  }

  if (issues.length > 0) {
    return { accepted: false, issues: [...new Set(issues)] };
  }

  return { accepted: true, plan, issues: [] };
}
