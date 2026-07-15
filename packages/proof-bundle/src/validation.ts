import { lstat, readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import {
  AfterReplayResultSchema,
  AuditLogSchema,
  BeforeBaselineResultSchema,
  JourneyMapSchema,
  ModelRunAuditSchema,
  ProofFindingsSchema,
  ProofSummarySchema,
  RepairPlanSchema,
} from '@accesspatch/shared-types';
import {
  PatchAuditSchema,
  VerificationSchema,
  validateGeneratedPatch,
} from '@accesspatch/patch-engine';
import { validateRepairPlanPolicy } from '@accesspatch/repair-reasoner';
import {
  MANIFEST_HASHED_ENTRIES,
  REQUIRED_TEST_RESULT_ENTRIES,
  REQUIRED_TOP_LEVEL_ENTRIES,
  REVIEWED_SOURCE_HASHES,
} from './constants.ts';
import { sha256 } from './hash.ts';
import { validateReportHtml } from './report-validation.ts';
import { scanGeneratedText } from './security.ts';

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

function assertExactNames(actual: readonly string[], expected: readonly string[], label: string): void {
  if (JSON.stringify(sorted(actual)) !== JSON.stringify(sorted(expected))) {
    throw new Error(`${label}_inventory_mismatch:${sorted(actual).join(',')}`);
  }
}

async function assertRegularFile(path: string, relativePath: string): Promise<void> {
  const stats = await lstat(path);
  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new Error(`bundle_entry_not_regular_file:${relativePath}`);
  }
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8'));
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(cell);
      cell = '';
    } else if (character === '\n') {
      row.push(cell.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += character;
    }
  }
  if (quoted) throw new Error('wcag_csv_unclosed_quote');
  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function validateWcagCsv(csv: string): void {
  const rows = parseCsv(csv);
  const expectedHeader = [
    'finding_id',
    'journey_step',
    'selector',
    'safe_fix_class',
    'wcag_reference',
    'reference_label',
    'automated_evidence',
    'repair_verification',
    'manual_review_required',
    'claim_boundary',
  ];
  if (rows.length !== 3 || JSON.stringify(rows[0]) !== JSON.stringify(expectedHeader)) {
    throw new Error('wcag_csv_structure_invalid');
  }
  if (
    rows[1]?.[0] !== 'CONTROLLED_BARRIER_EMAIL_NAME' ||
    rows[2]?.[0] !== 'CONTROLLED_BARRIER_FOCUS_VISIBLE' ||
    rows[1]?.length !== expectedHeader.length ||
    rows[2]?.length !== expectedHeader.length
  ) {
    throw new Error('wcag_csv_order_invalid');
  }
}

function validateManualReview(content: string): void {
  const required = [
    /visible email label remains clearly adjacent/i,
    /Screen-reader announcement requires qualified human review/i,
    /focus visibility against relevant backgrounds and interaction states/i,
    /Automation does not prove complete accessibility/i,
    /not WCAG certification or BFSG or EAA legal assurance/i,
    /Only the defined checkout journey and the two controlled findings were repaired/i,
  ];
  if (required.some((pattern) => !pattern.test(content))) {
    throw new Error('manual_review_disclaimer_missing');
  }
}

async function collectFiles(root: string): Promise<Map<string, Buffer>> {
  const files = new Map<string, Buffer>();
  async function visit(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(directory, entry.name);
      const relativePath = relative(root, path).split(sep).join('/');
      if (entry.isSymbolicLink()) {
        throw new Error(`bundle_symlink_rejected:${relativePath}`);
      }
      if (entry.isDirectory()) {
        await visit(path);
      } else if (entry.isFile()) {
        files.set(relativePath, await readFile(path));
      } else {
        throw new Error(`bundle_special_file_rejected:${relativePath}`);
      }
    }
  }
  await visit(root);
  return files;
}

