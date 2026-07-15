import { z } from 'zod';
import {
  AuditUsageSchema,
  FindingSchema,
  FINDING_IDS,
  JOURNEY_ID,
  MODEL_ID,
} from './schemas.ts';

export const PROOF_BUNDLE_VERSION = '1.1.0-phase2b' as const;
export const PROOF_SUMMARY_SCHEMA_VERSION = 'accesspatch.proof-summary.v2' as const;
export const PROOF_FINDINGS_SCHEMA_VERSION = 'accesspatch.proof-findings.v2' as const;
export const JOURNEY_MAP_SCHEMA_VERSION = 'accesspatch.journey-map.v1' as const;
export const BEFORE_RESULT_SCHEMA_VERSION = 'accesspatch.test-result.before.v1' as const;
export const AFTER_RESULT_SCHEMA_VERSION = 'accesspatch.test-result.after.v1' as const;
export const AUDIT_LOG_SCHEMA_VERSION = 'accesspatch.audit-log.v1' as const;
export const NON_CERTIFICATION_STATEMENT =
  'This Proof Bundle is not a compliance certification and does not prove complete accessibility.' as const;
export const MANIFEST_STRATEGY =
  'summary.json hashes every generated file except itself; directories are represented by their contained file hashes.' as const;
export const WCAG_VERSION = '2.2' as const;
export const WCAG_MAPPING_SCOPE =
  'Evidence-oriented mapping limited to the two controlled findings in the demo-checkout keyboard journey.' as const;
export const WCAG_MAPPING_CLAIM_BOUNDARY =
  'This mapping is not a WCAG conformance determination or certification and does not establish full WCAG coverage.' as const;

export const WCAG_MAPPING_DEFINITIONS = [
  {
    findingId: 'CONTROLLED_BARRIER_EMAIL_NAME',
    wcagVersion: WCAG_VERSION,
    wcagReference: '1.3.1',
    referenceLabel: 'Info and Relationships',
    conformanceLevel: 'A',
    normativeSourceUrl: 'https://www.w3.org/TR/WCAG22/#info-and-relationships',
    understandingSourceUrl:
      'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    mappingBasis:
      'The visible Email address relationship is not programmatically associated with #email.',
  },
  {
    findingId: 'CONTROLLED_BARRIER_EMAIL_NAME',
    wcagVersion: WCAG_VERSION,
    wcagReference: '4.1.2',
    referenceLabel: 'Name, Role, Value',
    conformanceLevel: 'A',
    normativeSourceUrl: 'https://www.w3.org/TR/WCAG22/#name-role-value',
    understandingSourceUrl:
      'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
    mappingBasis:
      'The #email form control has no programmatically determinable accessible name.',
  },
  {
    findingId: 'CONTROLLED_BARRIER_FOCUS_VISIBLE',
    wcagVersion: WCAG_VERSION,
    wcagReference: '2.4.7',
    referenceLabel: 'Focus Visible',
    conformanceLevel: 'AA',
    normativeSourceUrl: 'https://www.w3.org/TR/WCAG22/#focus-visible',
    understandingSourceUrl:
      'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html',
    mappingBasis:
      'The keyboard-focused primary action has no visible focus indicator because controlled CSS suppresses its outline and box shadow.',
  },
] as const;

