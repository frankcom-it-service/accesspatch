import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import {
  JourneyEvidenceSchema,
  ModelRunAuditSchema,
  RepairPlanSchema,
  type JourneyEvidence,
  type ModelRunAudit,
  type RepairPlan,
} from '@accesspatch/shared-types';
import { validateRepairPlanPolicy } from '@accesspatch/repair-reasoner';
import {
  PHASE1B_ARTIFACT_PATHS,
  REVIEWED_PHASE1B_HASHES,
} from './constants.ts';

export interface ReviewedArtifactBytes {
  evidence: Buffer;
  repairPlan: Buffer;
  modelAudit: Buffer;
}

export interface ValidatedPhase1Inputs {
  evidence: JourneyEvidence;
  repairPlan: RepairPlan;
  modelAudit: ModelRunAudit;
  hashes: typeof REVIEWED_PHASE1B_HASHES;
}

export function sha256(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

export function assertReviewedArtifactHash(
  key: keyof typeof REVIEWED_PHASE1B_HASHES,
  actualHash: string,
): void {
  if (actualHash !== REVIEWED_PHASE1B_HASHES[key]) {
    throw new Error(`${key}_hash_mismatch`);
  }
}

export function validateReviewedArtifactBytes(
  bytes: ReviewedArtifactBytes,
): ValidatedPhase1Inputs {
  const actualHashes = {
    evidence: sha256(bytes.evidence),
    repairPlan: sha256(bytes.repairPlan),
    modelAudit: sha256(bytes.modelAudit),
  };

  for (const key of Object.keys(REVIEWED_PHASE1B_HASHES) as Array<
    keyof typeof REVIEWED_PHASE1B_HASHES
  >) {
    assertReviewedArtifactHash(key, actualHashes[key]);
  }

  const evidence = JourneyEvidenceSchema.parse(
    JSON.parse(bytes.evidence.toString('utf8')),
  );
  const repairPlan = RepairPlanSchema.parse(
    JSON.parse(bytes.repairPlan.toString('utf8')),
  );
  const modelAudit = ModelRunAuditSchema.parse(
    JSON.parse(bytes.modelAudit.toString('utf8')),
  );
  const policy = validateRepairPlanPolicy(repairPlan);

  if (!policy.accepted) {
    throw new Error(`repair_plan_policy_rejected:${policy.issues.join(',')}`);
  }
  if (
    modelAudit.evidenceSha256 !== REVIEWED_PHASE1B_HASHES.evidence ||
    modelAudit.repairPlanSha256 !== REVIEWED_PHASE1B_HASHES.repairPlan
  ) {
    throw new Error('model_audit_hash_reference_mismatch');
  }
  if (
    modelAudit.responseStatus !== 'completed' ||
    modelAudit.policyValidation !== 'accepted' ||
    modelAudit.failureCategory !== null
  ) {
    throw new Error('model_audit_not_approved');
  }

  return {
    evidence,
    repairPlan,
    modelAudit,
    hashes: REVIEWED_PHASE1B_HASHES,
  };
}

export async function loadValidatedPhase1Inputs(
  repositoryRoot: string,
): Promise<ValidatedPhase1Inputs> {
  const [evidence, repairPlan, modelAudit] = await Promise.all([
    readFile(`${repositoryRoot}/${PHASE1B_ARTIFACT_PATHS.evidence}`),
    readFile(`${repositoryRoot}/${PHASE1B_ARTIFACT_PATHS.repairPlan}`),
    readFile(`${repositoryRoot}/${PHASE1B_ARTIFACT_PATHS.modelAudit}`),
  ]);

  return validateReviewedArtifactBytes({ evidence, repairPlan, modelAudit });
}
