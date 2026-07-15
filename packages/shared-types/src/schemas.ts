import { z } from 'zod';

export const EVIDENCE_SCHEMA_VERSION = '1.0.0' as const;
export const REPAIR_PLAN_SCHEMA_VERSION = '1.0.0' as const;
export const AUDIT_SCHEMA_VERSION = '1.0.0' as const;
export const JOURNEY_ID = 'demo-checkout-keyboard-v1' as const;
export const PROMPT_VERSION = 'phase1-repair-plan-v1' as const;
export const MODEL_ID = 'gpt-5.6-sol' as const;

export const FINDING_IDS = [
  'CONTROLLED_BARRIER_EMAIL_NAME',
  'CONTROLLED_BARRIER_FOCUS_VISIBLE',
] as const;

export const SAFE_FIX_CLASSES = [
  'associate_explicit_label',
  'restore_focus_visible',
] as const;

export const ALLOWED_TARGET_FILES = [
  'apps/demo-checkout/src/App.tsx',
  'apps/demo-checkout/src/styles.css',
] as const;

export const REQUIRED_FORBIDDEN_CHANGES = [
  'Do not add or change dependencies.',
  'Do not rewrite content or redesign unrelated UI.',
  'Do not alter authentication or payment processing.',
  'Do not claim compliance or legal certification.',
  'Do not merge, push, or apply changes automatically.',
  'Do not modify files outside the allowed target.',
] as const;

export const FindingIdSchema = z.enum(FINDING_IDS);
export const SafeFixClassSchema = z.enum(SAFE_FIX_CLASSES);
export const AllowedTargetFileSchema = z.enum(ALLOWED_TARGET_FILES);

export const BoundedSourceContextSchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_SCHEMA_VERSION),
    file: AllowedTargetFileSchema,
    selectionBasis: z.string().min(1).max(240),
    excerpt: z.string().min(1).max(1200),
    completeFile: z.literal(false),
  })
  .strict();

export const AxeMetadataSchema = z
  .object({
    ruleId: z.literal('label'),
    impact: z.enum(['minor', 'moderate', 'serious', 'critical']),
    target: z.literal('#email'),
    help: z.string().min(1).max(240),
  })
  .strict();

export const FocusMetadataSchema = z
  .object({
    outlineStyle: z.string().min(1).max(80),
    outlineWidth: z.string().min(1).max(80),
    boxShadow: z.string().min(1).max(240),
    visibleIndicatorDetected: z.boolean(),
  })
  .strict();

export const FindingSchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_SCHEMA_VERSION),
    findingId: FindingIdSchema,
    journeyId: z.literal(JOURNEY_ID),
    stepId: z.string().min(1).max(120),
    routeOrState: z.string().min(1).max(120),
    affectedSelector: z.string().min(1).max(160),
    userFacingImpact: z.string().min(1).max(480),
    observedCondition: z.string().min(1).max(600),
    expectedCondition: z.string().min(1).max(600),
    safeFixClass: SafeFixClassSchema,
    sourceFileHint: AllowedTargetFileSchema,
    sourceContext: BoundedSourceContextSchema,
    axeMetadata: AxeMetadataSchema.nullable(),
    focusMetadata: FocusMetadataSchema.nullable(),
    confidenceBasis: z.array(z.string().min(1).max(300)).min(1).max(6),
    requiredAutomatedVerification: z
      .array(z.string().min(1).max(300))
      .min(1)
      .max(6),
    requiredHumanReview: z.array(z.string().min(1).max(300)).min(1).max(6),
  })
  .strict();

