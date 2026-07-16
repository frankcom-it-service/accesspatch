import assert from 'node:assert/strict';
import { lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, test } from 'node:test';
import {
  MANIFEST_HASHED_ENTRIES,
  PROOF_BUNDLE_OUTPUT_DIRECTORY,
  REQUIRED_TEST_RESULT_ENTRIES,
  REQUIRED_TOP_LEVEL_ENTRIES,
  REVIEWED_SOURCE_HASHES,
  SOURCE_ARTIFACT_PATHS,
  createAuditLog,
  createFindings,
  createReportHtml,
  createWcagMap,
  generateProofBundle,
  scanGeneratedText,
  serializeJson,
  sha256,
  validateProofBundle,
  validateReportHtml,
  validateWcagCsv,
  validateReviewedSourceBytes,
  type ReviewedBundleSources,
  type ReviewedSourceBytes,
} from '../../packages/proof-bundle/src/index.ts';
import {
  ProofFindingsSchema,
  WCAG_MAPPING_DEFINITIONS,
  type ProofFindings,
} from '../../packages/shared-types/src/index.ts';

const repositoryRoot = process.cwd();
const trackedBundle = join(repositoryRoot, 'examples/judge-sample/proof-bundle');
const generatedAtUtc = '2026-07-15T18:00:00.000Z';
const repositoryHead = 'e5fd8646b04d1e3a8153799389597d1e69b90391';
const temporaryRoots: string[] = [];

async function createTemporaryRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-proof-test-'));
  temporaryRoots.push(root);
  return root;
}

async function readTrackedReviewedBytes(): Promise<ReviewedSourceBytes> {
  const proofFindings = ProofFindingsSchema.parse(
    JSON.parse(await readFile(join(trackedBundle, 'findings.json'), 'utf8')),
  );
  const findings = proofFindings.findings.map((proofFinding) => {
    const {
      repairStatus: _repairStatus,
      verificationArtifact: _verificationArtifact,
      wcagMappings: _wcagMappings,
      ...finding
    } = proofFinding;
    return finding;
  });
  const evidence = Buffer.from(
    serializeJson({
      schemaVersion: '1.0.0',
      capturedAtUtc: '2026-07-15T15:04:08.957Z',
      journey: {
        journeyId: 'demo-checkout-keyboard-v1',
        name: 'Controlled demo checkout keyboard journey',
        steps: [
          'Open the product screen.',
          'Focus and activate Add product to cart with the keyboard.',
          'Focus and activate Open checkout with the keyboard.',
          'Enter shipping and contact sample data with the keyboard.',
          'Inspect the focused primary action and checkout accessibility state.',
          'Activate Continue to confirmation with the keyboard.',
        ],
        confirmationReached: true,
      },
      sourceContextPolicy: {
        allowedFiles: [
          'apps/demo-checkout/src/App.tsx',
          'apps/demo-checkout/src/styles.css',
        ],
        maximumCharactersPerFinding: 1200,
        completeFilesIncluded: false,
      },
      axeSummary: {
        violationCount: 1,
        ruleIds: ['label'],
        targets: ['#email'],
      },
      findings,
    }),
  );
  assert.equal(sha256(evidence), REVIEWED_SOURCE_HASHES.evidence);

  return {
    evidence,
    repairPlan: await readFile(join(trackedBundle, 'repair-plan.json')),
    modelAudit: await readFile(join(trackedBundle, 'test-results/model-audit.json')),
    patch: await readFile(join(trackedBundle, 'patch.diff')),
    replay: await readFile(join(trackedBundle, 'replay.spec.ts')),
    verification: await readFile(join(trackedBundle, 'test-results/verification.json')),
    patchAudit: await readFile(join(trackedBundle, 'test-results/patch-audit.json')),
    manualReview: await readFile(join(trackedBundle, 'manual-review.md')),
  };
}

async function loadTrackedReviewedSources(): Promise<ReviewedBundleSources> {
  return validateReviewedSourceBytes(await readTrackedReviewedBytes());
}

async function copyReviewedSources(root: string): Promise<void> {
  const bytes = await readTrackedReviewedBytes();
  for (const key of Object.keys(SOURCE_ARTIFACT_PATHS) as Array<
    keyof typeof SOURCE_ARTIFACT_PATHS
  >) {
    const destination = join(root, SOURCE_ARTIFACT_PATHS[key]);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, bytes[key]);
  }
}

async function createSourceFixture(): Promise<string> {
  const root = await createTemporaryRoot();
  await copyReviewedSources(root);
  return root;
}

async function generateFixture(): Promise<{ root: string; bundle: string }> {
  const root = await createSourceFixture();
  await generateProofBundle(root, {
    generatedAtUtc,
    repositoryHeadAtGeneration: repositoryHead,
  });
  return { root, bundle: join(root, PROOF_BUNDLE_OUTPUT_DIRECTORY) };
}

