import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import {
  JourneyEvidenceSchema,
  MODEL_ID,
  RepairPlanSchema,
  type AuditUsage,
  type FailureCategory,
  type ModelRunAudit,
  type RepairPlan,
} from '@accesspatch/shared-types';
import { createSanitizedAudit, sha256, writeSanitizedAudit } from './audit.ts';
import { validateRepairPlanPolicy } from './policy.ts';
import { buildRepairPrompt } from './prompt.ts';

export const PHASE1_REPAIR_PLAN_PATH =
  '.accesspatch/runs/phase1/repair-plan.json';
export const PHASE1_MODEL_AUDIT_PATH = '.accesspatch/runs/phase1/model-audit.json';

export class ReasonerFailure extends Error {
  readonly category: FailureCategory;

  constructor(category: FailureCategory, message: string) {
    super(message);
    this.name = 'ReasonerFailure';
    this.category = category;
  }
}

export function requireApiKey(
  environment: Record<string, string | undefined>,
): string {
  const apiKey = environment.OPENAI_API_KEY;
  if (!apiKey) {
    throw new ReasonerFailure(
      'missing_api_key',
      'OPENAI_API_KEY is required. Provide it in the command environment; AccessPatch does not search for credentials.',
    );
  }
  return apiKey;
}

type RunReasonerOptions = {
  evidencePath: string;
  repairPlanPath: string;
  auditPath: string;
  environment?: Record<string, string | undefined>;
  modelRequester?: ModelRequester;
};

type RunReasonerResult = {
  plan: RepairPlan;
  audit: ModelRunAudit;
};

type ReasonerResponse = {
  model: string;
  status?: ModelRunAudit['responseStatus'];
  usage?:
    | {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
        output_tokens_details: { reasoning_tokens: number };
      }
    | null
    | undefined;
  output: Array<{
    type: string;
    content?: Array<{ type: string }>;
  }>;
  output_parsed: unknown;
};

type ModelRequester = (input: {
  apiKey: string;
  instructions: string;
  promptInput: string;
}) => Promise<ReasonerResponse>;

async function requestRepairPlan(input: {
  apiKey: string;
  instructions: string;
  promptInput: string;
}): Promise<ReasonerResponse> {
  const client = new OpenAI({
    apiKey: input.apiKey,
    maxRetries: 0,
    timeout: 120_000,
  });
  return client.responses.parse({
    model: MODEL_ID,
    reasoning: { effort: 'low' },
    instructions: input.instructions,
    input: input.promptInput,
    text: {
      format: zodTextFormat(RepairPlanSchema, 'accesspatch_repair_plan'),
    },
    max_output_tokens: 2500,
    store: false,
  });
}

function usageFromResponse(
  usage:
    | {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
        output_tokens_details: { reasoning_tokens: number };
      }
    | null
    | undefined,
): AuditUsage | null {
  if (!usage) {
    return null;
  }
  return {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    reasoningTokens: usage.output_tokens_details.reasoning_tokens,
    totalTokens: usage.total_tokens,
  };
}

async function recordFailure(
  options: RunReasonerOptions,
  evidenceSha256: string,
  category: FailureCategory,
  details?: {
    modelId?: string;
    responseStatus?: ModelRunAudit['responseStatus'];
    usage?: AuditUsage | null;
    policyValidation?: ModelRunAudit['policyValidation'];
  },
): Promise<void> {
  const audit = createSanitizedAudit({
    modelId: details?.modelId ?? MODEL_ID,
    evidenceSha256,
    repairPlanSha256: null,
    responseStatus: details?.responseStatus ?? 'not_started',
    usage: details?.usage ?? null,
    policyValidation: details?.policyValidation ?? 'not_run',
    failureCategory: category,
  });
  await writeSanitizedAudit(audit, options.auditPath);
}

export async function runReasoner(
  options: RunReasonerOptions,
): Promise<RunReasonerResult> {
  await rm(options.repairPlanPath, { force: true });

  let evidenceText: string;
  try {
    evidenceText = await readFile(options.evidencePath, 'utf8');
  } catch {
    const emptyHash = sha256('');
    await recordFailure(options, emptyHash, 'evidence_invalid');
    throw new ReasonerFailure(
      'evidence_invalid',
      'Normalized evidence is missing or unreadable.',
    );
  }

  const evidenceSha256 = sha256(evidenceText);
  let evidence: ReturnType<typeof JourneyEvidenceSchema.parse>;
  try {
    evidence = JourneyEvidenceSchema.parse(JSON.parse(evidenceText));
  } catch {
    await recordFailure(options, evidenceSha256, 'evidence_invalid');
    throw new ReasonerFailure(
      'evidence_invalid',
      'Normalized evidence failed schema validation.',
    );
  }

  let apiKey: string;
  try {
    apiKey = requireApiKey(options.environment ?? process.env);
  } catch (error) {
    await recordFailure(options, evidenceSha256, 'missing_api_key');
    throw error;
  }

  const prompt = buildRepairPrompt(evidence);

  let response: ReasonerResponse;
  try {
    response = await (options.modelRequester ?? requestRepairPlan)({
      apiKey,
      instructions: prompt.instructions,
      promptInput: prompt.input,
    });
  } catch {
    await recordFailure(options, evidenceSha256, 'api_error', {
      responseStatus: 'error',
    });
    throw new ReasonerFailure('api_error', 'The Responses API request failed.');
  }

  const usage = usageFromResponse(response.usage);
  const responseStatus = response.status ?? 'error';

  if (responseStatus !== 'completed') {
    await recordFailure(options, evidenceSha256, 'response_incomplete', {
      modelId: response.model,
      responseStatus,
      usage,
    });
    throw new ReasonerFailure(
      'response_incomplete',
      'The model response did not complete.',
    );
  }

  if (response.model !== MODEL_ID) {
    await recordFailure(options, evidenceSha256, 'unexpected_model', {
      modelId: response.model,
      responseStatus,
      usage,
    });
    throw new ReasonerFailure(
      'unexpected_model',
      'The returned model identifier did not match the requested model.',
    );
  }

  const hasRefusal = response.output.some(
    (item) =>
      item.type === 'message' &&
      item.content?.some((content) => content.type === 'refusal'),
  );

  if (!response.output_parsed) {
    const category: FailureCategory = hasRefusal ? 'model_refusal' : 'schema_invalid';
    await recordFailure(options, evidenceSha256, category, {
      modelId: response.model,
      responseStatus,
      usage,
    });
    throw new ReasonerFailure(category, 'No schema-validated repair plan was returned.');
  }

  const policyResult = validateRepairPlanPolicy(response.output_parsed);
  if (!policyResult.accepted) {
    await recordFailure(options, evidenceSha256, 'policy_rejected', {
      modelId: response.model,
      responseStatus,
      usage,
      policyValidation: 'rejected',
    });
    throw new ReasonerFailure(
      'policy_rejected',
      'The parsed repair plan failed deterministic safety validation.',
    );
  }

  const planText = `${JSON.stringify(policyResult.plan, null, 2)}\n`;
  const repairPlanSha256 = sha256(planText);
  const audit = createSanitizedAudit({
    modelId: response.model,
    evidenceSha256,
    repairPlanSha256,
    responseStatus,
    usage,
    policyValidation: 'accepted',
    failureCategory: null,
  });

  await mkdir(dirname(options.repairPlanPath), { recursive: true });
  await writeFile(options.repairPlanPath, planText, 'utf8');
  await writeSanitizedAudit(audit, options.auditPath);

  return { plan: policyResult.plan, audit };
}
