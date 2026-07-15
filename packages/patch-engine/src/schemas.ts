import { z } from 'zod';
import {
  FINDING_IDS,
  JOURNEY_ID,
} from '@accesspatch/shared-types';
import {
  PATCH_AUDIT_SCHEMA_VERSION,
  PATCH_ENGINE_VERSION,
  ISOLATED_WORKING_COPY_STRATEGY,
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

export type Verification = z.infer<typeof VerificationSchema>;
export type PatchAudit = z.infer<typeof PatchAuditSchema>;