async function readReviewedBytes(): Promise<ReviewedSourceBytes> {
  return readTrackedReviewedBytes();
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test('generates and validates the canonical bundle', async () => {
  const { bundle } = await generateFixture();
  const result = await validateProofBundle(bundle);
  assert.equal(result.summary.beforeStateFindingCount, 2);
  assert.equal(result.summary.repairedFindingCount, 2);
  assert.deepEqual((await readdir(bundle)).sort(), [...REQUIRED_TOP_LEVEL_ENTRIES].sort());
});

test('rejects a missing reviewed source artifact', async () => {
  const root = await createSourceFixture();
  await unlink(join(root, SOURCE_ARTIFACT_PATHS.evidence));
  await assert.rejects(
    generateProofBundle(root, { generatedAtUtc, repositoryHeadAtGeneration: repositoryHead }),
    /ENOENT/,
  );
});

test('rejects a wrong reviewed source hash', async () => {
  const root = await createSourceFixture();
  await writeFile(join(root, SOURCE_ARTIFACT_PATHS.patch), 'changed');
  await assert.rejects(
    generateProofBundle(root, { generatedAtUtc, repositoryHeadAtGeneration: repositoryHead }),
    /reviewed_source_hash_mismatch:patch/,
  );
});

test('rejects an invalid source schema after hash validation', async () => {
  const bytes = await readReviewedBytes();
  const evidence = JSON.parse(bytes.evidence.toString('utf8')) as { findings: unknown[] };
  evidence.findings = [];
  const invalidEvidence = Buffer.from(serializeJson(evidence));
  const modified = { ...bytes, evidence: invalidEvidence };
  const expected = { ...REVIEWED_SOURCE_HASHES, evidence: sha256(invalidEvidence) };
  assert.throws(() => validateReviewedSourceBytes(modified, expected), { name: 'ZodError' });
});

test('enforces the exact top-level inventory', async () => {
  const { bundle } = await generateFixture();
  await unlink(join(bundle, 'summary.json'));
  await assert.rejects(validateProofBundle(bundle), /top_level_inventory_mismatch/);
});

test('rejects an unexpected top-level file', async () => {
  const { bundle } = await generateFixture();
  await writeFile(join(bundle, 'unexpected.txt'), 'unexpected');
  await assert.rejects(validateProofBundle(bundle), /top_level_inventory_mismatch/);
});

test('rejects an unsafe output path', async () => {
  const root = await createSourceFixture();
  await assert.rejects(
    generateProofBundle(root, {
      generatedAtUtc,
      repositoryHeadAtGeneration: repositoryHead,
      outputRelativePath: '../escape',
    }),
    /unsafe_bundle_path/,
  );
});

test('rejects a reviewed source symlink without following it', async (context) => {
  const root = await createSourceFixture();
  const path = join(root, SOURCE_ARTIFACT_PATHS.patch);
  await unlink(path);
  try {
    await symlink(join(trackedBundle, 'patch.diff'), path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EPERM') {
      context.skip('symlink creation is unavailable');
      return;
    }
    throw error;
  }
  await assert.rejects(
    generateProofBundle(root, { generatedAtUtc, repositoryHeadAtGeneration: repositoryHead }),
    /reviewed_source_not_regular_file/,
  );
});

test('keeps deterministic finding, CSV, and manifest ordering', async () => {
  const { bundle } = await generateFixture();
  const findings = ProofFindingsSchema.parse(
    JSON.parse(await readFile(join(bundle, 'findings.json'), 'utf8')),
  );
  const csv = await readFile(join(bundle, 'wcag-map.csv'), 'utf8');
  const summary = JSON.parse(await readFile(join(bundle, 'summary.json'), 'utf8')) as { generatedEntrySha256: Record<string, string> };
  assert.deepEqual(findings.findings.map((finding) => finding.findingId), [
    'CONTROLLED_BARRIER_EMAIL_NAME',
    'CONTROLLED_BARRIER_FOCUS_VISIBLE',
  ]);
  const csvRows = validateWcagCsv(csv, findings);
  assert.deepEqual(csvRows.slice(1).map((row) => [row[0], row[5]]), [
    ['CONTROLLED_BARRIER_EMAIL_NAME', '1.3.1'],
    ['CONTROLLED_BARRIER_EMAIL_NAME', '4.1.2'],
    ['CONTROLLED_BARRIER_FOCUS_VISIBLE', '2.4.7'],
  ]);
  assert.deepEqual(Object.keys(summary.generatedEntrySha256), [...MANIFEST_HASHED_ENTRIES]);
});

test('copies the patch byte for byte', async () => {
  const { bundle } = await generateFixture();
  assert.deepEqual(
    await readFile(join(bundle, 'patch.diff')),
    await readFile(join(trackedBundle, 'patch.diff')),
  );
});

test('copies the replay byte for byte', async () => {
  const { bundle } = await generateFixture();
  assert.deepEqual(
    await readFile(join(bundle, 'replay.spec.ts')),
    await readFile(join(trackedBundle, 'replay.spec.ts')),
  );
});

test('escapes commas and quotes in CSV cells', async () => {
  const sources = await loadTrackedReviewedSources();
  const changed = {
    ...sources,
    evidence: {
      ...sources.evidence,
      findings: [
        { ...sources.evidence.findings[0], observedCondition: 'A, "quoted" condition' },
        sources.evidence.findings[1],
      ],
    },
  } as unknown as ReviewedBundleSources;
  const findings = ProofFindingsSchema.parse(createFindings(changed));
  const csv = createWcagMap(findings);
  assert.match(csv, /"A, ""quoted"" condition"/);
  assert.doesNotThrow(() => validateWcagCsv(csv, findings));
});

async function createWcagFixture(): Promise<{
  findings: ProofFindings;
  csv: string;
  html: string;
}> {
  const sources = await loadTrackedReviewedSources();
  const findings = ProofFindingsSchema.parse(createFindings(sources));
  return {
    findings,
    csv: createWcagMap(findings),
    html: createReportHtml(sources, findings),
  };
}

test('accepts exactly the three source-backed WCAG mappings', async () => {
  const { findings, csv } = await createWcagFixture();
  const rows = validateWcagCsv(csv, findings);
  assert.equal(rows.length, 4);
  assert.deepEqual(
    findings.findings.flatMap((finding) =>
      finding.wcagMappings.map((mapping) => [finding.findingId, mapping.wcagReference]),
    ),
    WCAG_MAPPING_DEFINITIONS.map((mapping) => [
      mapping.findingId,
      mapping.wcagReference,
    ]),
  );
});

test('rejects a missing WCAG mapping row', async () => {
  const { findings, csv } = await createWcagFixture();
  const rows = csv.trimEnd().split('\n');
  rows.splice(2, 1);
  assert.throws(() => validateWcagCsv(`${rows.join('\n')}\n`, findings), /wcag_csv_structure_invalid/);
});

test('rejects a duplicate WCAG mapping row', async () => {
  const { findings, csv } = await createWcagFixture();
  const rows = csv.trimEnd().split('\n');
  rows.push(rows[1]);
  assert.throws(() => validateWcagCsv(`${rows.join('\n')}\n`, findings), /wcag_csv_structure_invalid/);
});

test('rejects an unsupported WCAG criterion', async () => {
  const { findings, csv } = await createWcagFixture();
  assert.throws(
    () => validateWcagCsv(csv.replace(',1.3.1,Info and Relationships,', ',9.9.9,Info and Relationships,'), findings),
    /wcag_csv_mapping_mismatch/,
  );
});

test('rejects a wrong finding-to-criterion relationship', async () => {
  const { findings, csv } = await createWcagFixture();
  assert.throws(
    () => validateWcagCsv(csv.replace('\nCONTROLLED_BARRIER_EMAIL_NAME,', '\nCONTROLLED_BARRIER_FOCUS_VISIBLE,'), findings),
    /wcag_csv_mapping_mismatch/,
  );
});

test('rejects a wrong WCAG criterion label', async () => {
  const { findings, csv } = await createWcagFixture();
  assert.throws(
    () => validateWcagCsv(csv.replace('Info and Relationships', 'Incorrect Label'), findings),
    /wcag_csv_mapping_mismatch/,
  );
});

test('rejects a wrong WCAG conformance level', async () => {
  const { findings, csv } = await createWcagFixture();
  assert.throws(
    () => validateWcagCsv(csv.replace(',2.4.7,Focus Visible,AA,', ',2.4.7,Focus Visible,A,'), findings),
    /wcag_csv_mapping_mismatch/,
  );
});

test('rejects an altered WCAG source URL', async () => {
  const { findings, csv } = await createWcagFixture();
  assert.throws(
    () => validateWcagCsv(csv.replace('https://www.w3.org/TR/WCAG22/#focus-visible', 'https://example.com/focus-visible'), findings),
    /wcag_csv_mapping_mismatch/,
  );
});

test('rejects reintroduced UNMAPPED output', async () => {
  const { findings, csv } = await createWcagFixture();
  assert.throws(
    () => validateWcagCsv(csv.replace(',1.3.1,', ',UNMAPPED,'), findings),
    /wcag_csv_unmapped_rejected/,
  );
});

test('rejects findings and CSV mapping disagreement', async () => {
  const { findings, csv } = await createWcagFixture();
  const changed = structuredClone(findings);
  changed.findings[0].wcagMappings.reverse();
  assert.throws(() => validateWcagCsv(csv, changed));
});

test('rejects a report missing a controlled WCAG mapping', async () => {
  const { findings, html } = await createWcagFixture();
  assert.throws(
    () => validateReportHtml(html.replace('data-wcag-reference="2.4.7"', 'data-wcag-reference="missing"'), findings),
    /wcag_mapping_inventory/,
  );
});

test('rejects report language claiming full WCAG conformance', async () => {
  const { findings, html } = await createWcagFixture();
  assert.throws(
    () => validateReportHtml(`${html}<p>This report establishes full WCAG conformance.</p>`, findings),
    /unsupported_conformance_claim/,
  );
});

test('rejects a missing manual-review disclaimer', async () => {
  const { bundle } = await generateFixture();
  await writeFile(join(bundle, 'manual-review.md'), '# Review\n');
  await assert.rejects(validateProofBundle(bundle), /manual_review_disclaimer_missing/);
});

test('rejects a forbidden compliance claim', () => {
  assert.throws(
    () => scanGeneratedText('report.html', 'This report is WCAG compliant.'),
    /unsupported_compliance_claim/,
  );
});

test('rejects a credential leak', () => {
  const keyShapedValue = ['sk', 'examplecredentialvalue123456789'].join('-');
  assert.throws(
    () => scanGeneratedText('audit-log.json', keyShapedValue),
    /credential/,
  );
});

test('rejects an absolute local path leak', () => {
  assert.throws(
    () => scanGeneratedText('audit-log.json', '/home/example/private/file'),
    /absolute_local_path/,
  );
});

test('creates a sanitized seven-entry audit log', async () => {
  const sources = await loadTrackedReviewedSources();
  const audit = createAuditLog(sources, generatedAtUtc, { 'findings.json': 'a'.repeat(64) });
  const serialized = serializeJson(audit);
  assert.equal(audit.entries.length, 7);
  assert.doesNotMatch(serialized, /rawPrompt|rawResponse|OPENAI_API_KEY|\/home\//);
});

test('cleans temporary output after failed generation', async () => {
  const root = await createSourceFixture();
  await unlink(join(root, SOURCE_ARTIFACT_PATHS.manualReview));
  await assert.rejects(
    generateProofBundle(root, { generatedAtUtc, repositoryHeadAtGeneration: repositoryHead }),
  );
  const parent = join(root, '.accesspatch/runs/phase2');
  const entries = await readdir(parent).catch(() => []);
  assert.equal(entries.some((entry) => entry.includes('.proof-bundle.tmp-')), false);
});

test('preserves the previous final directory when regeneration fails', async () => {
  const { root, bundle } = await generateFixture();
  const originalSummary = await readFile(join(bundle, 'summary.json'));
  await writeFile(join(root, SOURCE_ARTIFACT_PATHS.evidence), 'invalid');
  await assert.rejects(
    generateProofBundle(root, { generatedAtUtc, repositoryHeadAtGeneration: repositoryHead }),
  );
  assert.deepEqual(await readFile(join(bundle, 'summary.json')), originalSummary);
});

test('report HTML contains structural and accessibility smoke requirements', async () => {
  const sources = await loadTrackedReviewedSources();
  const findings = ProofFindingsSchema.parse(createFindings(sources));
  const html = createReportHtml(sources, findings);
  assert.doesNotThrow(() => validateReportHtml(html, findings));
  assert.match(html, /<html lang="en">/);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /:focus-visible/);
  assert.doesNotMatch(html, /<script\b|<img\b|<link\b/i);
  assert.equal((html.match(/data-external="true"/g) ?? []).length, 6);
});

test('manifest hashes every generated file except summary itself', async () => {
  const { bundle } = await generateFixture();
  const summary = JSON.parse(await readFile(join(bundle, 'summary.json'), 'utf8')) as { generatedEntrySha256: Record<string, string> };
  assert.equal(summary.generatedEntrySha256['summary.json'], undefined);
  assert.equal(Object.keys(summary.generatedEntrySha256).length, MANIFEST_HASHED_ENTRIES.length);
  for (const path of MANIFEST_HASHED_ENTRIES) {
    assert.equal(summary.generatedEntrySha256[path], sha256(await readFile(join(bundle, path))));
  }
});

test('test-results inventory contains exactly the five required files', async () => {
  const { bundle } = await generateFixture();
  assert.deepEqual(
    (await readdir(join(bundle, 'test-results'))).sort(),
    [...REQUIRED_TEST_RESULT_ENTRIES].sort(),
  );
  assert.equal((await lstat(join(bundle, 'test-results'))).isDirectory(), true);
});
