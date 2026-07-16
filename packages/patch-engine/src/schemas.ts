import { z } from 'zod';
import {
  FINDING_IDS,
  JOURNEY_ID,
} from '@accesspatch/shared-types';
import {
  PATCH_AUDIT_SCHEMA_VERSION,
  PATCH_ENGINE_VERSION,
  ISOLATED_WORKING_COPY_STRATEGY,
  MUTATION_GUARD_FIXTURE_ID,
  MUTATION_GUARD_ID,
  MUTATION_GUARD_RULE,
  MUTATION_GUARD_SCHEMA_VERSION,
  MUTATION_GUARD_TARGET_PATH,
  MUTATION_GUARD_TARGET_SELECTOR,
  MUTATION_GUARD_TYPE,
  PHASE1C_CHANGED_FILES,
  PHASE1C_SAFE_FIX_CLASSES,
  VERIFICATION_SCHEMA_VERSION,
} from './constants.ts';

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const GitCommitSchema = z.string().regex(/^[a-f0-9]{40}$/);

export const RepairedFocusValuesSchema = z
  .object({
    outlineStyle: z.string().min(1),
    outlineWidth: z.string().min(1),
    boxShadow: z.string().min(1),
    visibleIndicatorDetected: z.literal(true),
  })
  .strict();

export const VerificationSchema = z
  .object({
    schemaVersion: z.literal(VERIFICATION_SCHEMA_VERSION),
    baseGitCommit: GitCommitSchema,
    evidenceSha256: z.literal(
      'cc61b701c94fbd6653fa1d8ee8e05e30791761544c4fe0576771532c36a925c2',
    ),
    repairPlanSha256: z.literal(
      '9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a',
    ),
    patchSha256: Sha256Schema,
    replaySpecSha256: Sha256Schema,
    journeyId: z.literal(JOURNEY_ID),
    repairedFindingIds: z
      .tuple([
        z.literal(FINDING_IDS[0]),
        z.literal(FINDING_IDS[1]),
      ])
      .readonly(),
    filesChanged: z
      .tuple([
        z.literal(PHASE1C_CHANGED_FILES[0]),
        z.literal(PHASE1C_CHANGED_FILES[1]),
      ])
      .readonly(),
    buildResult: z.literal('passed'),
    replayResult: z.literal('passed'),
    axeResult: z
      .object({
        violationCount: z.literal(0),
        ruleIds: z.tuple([]),
        emailLabelViolationPresent: z.literal(false),
      })
      .strict(),
    repairedFocusComputedValues: RepairedFocusValuesSchema,
    confirmationReached: z.literal(true),
    originalRepositoryUnchanged: z.literal(true),
    overallVerificationStatus: z.literal('passed'),
  })
  .strict();

export const PatchAuditSchema = z
  .object({
    schemaVersion: z.literal(PATCH_AUDIT_SCHEMA_VERSION),
    timestampUtc: z.string().datetime(),
    patchEngineVersion: z.literal(PATCH_ENGINE_VERSION),
    approvedInputHashes: z
      .object({
        evidenceSha256: Sha256Schema,
        repairPlanSha256: Sha256Schema,
        modelAuditSha256: Sha256Schema,
      })
      .strict(),
    allowedFiles: z
      .tuple([
        z.literal(PHASE1C_CHANGED_FILES[0]),
        z.literal(PHASE1C_CHANGED_FILES[1]),
      ])
      .readonly(),
    safeFixClasses: z
      .tuple([
        z.literal(PHASE1C_SAFE_FIX_CLASSES[0]),
        z.literal(PHASE1C_SAFE_FIX_CLASSES[1]),
      ])
      .readonly(),
    isolatedWorkingCopyStrategy: z.literal(
      ISOLATED_WORKING_COPY_STRATEGY,
    ),
    changedFiles: z
      .tuple([
        z.literal(PHASE1C_CHANGED_FILES[0]),
        z.literal(PHASE1C_CHANGED_FILES[1]),
      ])
      .readonly(),
    policyResult: z.literal('accepted'),
    verificationResult: z.literal('passed'),
    cleanupResult: z.literal('removed'),
  })
  .strict();

export const MutationFocusEvidenceSchema = z
  .object({
    exists: z.literal(true),
    tagName: z.literal('BUTTON'),
    disabled: z.literal(false),
    tabIndex: z.number().int().min(0),
    visible: z.literal(true),
    activeElement: z.literal(true),
    keyboardFocusConfirmed: z.literal(true),
  })
  .strict();

export const MutationDetectionObservationSchema = z
  .object({
    targetMatchCount: z.number().int().nonnegative(),
    ariaHiddenTrueMatchCount: z.number().int().nonnegative(),
    ariaHiddenValue: z.string().nullable(),
    focusEvidence: z
      .object({
        exists: z.boolean(),
        tagName: z.string(),
        disabled: z.boolean(),
        tabIndex: z.number().int(),
        visible: z.boolean(),
        activeElement: z.boolean(),
        keyboardFocusConfirmed: z.boolean(),
      })
      .strict(),
  })
  .strict();

export const MutationGuardResultSchema = z
  .object({
    schemaVersion: z.literal(MUTATION_GUARD_SCHEMA_VERSION),
    mutationId: z.literal(MUTATION_GUARD_ID),
    mutationType: z.literal(MUTATION_GUARD_TYPE),
    sourceFixtureId: z.literal(MUTATION_GUARD_FIXTURE_ID),
    targetRelativePath: z.literal(MUTATION_GUARD_TARGET_PATH),
    targetSelector: z.literal(MUTATION_GUARD_TARGET_SELECTOR),
    mutationDescription: z.string().min(1),
    originalFixtureSha256Before: Sha256Schema,
    disposableCopySha256Before: Sha256Schema,
    disposableCopySha256After: Sha256Schema,
    injectedMutationCount: z.literal(1),
    detectorResult: z.literal('detected'),
    detectedRuleId: z.literal(MUTATION_GUARD_RULE),
    focusEvidence: MutationFocusEvidenceSchema,
    ariaHiddenEvidence: z
      .object({
        attributeName: z.literal('aria-hidden'),
        attributeValue: z.literal('true'),
        matchingElementCount: z.literal(1),
      })
      .strict(),
    mutationDetectionCount: z.literal(1),
    cleanupResult: z.literal('removed'),
    originalFixtureSha256After: Sha256Schema,
    originalFixtureUnchanged: z.literal(true),
    finalStatus: z.literal('passed'),
  })
  .strict()
  .superRefine((result, context) => {
    if (
      result.originalFixtureSha256Before !==
        result.disposableCopySha256Before ||
      result.originalFixtureSha256Before !== result.originalFixtureSha256After
    ) {
      context.addIssue({
        code: 'custom',
        message: 'mutation_fixture_hash_relationship_invalid',
      });
    }
    if (
      result.disposableCopySha256Before === result.disposableCopySha256After
    ) {
      context.addIssue({
        code: 'custom',
        message: 'mutation_disposable_copy_hash_unchanged',
      });
    }
  });

export type Verification = z.infer<typeof VerificationSchema>;
export type PatchAudit = z.infer<typeof PatchAuditSchema>;
export type MutationDetectionObservation = z.infer<
  typeof MutationDetectionObservationSchema
>;
export type MutationGuardResult = z.infer<typeof MutationGuardResultSchema>;
