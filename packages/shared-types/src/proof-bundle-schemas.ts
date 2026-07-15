import { z } from 'zod';
import {
  AuditUsageSchema,
  FindingSchema,
  FINDING_IDS,
  JOURNEY_ID,
  MODEL_ID,
} from './schemas.ts';

export const PROOF_BUNDLE_VERSION = '1.0.0-phase2a' as const;
export const PROOF_SUMMARY_SCHEMA_VERSION = 'accesspatch.proof-summary.v1' as const;
export const PROOF_FINDINGS_SCHEMA_VERSION = 'accesspatch.proof-findings.v1' as const;
export const JOURNEY_MAP_SCHEMA_VERSION = 'accesspatch.journey-map.v1' as const;
export const BEFORE_RESULT_SCHEMA_VERSION = 'accesspatch.test-result.before.v1' as const;
export const AFTER_RESULT_SCHEMA_VERSION = 'accesspatch.test-result.after.v1' as const;
export const AUDIT_LOG_SCHEMA_VERSION = 'accesspatch.audit-log.v1' as const;
export const NON_CERTIFICATION_STATEMENT =
  'This Proof Bundle is not a compliance certification and does not prove complete accessibility.' as const;
export const MANIFEST_STRATEGY =
  'summary.json hashes every generated file except itself; directories are represented by their contained file hashes.' as const;

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
export type JourneyMap = z.infer<typeof JourneyMapSchema>;
export type BeforeBaselineResult = z.infer<typeof BeforeBaselineResultSchema>;
export type AfterReplayResult = z.infer<typeof AfterReplayResultSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
