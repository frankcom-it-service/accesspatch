import { lstat, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  JourneyEvidenceSchema,
  ModelRunAuditSchema,
  RepairPlanSchema,
  type JourneyEvidence,
  type ModelRunAudit,
  type RepairPlan,
} from '@accesspatch/shared-types';
import {
  PatchAuditSchema,
  VerificationSchema,
  validateGeneratedPatch,
  type PatchAudit,
  type Verification,
} from '@accesspatch/patch-engine';
import { validateRepairPlanPolicy } from '@accesspatch/repair-reasoner';
import {
  REVIEWED_SOURCE_HASHES,
  SOURCE_ARTIFACT_PATHS,
} from './constants.ts';
import { sha256 } from './hash.ts';

export interface ReviewedSourceBytes {
  evidence: Buffer;
  repairPlan: Buffer;
  modelAudit: Buffer;
  patch: Buffer;
  replay: Buffer;
  verification: Buffer;
  patchAudit: Buffer;
  manualReview: Buffer;
}

export interface ReviewedBundleSources {
  bytes: ReviewedSourceBytes;
  evidence: JourneyEvidence;
  repairPlan: RepairPlan;
  modelAudit: ModelRunAudit;
  verification: Verification;
  patchAudit: PatchAudit;
  hashes: typeof REVIEWED_SOURCE_HASHES;
}

export function validateReviewedSourceBytes(
  bytes: ReviewedSourceBytes,
  expectedHashes: Record<keyof ReviewedSourceBytes, string> = REVIEWED_SOURCE_HASHES,
): ReviewedBundleSources {
  for (const key of Object.keys(expectedHashes) as Array<
    keyof ReviewedSourceBytes
  >) {
    if (sha256(bytes[key]) !== expectedHashes[key]) {
      throw new Error(`reviewed_source_hash_mismatch:${key}`);
    }
  }

  const evidence = JourneyEvidenceSchema.parse(JSON.parse(bytes.evidence.toString('utf8')));
  const repairPlan = RepairPlanSchema.parse(
    JSON.parse(bytes.repairPlan.toString('utf8')),
  );
  const modelAudit = ModelRunAuditSchema.parse(
    JSON.parse(bytes.modelAudit.toString('utf8')),
  );
  const verification = VerificationSchema.parse(
    JSON.parse(bytes.verification.toString('utf8')),
  );
  const patchAudit = PatchAuditSchema.parse(
    JSON.parse(bytes.patchAudit.toString('utf8')),
  );

  const planPolicy = validateRepairPlanPolicy(repairPlan);
  if (!planPolicy.accepted) {
    throw new Error(`repair_plan_policy_rejected:${planPolicy.issues.join(',')}`);
  }
  validateGeneratedPatch(bytes.patch.toString('utf8'));

  if (
    modelAudit.evidenceSha256 !== REVIEWED_SOURCE_HASHES.evidence ||
    modelAudit.repairPlanSha256 !== REVIEWED_SOURCE_HASHES.repairPlan ||
    verification.evidenceSha256 !== REVIEWED_SOURCE_HASHES.evidence ||
    verification.repairPlanSha256 !== REVIEWED_SOURCE_HASHES.repairPlan ||
    verification.patchSha256 !== REVIEWED_SOURCE_HASHES.patch ||
    verification.replaySpecSha256 !== REVIEWED_SOURCE_HASHES.replay ||
    patchAudit.approvedInputHashes.evidenceSha256 !== REVIEWED_SOURCE_HASHES.evidence ||
    patchAudit.approvedInputHashes.repairPlanSha256 !== REVIEWED_SOURCE_HASHES.repairPlan ||
    patchAudit.approvedInputHashes.modelAuditSha256 !== REVIEWED_SOURCE_HASHES.modelAudit
  ) {
    throw new Error('reviewed_source_reference_mismatch');
  }

  return {
    bytes,
    evidence,
    repairPlan,
    modelAudit,
    verification,
    patchAudit,
    hashes: REVIEWED_SOURCE_HASHES,
  };
}

export async function loadReviewedBundleSources(
  repositoryRoot: string,
): Promise<ReviewedBundleSources> {
  const entries = await Promise.all(
    (Object.keys(SOURCE_ARTIFACT_PATHS) as Array<keyof typeof SOURCE_ARTIFACT_PATHS>).map(
      async (key) => {
        const path = resolve(repositoryRoot, SOURCE_ARTIFACT_PATHS[key]);
        const stats = await lstat(path);
        if (stats.isSymbolicLink() || !stats.isFile()) {
          throw new Error(`reviewed_source_not_regular_file:${SOURCE_ARTIFACT_PATHS[key]}`);
        }
        return [key, await readFile(path)] as const;
      },
    ),
  );
  return validateReviewedSourceBytes(
    Object.fromEntries(entries) as unknown as ReviewedSourceBytes,
  );
}
