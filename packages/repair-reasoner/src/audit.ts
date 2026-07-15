import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import {
  AUDIT_SCHEMA_VERSION,
  ModelRunAuditSchema,
  PROMPT_VERSION,
  type AuditUsage,
  type FailureCategory,
  type ModelRunAudit,
} from '@accesspatch/shared-types';

export function sha256(content: string | Uint8Array): string {
  return createHash('sha256').update(content).digest('hex');
}

type AuditInput = {
  modelId: string;
  evidenceSha256: string;
  repairPlanSha256: string | null;
  responseStatus: ModelRunAudit['responseStatus'];
  usage: AuditUsage | null;
  policyValidation: ModelRunAudit['policyValidation'];
  failureCategory: FailureCategory | null;
};

export function createSanitizedAudit(input: AuditInput): ModelRunAudit {
  return ModelRunAuditSchema.parse({
    schemaVersion: AUDIT_SCHEMA_VERSION,
    timestampUtc: new Date().toISOString(),
    modelId: input.modelId,
    promptVersion: PROMPT_VERSION,
    evidenceSha256: input.evidenceSha256,
    repairPlanSha256: input.repairPlanSha256,
    store: false,
    responseStatus: input.responseStatus,
    usage: input.usage,
    policyValidation: input.policyValidation,
    failureCategory: input.failureCategory,
  });
}

export async function writeSanitizedAudit(
  audit: ModelRunAudit,
  outputPath: string,
): Promise<void> {
  const validatedAudit = ModelRunAuditSchema.parse(audit);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(validatedAudit, null, 2)}\n`, 'utf8');
}