export const WcagMappingReferenceSchema = z.discriminatedUnion('wcagReference', [
  z
    .object({
      wcagVersion: z.literal(WCAG_MAPPING_DEFINITIONS[0].wcagVersion),
      wcagReference: z.literal(WCAG_MAPPING_DEFINITIONS[0].wcagReference),
      referenceLabel: z.literal(WCAG_MAPPING_DEFINITIONS[0].referenceLabel),
      conformanceLevel: z.literal(WCAG_MAPPING_DEFINITIONS[0].conformanceLevel),
      normativeSourceUrl: z.literal(WCAG_MAPPING_DEFINITIONS[0].normativeSourceUrl),
      understandingSourceUrl: z.literal(
        WCAG_MAPPING_DEFINITIONS[0].understandingSourceUrl,
      ),
      mappingBasis: z.literal(WCAG_MAPPING_DEFINITIONS[0].mappingBasis),
      manualReviewRequired: z.literal(true),
      claimBoundary: z.literal(WCAG_MAPPING_CLAIM_BOUNDARY),
    })
    .strict(),
  z
    .object({
      wcagVersion: z.literal(WCAG_MAPPING_DEFINITIONS[1].wcagVersion),
      wcagReference: z.literal(WCAG_MAPPING_DEFINITIONS[1].wcagReference),
      referenceLabel: z.literal(WCAG_MAPPING_DEFINITIONS[1].referenceLabel),
      conformanceLevel: z.literal(WCAG_MAPPING_DEFINITIONS[1].conformanceLevel),
      normativeSourceUrl: z.literal(WCAG_MAPPING_DEFINITIONS[1].normativeSourceUrl),
      understandingSourceUrl: z.literal(
        WCAG_MAPPING_DEFINITIONS[1].understandingSourceUrl,
      ),
      mappingBasis: z.literal(WCAG_MAPPING_DEFINITIONS[1].mappingBasis),
      manualReviewRequired: z.literal(true),
      claimBoundary: z.literal(WCAG_MAPPING_CLAIM_BOUNDARY),
    })
    .strict(),
  z
    .object({
      wcagVersion: z.literal(WCAG_MAPPING_DEFINITIONS[2].wcagVersion),
      wcagReference: z.literal(WCAG_MAPPING_DEFINITIONS[2].wcagReference),
      referenceLabel: z.literal(WCAG_MAPPING_DEFINITIONS[2].referenceLabel),
      conformanceLevel: z.literal(WCAG_MAPPING_DEFINITIONS[2].conformanceLevel),
      normativeSourceUrl: z.literal(WCAG_MAPPING_DEFINITIONS[2].normativeSourceUrl),
      understandingSourceUrl: z.literal(
        WCAG_MAPPING_DEFINITIONS[2].understandingSourceUrl,
      ),
      mappingBasis: z.literal(WCAG_MAPPING_DEFINITIONS[2].mappingBasis),
      manualReviewRequired: z.literal(true),
      claimBoundary: z.literal(WCAG_MAPPING_CLAIM_BOUNDARY),
    })
    .strict(),
]);

export const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
export const GitCommitSchema = z.string().regex(/^[a-f0-9]{40}$/);
export const RepositoryRelativePathSchema = z
  .string()
  .min(1)
  .refine((value) => !value.startsWith('/') && !value.includes('..'), {
    message: 'Path must remain repository relative.',
  });

export const SourceArtifactHashesSchema = z
  .object({
    evidence: Sha256Schema,
    repairPlan: Sha256Schema,
    modelAudit: Sha256Schema,
    patch: Sha256Schema,
    replay: Sha256Schema,
    verification: Sha256Schema,
    patchAudit: Sha256Schema,
    manualReview: Sha256Schema,
  })
  .strict();

