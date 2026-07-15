import {
  EVIDENCE_SCHEMA_VERSION,
  JOURNEY_ID,
  REPAIR_PLAN_SCHEMA_VERSION,
  REQUIRED_FORBIDDEN_CHANGES,
  type JourneyEvidence,
  type RepairPlan,
} from '../../packages/shared-types/src/index.ts';

export function validEvidence(): JourneyEvidence {
  return {
    schemaVersion: EVIDENCE_SCHEMA_VERSION,
    capturedAtUtc: '2026-07-15T16:00:00.000Z',
    journey: {
      journeyId: JOURNEY_ID,
      name: 'Controlled demo checkout keyboard journey',
      steps: ['Reach checkout.', 'Inspect both controlled barriers.'],
      confirmationReached: true,
    },
    sourceContextPolicy: {
      allowedFiles: [
        'apps/demo-checkout/src/App.tsx',
        'apps/demo-checkout/src/styles.css',
      ],
      maximumCharactersPerFinding: 1200,
      completeFilesIncluded: false,
    },
    axeSummary: {
      violationCount: 1,
      ruleIds: ['label'],
      targets: ['#email'],
    },
    findings: [
      {
        schemaVersion: EVIDENCE_SCHEMA_VERSION,
        findingId: 'CONTROLLED_BARRIER_EMAIL_NAME',
        journeyId: JOURNEY_ID,
        stepId: 'checkout-contact-email',
        routeOrState: '/checkout',
        affectedSelector: '#email',
        userFacingImpact: 'The field purpose may not be announced.',
        observedCondition: 'No associated label; axe reports label for #email.',
        expectedCondition: 'Email address supplies the accessible name.',
        safeFixClass: 'associate_explicit_label',
        sourceFileHint: 'apps/demo-checkout/src/App.tsx',
        sourceContext: {
          schemaVersion: EVIDENCE_SCHEMA_VERSION,
          file: 'apps/demo-checkout/src/App.tsx',
          selectionBasis: 'Controlled email field only.',
          excerpt: '<bounded email field excerpt>',
          completeFile: false,
        },
        axeMetadata: {
          ruleId: 'label',
          impact: 'critical',
          target: '#email',
          help: 'Form elements must have labels',
        },
        focusMetadata: null,
        confidenceBasis: ['DOM association and axe evidence agree.'],
        requiredAutomatedVerification: ['Verify the accessible name.'],
        requiredHumanReview: ['Review the field announcement.'],
      },
      {
        schemaVersion: EVIDENCE_SCHEMA_VERSION,
        findingId: 'CONTROLLED_BARRIER_FOCUS_VISIBLE',
        journeyId: JOURNEY_ID,
        stepId: 'checkout-continue-focus',
        routeOrState: '/checkout focused primary action',
        affectedSelector: '.controlled-focus-defect',
        userFacingImpact: 'The focused action may not be visually locatable.',
        observedCondition: 'Computed outline and box shadow are absent.',
        expectedCondition: 'A visible focus indicator is present.',
        safeFixClass: 'restore_focus_visible',
        sourceFileHint: 'apps/demo-checkout/src/styles.css',
        sourceContext: {
          schemaVersion: EVIDENCE_SCHEMA_VERSION,
          file: 'apps/demo-checkout/src/styles.css',
          selectionBasis: 'Controlled focus rule only.',
          excerpt: '<bounded focus rule excerpt>',
          completeFile: false,
        },
        axeMetadata: null,
        focusMetadata: {
          outlineStyle: 'none',
          outlineWidth: '3px',
          boxShadow: 'none',
          visibleIndicatorDetected: false,
        },
        confidenceBasis: ['Keyboard focus and computed styles agree.'],
        requiredAutomatedVerification: ['Verify a visible focus indicator.'],
        requiredHumanReview: ['Review visual focus clarity.'],
      },
    ],
  };
}

export function validRepairPlan(): RepairPlan {
  return {
    schemaVersion: REPAIR_PLAN_SCHEMA_VERSION,
    journeyId: JOURNEY_ID,
    evidenceBasedSummary:
      'The checkout evidence identifies one missing email name and one missing visible focus cue.',
    repairs: [
      {
        findingId: 'CONTROLLED_BARRIER_EMAIL_NAME',
        safeFixClass: 'associate_explicit_label',
        priority: 'high',
        rationale:
          'The visible Email address text is not associated with the required input.',
        userImpact: 'The field purpose may not be announced to screen-reader users.',
        riskLevel: 'low',
        confidence: 0.98,
        intendedTargetFile: 'apps/demo-checkout/src/App.tsx',
        intendedTargetSelectorOrArea: '#email',
        permittedChangeDescription:
          'Associate the existing visible Email address text with the existing email input.',
        forbiddenChanges: [...REQUIRED_FORBIDDEN_CHANGES],
        automatedVerificationSteps: [
          'Verify that the email input has the accessible name Email address.',
        ],
        humanReviewSteps: [
          'Review that the visible label remains clear and correctly announced.',
        ],
      },
      {
        findingId: 'CONTROLLED_BARRIER_FOCUS_VISIBLE',
        safeFixClass: 'restore_focus_visible',
        priority: 'high',
        rationale:
          'The focused primary action has no visible outline or box-shadow cue.',
        userImpact: 'Keyboard users may not be able to locate the focused action.',
        riskLevel: 'low',
        confidence: 0.97,
        intendedTargetFile: 'apps/demo-checkout/src/styles.css',
        intendedTargetSelectorOrArea: '.controlled-focus-defect',
        permittedChangeDescription:
          'Restore a visible keyboard focus cue for only the controlled primary action.',
        forbiddenChanges: [...REQUIRED_FORBIDDEN_CHANGES],
        automatedVerificationSteps: [
          'Verify that keyboard focus has a visible outline or box-shadow cue.',
        ],
        humanReviewSteps: [
          'Review the focus cue for visual clarity against the primary action.',
        ],
      },
    ],
    overallResidualRisks: [
      'Automated checks remain incomplete and require qualified human review.',
    ],
    preserveOriginalDemoRepository: true,
    notComplianceCertification: 'This repair plan is not a compliance certification.',
  };
}

export type MutablePlan = {
  schemaVersion: string;
  journeyId: string;
  evidenceBasedSummary: string;
  repairs: Array<Record<string, unknown>>;
  overallResidualRisks: string[];
  preserveOriginalDemoRepository: boolean;
  notComplianceCertification: string;
};

export type MutableEvidence = {
  sourceContextPolicy: {
    allowedFiles: string[];
  };
  findings: Array<Record<string, unknown>>;
};

export function mutableEvidence(): MutableEvidence {
  return structuredClone(validEvidence()) as unknown as MutableEvidence;
}

export function mutablePlan(): MutablePlan {
  return structuredClone(validRepairPlan()) as unknown as MutablePlan;
}