export const JourneyEvidenceSchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_SCHEMA_VERSION),
    capturedAtUtc: z.string().datetime(),
    journey: z
      .object({
        journeyId: z.literal(JOURNEY_ID),
        name: z.string().min(1).max(160),
        steps: z.array(z.string().min(1).max(200)).min(1).max(12),
        confirmationReached: z.literal(true),
      })
      .strict(),
    sourceContextPolicy: z
      .object({
        allowedFiles: z.array(AllowedTargetFileSchema).length(2),
        maximumCharactersPerFinding: z.literal(1200),
        completeFilesIncluded: z.literal(false),
      })
      .strict()
      .superRefine((policy, context) => {
        const allowedFiles = new Set(policy.allowedFiles);
        if (
          allowedFiles.size !== ALLOWED_TARGET_FILES.length ||
          ALLOWED_TARGET_FILES.some((file) => !allowedFiles.has(file))
        ) {
          context.addIssue({
            code: 'custom',
            path: ['allowedFiles'],
            message: 'Source context policy must contain each allowlisted file once.',
          });
        }
      }),
    axeSummary: z
      .object({
        violationCount: z.literal(1),
        ruleIds: z.tuple([z.literal('label')]),
        targets: z.tuple([z.literal('#email')]),
      })
      .strict(),
    findings: z.array(FindingSchema).length(2),
  })
  .strict()
  .superRefine((evidence, context) => {
    const ids = evidence.findings.map((finding) => finding.findingId);
    if (new Set(ids).size !== FINDING_IDS.length) {
      context.addIssue({
        code: 'custom',
        path: ['findings'],
        message: 'Controlled findings must be unique.',
      });
    }

    for (const requiredId of FINDING_IDS) {
      if (!ids.includes(requiredId)) {
        context.addIssue({
          code: 'custom',
          path: ['findings'],
          message: `Missing controlled finding ${requiredId}.`,
        });
      }
    }

    for (const finding of evidence.findings) {
      if (
        finding.findingId === 'CONTROLLED_BARRIER_EMAIL_NAME' &&
        (finding.safeFixClass !== 'associate_explicit_label' ||
          finding.affectedSelector !== '#email' ||
          finding.sourceFileHint !== 'apps/demo-checkout/src/App.tsx' ||
          finding.sourceContext.file !== finding.sourceFileHint ||
          finding.axeMetadata === null ||
          finding.axeMetadata.target !== '#email' ||
          finding.focusMetadata !== null)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['findings'],
          message: 'Email evidence does not match its controlled contract.',
        });
      }

      if (
        finding.findingId === 'CONTROLLED_BARRIER_FOCUS_VISIBLE' &&
        (finding.safeFixClass !== 'restore_focus_visible' ||
          finding.affectedSelector !== '.controlled-focus-defect' ||
          finding.sourceFileHint !== 'apps/demo-checkout/src/styles.css' ||
          finding.sourceContext.file !== finding.sourceFileHint ||
          finding.focusMetadata === null ||
          finding.focusMetadata.visibleIndicatorDetected !== false ||
          finding.axeMetadata !== null)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['findings'],
          message: 'Focus evidence does not match its controlled contract.',
        });
      }
    }
  });

export const RepairSchema = z
  .object({
    findingId: FindingIdSchema,
    safeFixClass: SafeFixClassSchema,
    priority: z.enum(['high', 'medium', 'low']),
    rationale: z.string().min(1).max(700),
    userImpact: z.string().min(1).max(500),
    riskLevel: z.literal('low'),
    confidence: z.number().min(0).max(1),
    intendedTargetFile: AllowedTargetFileSchema,
    intendedTargetSelectorOrArea: z.string().min(1).max(180),
    permittedChangeDescription: z.string().min(1).max(600),
    forbiddenChanges: z.array(z.enum(REQUIRED_FORBIDDEN_CHANGES)).length(6),
    automatedVerificationSteps: z
      .array(z.string().min(1).max(300))
      .min(1)
      .max(6),
    humanReviewSteps: z.array(z.string().min(1).max(300)).min(1).max(6),
  })
  .strict();

export const RepairPlanSchema = z
  .object({
    schemaVersion: z.literal(REPAIR_PLAN_SCHEMA_VERSION),
    journeyId: z.literal(JOURNEY_ID),
    evidenceBasedSummary: z.string().min(1).max(700),
    repairs: z.array(RepairSchema).length(2),
    overallResidualRisks: z.array(z.string().min(1).max(400)).min(1).max(6),
    preserveOriginalDemoRepository: z.literal(true),
    notComplianceCertification: z.literal(
      'This repair plan is not a compliance certification.',
    ),
  })
  .strict();

export const AuditUsageSchema = z
  .object({
    inputTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
    reasoningTokens: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative(),
  })
  .strict();

export const FailureCategorySchema = z.enum([
  'missing_api_key',
  'evidence_invalid',
  'api_error',
  'model_refusal',
  'response_incomplete',
  'schema_invalid',
  'policy_rejected',
  'unexpected_model',
]);

export const ModelRunAuditSchema = z
  .object({
    schemaVersion: z.literal(AUDIT_SCHEMA_VERSION),
    timestampUtc: z.string().datetime(),
    modelId: z.string().min(1).max(120),
    promptVersion: z.literal(PROMPT_VERSION),
    evidenceSha256: z.string().regex(/^[a-f0-9]{64}$/),
    repairPlanSha256: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
    store: z.literal(false),
    responseStatus: z.enum([
      'not_started',
      'completed',
      'failed',
      'in_progress',
      'cancelled',
      'queued',
      'incomplete',
      'error',
    ]),
    usage: AuditUsageSchema.nullable(),
    policyValidation: z.enum(['accepted', 'rejected', 'not_run']),
    failureCategory: FailureCategorySchema.nullable(),
  })
  .strict();

export type BoundedSourceContext = z.infer<typeof BoundedSourceContextSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type JourneyEvidence = z.infer<typeof JourneyEvidenceSchema>;
export type Repair = z.infer<typeof RepairSchema>;
export type RepairPlan = z.infer<typeof RepairPlanSchema>;
export type AuditUsage = z.infer<typeof AuditUsageSchema>;
export type FailureCategory = z.infer<typeof FailureCategorySchema>;
export type ModelRunAudit = z.infer<typeof ModelRunAuditSchema>;