export const ProofSummarySchema = z
  .object({
    schemaVersion: z.literal(PROOF_SUMMARY_SCHEMA_VERSION),
    productName: z.literal('AccessPatch'),
    bundleVersion: z.literal(PROOF_BUNDLE_VERSION),
    generatedAtUtc: z.string().datetime(),
    manifestStrategy: z.literal(MANIFEST_STRATEGY),
    baseImplementationCommit: GitCommitSchema,
    repositoryHeadAtGeneration: GitCommitSchema,
    journeyId: z.literal(JOURNEY_ID),
    scopeStatement: z.string().min(1).max(500),
    beforeStateFindingCount: z.literal(2),
    repairedFindingCount: z.literal(2),
    unresolvedAutomatedFindingCount: z.literal(0),
    manualReviewItemCount: z.number().int().positive(),
    wcagMapping: z
      .object({
        version: z.literal(WCAG_VERSION),
        criterionMappingCount: z.literal(3),
        mappedFindingCount: z.literal(2),
        scope: z.literal(WCAG_MAPPING_SCOPE),
        conclusion: z.literal(WCAG_MAPPING_CLAIM_BOUNDARY),
      })
      .strict(),
    model: z
      .object({
        id: z.literal(MODEL_ID),
        responseStatus: z.literal('completed'),
        store: z.literal(false),
        usage: AuditUsageSchema,
      })
      .strict(),
    deterministicPolicyResult: z.literal('accepted'),
    patchVerificationResult: z.literal('passed'),
    replayResult: z.literal('passed'),
    axe: z
      .object({
        before: z
          .object({
            violationCount: z.literal(1),
            ruleIds: z.tuple([z.literal('label')]),
            targets: z.tuple([z.literal('#email')]),
          })
          .strict(),
        after: z
          .object({
            violationCount: z.literal(0),
            ruleIds: z.tuple([]),
            emailLabelViolationPresent: z.literal(false),
          })
          .strict(),
      })
      .strict(),
    confirmationReached: z.literal(true),
    originalFixturePreserved: z.literal(true),
    sourceArtifactSha256: SourceArtifactHashesSchema,
    generatedEntrySha256: z.record(RepositoryRelativePathSchema, Sha256Schema),
    nonCertificationStatement: z.literal(NON_CERTIFICATION_STATEMENT),
  })
  .strict();

export const ProofFindingSchema = FindingSchema.extend({
  repairStatus: z.literal('verified_repaired_in_isolated_copy'),
  verificationArtifact: z.literal('test-results/verification.json'),
  wcagMappings: z.array(WcagMappingReferenceSchema).min(1).max(2),
}).strict();

export const ProofFindingsSchema = z
  .object({
    schemaVersion: z.literal(PROOF_FINDINGS_SCHEMA_VERSION),
    journeyId: z.literal(JOURNEY_ID),
    findings: z.tuple([ProofFindingSchema, ProofFindingSchema]),
  })
  .strict()
  .superRefine((value, context) => {
    const ids = value.findings.map((finding) => finding.findingId);
    if (ids[0] !== FINDING_IDS[0] || ids[1] !== FINDING_IDS[1]) {
      context.addIssue({
        code: 'custom',
        path: ['findings'],
        message: 'Proof findings must retain deterministic controlled ordering.',
      });
    }
    for (const finding of value.findings) {
      const expected = WCAG_MAPPING_DEFINITIONS.filter(
        (mapping) => mapping.findingId === finding.findingId,
      ).map(({ findingId: _findingId, ...mapping }) => ({
        ...mapping,
        manualReviewRequired: true as const,
        claimBoundary: WCAG_MAPPING_CLAIM_BOUNDARY,
      }));
      if (JSON.stringify(finding.wcagMappings) !== JSON.stringify(expected)) {
        context.addIssue({
          code: 'custom',
          path: ['findings', finding.findingId, 'wcagMappings'],
          message: 'Proof finding WCAG mappings must match the controlled allowlist.',
        });
      }
    }
  });

export const JourneyStateIdSchema = z.enum([
  'product-page',
  'cart-populated',
  'checkout-opened',
  'checkout-form',
  'barriers-observed',
  'sample-form-completed',
  'confirmation-reached',
  'isolated-replay-completed',
]);

export const JourneyMapSchema = z
  .object({
    schemaVersion: z.literal(JOURNEY_MAP_SCHEMA_VERSION),
    journeyId: z.literal(JOURNEY_ID),
    inputMode: z.literal('keyboard'),
    states: z
      .array(
        z
          .object({
            stateId: JourneyStateIdSchema,
            label: z.string().min(1).max(160),
            evidenceReference: RepositoryRelativePathSchema,
          })
          .strict(),
      )
      .length(8),
    transitions: z
      .array(
        z
          .object({
            from: JourneyStateIdSchema,
            to: JourneyStateIdSchema,
            keyboardAction: z.string().min(1).max(240),
          })
          .strict(),
      )
      .length(7),
    screenshotsOrTracesIncluded: z.literal(false),
  })
  .strict();