export async function validateProofBundle(bundleDirectory: string): Promise<{
  summary: ReturnType<typeof ProofSummarySchema.parse>;
  fileHashes: Record<string, string>;
}> {
  const rootStats = await lstat(bundleDirectory);
  if (rootStats.isSymbolicLink() || !rootStats.isDirectory()) {
    throw new Error('proof_bundle_root_invalid');
  }
  const topEntries = await readdir(bundleDirectory, { withFileTypes: true });
  if (topEntries.some((entry) => entry.isSymbolicLink())) {
    throw new Error('proof_bundle_top_level_symlink');
  }
  assertExactNames(topEntries.map((entry) => entry.name), REQUIRED_TOP_LEVEL_ENTRIES, 'top_level');

  for (const entry of REQUIRED_TOP_LEVEL_ENTRIES) {
    const path = join(bundleDirectory, entry);
    if (entry === 'test-results') {
      const stats = await lstat(path);
      if (!stats.isDirectory() || stats.isSymbolicLink()) {
        throw new Error('test_results_directory_invalid');
      }
      const names = (await readdir(path)).sort();
      assertExactNames(names, REQUIRED_TEST_RESULT_ENTRIES, 'test_results');
    } else {
      await assertRegularFile(path, entry);
    }
  }

  const summary = ProofSummarySchema.parse(await readJson(join(bundleDirectory, 'summary.json')));
  const findings = ProofFindingsSchema.parse(await readJson(join(bundleDirectory, 'findings.json')));
  JourneyMapSchema.parse(await readJson(join(bundleDirectory, 'journey-map.json')));
  const repairPlan = RepairPlanSchema.parse(await readJson(join(bundleDirectory, 'repair-plan.json')));
  const planPolicy = validateRepairPlanPolicy(repairPlan);
  if (!planPolicy.accepted) throw new Error('bundle_repair_plan_policy_rejected');
  AuditLogSchema.parse(await readJson(join(bundleDirectory, 'audit-log.json')));
  BeforeBaselineResultSchema.parse(await readJson(join(bundleDirectory, 'test-results/before-baseline.json')));
  AfterReplayResultSchema.parse(await readJson(join(bundleDirectory, 'test-results/after-replay.json')));
  VerificationSchema.parse(await readJson(join(bundleDirectory, 'test-results/verification.json')));
  ModelRunAuditSchema.parse(await readJson(join(bundleDirectory, 'test-results/model-audit.json')));
  PatchAuditSchema.parse(await readJson(join(bundleDirectory, 'test-results/patch-audit.json')));

  if (findings.findings.length !== 2) throw new Error('proof_findings_count_invalid');
  const patch = await readFile(join(bundleDirectory, 'patch.diff'));
  const replay = await readFile(join(bundleDirectory, 'replay.spec.ts'));
  if (sha256(patch) !== REVIEWED_SOURCE_HASHES.patch) throw new Error('bundle_patch_hash_mismatch');
  if (sha256(replay) !== REVIEWED_SOURCE_HASHES.replay) throw new Error('bundle_replay_hash_mismatch');
  validateGeneratedPatch(patch.toString('utf8'));

  validateWcagCsv(await readFile(join(bundleDirectory, 'wcag-map.csv'), 'utf8'));
  validateManualReview(await readFile(join(bundleDirectory, 'manual-review.md'), 'utf8'));
  validateReportHtml(await readFile(join(bundleDirectory, 'report.html'), 'utf8'));

  const files = await collectFiles(bundleDirectory);
  const fileHashes = Object.fromEntries(
    [...files.entries()].map(([path, content]) => [path, sha256(content)]),
  );
  for (const [path, content] of files) {
    scanGeneratedText(path, content.toString('utf8'));
  }
  assertExactNames(Object.keys(summary.generatedEntrySha256), MANIFEST_HASHED_ENTRIES, 'manifest');
  for (const path of MANIFEST_HASHED_ENTRIES) {
    if (summary.generatedEntrySha256[path] !== fileHashes[path]) {
      throw new Error(`manifest_hash_mismatch:${path}`);
    }
  }
  if (JSON.stringify(summary.sourceArtifactSha256) !== JSON.stringify(REVIEWED_SOURCE_HASHES)) {
    throw new Error('summary_source_hashes_mismatch');
  }
  return { summary, fileHashes };
}
