import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  createSanitizedAudit,
  requireApiKey,
  ReasonerFailure,
  runReasoner,
  sha256,
} from '../../packages/repair-reasoner/src/index.ts';
import { validEvidence, validRepairPlan } from './fixtures.ts';

test('missing API key fails without searching or fabricating a plan', () => {
  assert.throws(
    () => requireApiKey({}),
    (error: unknown) =>
      error instanceof ReasonerFailure && error.category === 'missing_api_key',
  );
});

test('missing API key removes stale plan and records only sanitized failure', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'accesspatch-reasoner-'));
  const evidencePath = join(directory, 'evidence.json');
  const repairPlanPath = join(directory, 'repair-plan.json');
  const auditPath = join(directory, 'model-audit.json');

  try {
    await writeFile(evidencePath, JSON.stringify(validEvidence()), 'utf8');
    await writeFile(repairPlanPath, 'stale approved plan', 'utf8');

    await assert.rejects(
      runReasoner({
        evidencePath,
        repairPlanPath,
        auditPath,
        environment: {},
      }),
      (error: unknown) =>
        error instanceof ReasonerFailure && error.category === 'missing_api_key',
    );

    await assert.rejects(readFile(repairPlanPath, 'utf8'), { code: 'ENOENT' });
    const audit = JSON.parse(await readFile(auditPath, 'utf8')) as Record<
      string,
      unknown
    >;
    assert.equal(audit.failureCategory, 'missing_api_key');
    assert.equal(audit.repairPlanSha256, null);
    assert.equal(JSON.stringify(audit).includes('stale approved plan'), false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('unexpected returned model removes stale plan and records sanitized failure', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'accesspatch-model-'));
  const evidencePath = join(directory, 'evidence.json');
  const repairPlanPath = join(directory, 'repair-plan.json');
  const auditPath = join(directory, 'model-audit.json');

  try {
    await writeFile(evidencePath, JSON.stringify(validEvidence()), 'utf8');
    await writeFile(repairPlanPath, 'stale approved plan', 'utf8');

    await assert.rejects(
      runReasoner({
        evidencePath,
        repairPlanPath,
        auditPath,
        environment: { OPENAI_API_KEY: 'unit-test-placeholder' },
        modelRequester: async () => ({
          model: 'gpt-5.6',
          status: 'completed',
          usage: {
            input_tokens: 10,
            output_tokens: 20,
            total_tokens: 30,
            output_tokens_details: { reasoning_tokens: 0 },
          },
          output: [],
          output_parsed: validRepairPlan(),
        }),
      }),
      (error: unknown) =>
        error instanceof ReasonerFailure && error.category === 'unexpected_model',
    );

    await assert.rejects(readFile(repairPlanPath, 'utf8'), { code: 'ENOENT' });
    const audit = JSON.parse(await readFile(auditPath, 'utf8')) as Record<
      string,
      unknown
    >;
    assert.equal(audit.failureCategory, 'unexpected_model');
    assert.equal(audit.modelId, 'gpt-5.6');
    assert.equal(audit.repairPlanSha256, null);
    assert.equal(audit.policyValidation, 'not_run');
    assert.equal(JSON.stringify(audit).includes('stale approved plan'), false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('sanitized audit contains no credential, prompt, or raw response field', () => {
  const audit = createSanitizedAudit({
    modelId: 'gpt-5.6-sol',
    evidenceSha256: sha256('evidence'),
    repairPlanSha256: sha256('plan'),
    responseStatus: 'completed',
    usage: {
      inputTokens: 10,
      outputTokens: 20,
      reasoningTokens: 2,
      totalTokens: 30,
    },
    policyValidation: 'accepted',
    failureCategory: null,
  });
  const serialized = JSON.stringify(audit);

  assert.equal(serialized.includes('apiKey'), false);
  assert.equal(serialized.includes('"prompt":'), false);
  assert.equal(serialized.includes('rawResponse'), false);
  assert.deepEqual(Object.keys(audit).sort(), [
    'evidenceSha256',
    'failureCategory',
    'modelId',
    'policyValidation',
    'promptVersion',
    'repairPlanSha256',
    'responseStatus',
    'schemaVersion',
    'store',
    'timestampUtc',
    'usage',
  ]);
});