export const BeforeBaselineResultSchema = z
  .object({
    schemaVersion: z.literal(BEFORE_RESULT_SCHEMA_VERSION),
    sourcePhase: z.literal('Phase 1A/1B'),
    executedDuringPhase2A: z.literal(false),
    command: z.literal('pnpm test:baseline'),
    expectedExitBehavior: z.literal('non-zero because both controlled barriers remain'),
    status: z.literal('intentionally_failed'),
    findingIds: z.tuple([
      z.literal(FINDING_IDS[0]),
      z.literal(FINDING_IDS[1]),
    ]),
    axeResult: z
      .object({
        violationCount: z.literal(1),
        ruleIds: z.tuple([z.literal('label')]),
        targets: z.tuple([z.literal('#email')]),
      })
      .strict(),
    focusValues: z
      .object({
        outlineStyle: z.literal('none'),
        outlineWidth: z.string().min(1),
        boxShadow: z.literal('none'),
        visibleIndicatorDetected: z.literal(false),
      })
      .strict(),
    confirmationReached: z.literal(true),
    sourceArtifact: z.literal('findings.json'),
  })
  .strict();

export const AfterReplayResultSchema = z
  .object({
    schemaVersion: z.literal(AFTER_RESULT_SCHEMA_VERSION),
    sourcePhase: z.literal('Phase 1C'),
    executedDuringPhase2A: z.literal(false),
    command: z.literal('playwright test replay.spec.ts --config=<ephemeral-config>'),
    expectedExitBehavior: z.literal('zero'),
    status: z.literal('passed'),
    repairedFindingIds: z.tuple([
      z.literal(FINDING_IDS[0]),
      z.literal(FINDING_IDS[1]),
    ]),
    axeResult: z
      .object({
        violationCount: z.literal(0),
        ruleIds: z.tuple([]),
        emailLabelViolationPresent: z.literal(false),
      })
      .strict(),
    focusValues: z
      .object({
        outlineStyle: z.string().min(1),
        outlineWidth: z.string().min(1),
        boxShadow: z.string().min(1),
        visibleIndicatorDetected: z.literal(true),
      })
      .strict(),
    confirmationReached: z.literal(true),
    sourceArtifact: z.literal('test-results/verification.json'),
  })
  .strict();

export const AuditLogEntrySchema = z
  .object({
    timestampUtc: z.string().datetime().nullable(),
    phase: z.string().min(1).max(80),
    action: z.string().min(1).max(200),
    tool: z.string().min(1).max(120),
    model: z.literal(MODEL_ID).nullable(),
    inputArtifactHashes: z.record(z.string().min(1), Sha256Schema),
    outputArtifactHashes: z.record(z.string().min(1), Sha256Schema),
    status: z.enum(['passed', 'accepted', 'completed', 'generated']),
    gate: z.string().min(1).max(300),
    relevantCommit: GitCommitSchema.nullable(),
    privacySafetyNotes: z.string().min(1).max(400),
  })
  .strict();

export const AuditLogSchema = z
  .object({
    schemaVersion: z.literal(AUDIT_LOG_SCHEMA_VERSION),
    entries: z.array(AuditLogEntrySchema).length(7),
  })
  .strict();

export type ProofSummary = z.infer<typeof ProofSummarySchema>;
export type ProofFindings = z.infer<typeof ProofFindingsSchema>;
export type WcagMappingReference = z.infer<typeof WcagMappingReferenceSchema>;
export type JourneyMap = z.infer<typeof JourneyMapSchema>;
export type BeforeBaselineResult = z.infer<typeof BeforeBaselineResultSchema>;
export type AfterReplayResult = z.infer<typeof AfterReplayResultSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
