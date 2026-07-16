import { lstat, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  JUDGE_SAMPLE_APPROVED_HASHES,
  JUDGE_SAMPLE_BUNDLE_DIRECTORY,
} from './constants.ts';
import { validateProofBundle } from './validation.ts';
import { validateReportRelativeLinks } from './report-validation.ts';
import { assertSafeRelativePath, scanGeneratedText } from './security.ts';

const JUDGE_SAMPLE_ENTRIES = ['README.md', 'SHA256SUMS', 'proof-bundle'] as const;

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

function assertExactNames(actual: readonly string[], expected: readonly string[], label: string): void {
  if (JSON.stringify(sorted(actual)) !== JSON.stringify(sorted(expected))) {
    throw new Error(`${label}_inventory_mismatch:${sorted(actual).join(',')}`);
  }
}

async function assertRegularEntry(
  path: string,
  relativePath: string,
  expected: 'file' | 'directory',
): Promise<void> {
  let stats;
  try {
    stats = await lstat(path);
  } catch {
    throw new Error(`judge_sample_entry_missing:${relativePath}`);
  }
  if (
    stats.isSymbolicLink() ||
    (expected === 'file' ? !stats.isFile() : !stats.isDirectory())
  ) {
    throw new Error(`judge_sample_entry_invalid:${relativePath}`);
  }
}

export function parseJudgeSampleSha256Sums(content: string): Map<string, string> {
  if (!content.endsWith('\n')) throw new Error('judge_sample_sha256sums_newline_missing');
  const lines = content.trimEnd().split('\n');
  const entries = new Map<string, string>();
  const orderedPaths: string[] = [];
  for (const line of lines) {
    const match = /^([a-f0-9]{64})  ([^\r\n]+)$/.exec(line);
    if (!match) throw new Error('judge_sample_sha256sums_line_invalid');
    const [, hash, path] = match;
    try {
      assertSafeRelativePath(path);
    } catch {
      throw new Error('judge_sample_sha256sums_path_unsafe');
    }
    if (entries.has(path)) throw new Error(`judge_sample_sha256sums_duplicate:${path}`);
    entries.set(path, hash);
    orderedPaths.push(path);
  }
  const expectedPaths = Object.keys(JUDGE_SAMPLE_APPROVED_HASHES).sort();
  if (JSON.stringify(orderedPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error(`judge_sample_sha256sums_order_or_inventory_invalid:${orderedPaths.join(',')}`);
  }
  return entries;
}

export function sanitizeJudgeSampleFailure(error: unknown): string {
  const message = error instanceof Error ? error.message : 'unknown_error';
  if (/(?:^|:)(?:\/|[A-Za-z]:\\)|\.\.(?:\/|\\)/.test(message)) {
    return message.split(':', 1)[0] || 'judge_sample_validation_failed';
  }
  return message;
}

export function validateJudgeSampleReadme(content: string): void {
  const requirements = [
    /curated byte-identical copy of the independently reviewed Phase 2B run/i,
    /e3811c8bf968dc78701f8d264dc1377543059d64/,
    /b16606f91831e90a1412cc8e26cca322b84cd328/,
    /proof-bundle\/report\.html/,
    /pnpm judge:sample:validate/,
    /CONTROLLED_BARRIER_EMAIL_NAME/,
    /CONTROLLED_BARRIER_FOCUS_VISIBLE/,
    /1\.3\.1/,
    /4\.1\.2/,
    /2\.4\.7/,
    /GPT-5\.6 produced the bounded repair plan once/i,
    /deterministic templates produced the patch/i,
    /sanitized evidence only/i,
    /no API key, raw prompt, raw response, environment value, screenshot, trace, or personal data/i,
    /not complete accessibility testing/i,
    /not.*WCAG conformance/i,
    /not.*certification/i,
    /not.*BFSG or EAA assurance/i,
    /screen-reader.*wording\/adjacency.*visual-focus review remain required/i,
  ];
  if (requirements.some((pattern) => !pattern.test(content))) {
    throw new Error('judge_sample_readme_boundary_missing');
  }
}

export interface JudgeSampleValidationResult {
  samplePath: typeof JUDGE_SAMPLE_BUNDLE_DIRECTORY;
  fileCount: 15;
  findingCount: 2;
  wcagMappingCount: 3;
  manifestStatus: 'passed';
  policyStatus: 'passed';
  securityStatus: 'passed';
}

export async function validateJudgeSample(sampleDirectory: string): Promise<JudgeSampleValidationResult> {
  await assertRegularEntry(sampleDirectory, 'examples/judge-sample', 'directory');
  const rootEntries = await readdir(sampleDirectory, { withFileTypes: true });
  if (rootEntries.some((entry) => entry.isSymbolicLink())) {
    throw new Error('judge_sample_root_symlink_rejected');
  }
  assertExactNames(rootEntries.map((entry) => entry.name), JUDGE_SAMPLE_ENTRIES, 'judge_sample');

  const readmePath = join(sampleDirectory, 'README.md');
  const sumsPath = join(sampleDirectory, 'SHA256SUMS');
  const bundleDirectory = join(sampleDirectory, 'proof-bundle');
  await assertRegularEntry(readmePath, 'examples/judge-sample/README.md', 'file');
  await assertRegularEntry(sumsPath, 'examples/judge-sample/SHA256SUMS', 'file');
  await assertRegularEntry(bundleDirectory, JUDGE_SAMPLE_BUNDLE_DIRECTORY, 'directory');

  const readme = await readFile(readmePath, 'utf8');
  const sums = await readFile(sumsPath, 'utf8');
  validateJudgeSampleReadme(readme);
  scanGeneratedText('examples/judge-sample/README.md', readme);
  scanGeneratedText('examples/judge-sample/SHA256SUMS', sums);

  const approvedSums = parseJudgeSampleSha256Sums(sums);
  const bundle = await validateProofBundle(bundleDirectory);
  const actualPaths = Object.keys(bundle.fileHashes).sort();
  const expectedPaths = Object.keys(JUDGE_SAMPLE_APPROVED_HASHES).sort();
  if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error(`judge_sample_file_inventory_mismatch:${actualPaths.join(',')}`);
  }
  for (const path of expectedPaths) {
    const approvedHash = JUDGE_SAMPLE_APPROVED_HASHES[path as keyof typeof JUDGE_SAMPLE_APPROVED_HASHES];
    if (approvedSums.get(path) !== approvedHash) {
      throw new Error(`judge_sample_approved_sum_mismatch:${path}`);
    }
    if (bundle.fileHashes[path] !== approvedHash) {
      throw new Error(`judge_sample_file_hash_mismatch:${path}`);
    }
  }

  const report = await readFile(join(bundleDirectory, 'report.html'), 'utf8');
  validateReportRelativeLinks(report, new Set(actualPaths));

  return {
    samplePath: JUDGE_SAMPLE_BUNDLE_DIRECTORY,
    fileCount: 15,
    findingCount: bundle.summary.beforeStateFindingCount,
    wcagMappingCount: bundle.summary.wcagMapping.criterionMappingCount,
    manifestStatus: 'passed',
    policyStatus: 'passed',
    securityStatus: 'passed',
  };
}
