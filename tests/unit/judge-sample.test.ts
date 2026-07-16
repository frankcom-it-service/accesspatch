import assert from 'node:assert/strict';
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { afterEach, test } from 'node:test';
import {
  JUDGE_SAMPLE_APPROVED_HASHES,
  parseJudgeSampleSha256Sums,
  sanitizeJudgeSampleFailure,
  scanGeneratedText,
  sha256,
  validateJudgeSample,
  validateJudgeSampleReadme,
  validateReportRelativeLinks,
  validateWcagCsv,
} from '../../packages/proof-bundle/src/index.ts';
import { ProofFindingsSchema } from '../../packages/shared-types/src/index.ts';

const repositoryRoot = process.cwd();
const trackedSample = join(repositoryRoot, 'examples/judge-sample');
const temporaryRoots: string[] = [];

async function createSampleFixture(): Promise<{ root: string; sample: string }> {
  const root = await mkdtemp(join(tmpdir(), 'accesspatch-judge-sample-test-'));
  temporaryRoots.push(root);
  const sample = join(root, 'examples/judge-sample');
  await mkdir(dirname(sample), { recursive: true });
  await cp(trackedSample, sample, { recursive: true, force: false });
  return { root, sample };
}

async function collectFileState(root: string): Promise<Record<string, { hash: string; mtimeMs: number }>> {
  const result: Record<string, { hash: string; mtimeMs: number }> = {};
  async function visit(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
      } else if (entry.isFile()) {
        const relativePath = relative(root, path).split(sep).join('/');
        const stats = await lstat(path);
        result[relativePath] = { hash: sha256(await readFile(path)), mtimeMs: stats.mtimeMs };
      }
    }
  }
  await visit(root);
  return result;
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test('validates the tracked judge sample', async () => {
  const result = await validateJudgeSample(trackedSample);
  assert.deepEqual(result, {
    samplePath: 'examples/judge-sample/proof-bundle',
    fileCount: 15,
    findingCount: 2,
    wcagMappingCount: 3,
    manifestStatus: 'passed',
    policyStatus: 'passed',
    securityStatus: 'passed',
  });
});

test('rejects a missing tracked bundle file', async () => {
  const { sample } = await createSampleFixture();
  await unlink(join(sample, 'proof-bundle/summary.json'));
  await assert.rejects(validateJudgeSample(sample), /top_level_inventory_mismatch/);
});

test('rejects an unexpected tracked bundle file', async () => {
  const { sample } = await createSampleFixture();
  await writeFile(join(sample, 'proof-bundle/unexpected.txt'), 'unexpected');
  await assert.rejects(validateJudgeSample(sample), /top_level_inventory_mismatch/);
});

test('rejects an altered tracked bundle hash', async () => {
  const { sample } = await createSampleFixture();
  const path = join(sample, 'proof-bundle/manual-review.md');
  await writeFile(path, `${await readFile(path, 'utf8')}\nAltered.\n`);
  await assert.rejects(validateJudgeSample(sample), /manifest_hash_mismatch:manual-review\.md/);
});

test('rejects an incorrect SHA256SUMS hash', async () => {
  const { sample } = await createSampleFixture();
  const path = join(sample, 'SHA256SUMS');
  const content = await readFile(path, 'utf8');
  await writeFile(path, content.replace(/^02ec[0-9a-f]{60}/, '0'.repeat(64)));
  await assert.rejects(validateJudgeSample(sample), /judge_sample_approved_sum_mismatch:audit-log\.json/);
});

test('rejects a duplicate SHA256SUMS path', async () => {
  const { sample } = await createSampleFixture();
  const path = join(sample, 'SHA256SUMS');
  const content = await readFile(path, 'utf8');
  await writeFile(path, `${content}${content.split('\n')[0]}\n`);
  await assert.rejects(validateJudgeSample(sample), /judge_sample_sha256sums_duplicate:audit-log\.json/);
});

test('rejects absolute and traversal SHA256SUMS paths', async () => {
  const content = await readFile(join(trackedSample, 'SHA256SUMS'), 'utf8');
  const absolutePath = ['', 'tmp', 'audit-log.json'].join('/');
  assert.throws(
    () => parseJudgeSampleSha256Sums(content.replace('  audit-log.json', `  ${absolutePath}`)),
    /judge_sample_sha256sums_path_unsafe/,
  );
  assert.throws(
    () => parseJudgeSampleSha256Sums(content.replace('  audit-log.json', '  ..\/audit-log.json')),
    /judge_sample_sha256sums_path_unsafe/,
  );
});

test('sanitizes absolute and traversal paths from CLI-visible failures', () => {
  const absolutePath = ['', 'home', 'example', 'private'].join('/');
  assert.equal(
    sanitizeJudgeSampleFailure(new Error(`unsafe_bundle_path:${absolutePath}`)),
    'unsafe_bundle_path',
  );
  assert.equal(
    sanitizeJudgeSampleFailure(new Error('report_relative_link_unsafe:../private')),
    'report_relative_link_unsafe',
  );
});

test('rejects a symlink without following it', async (context) => {
  const { sample } = await createSampleFixture();
  const path = join(sample, 'proof-bundle/summary.json');
  await unlink(path);
  try {
    await symlink('findings.json', path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EPERM') {
      context.skip('symlink creation is unavailable');
      return;
    }
    throw error;
  }
  await assert.rejects(validateJudgeSample(sample), /proof_bundle_top_level_symlink/);
});

test('validates independently from ignored AccessPatch runs', async () => {
  const { root, sample } = await createSampleFixture();
  await assert.rejects(lstat(join(root, '.accesspatch')), /ENOENT/);
  await assert.doesNotReject(validateJudgeSample(sample));
});

test('performs validation without changing tracked sample bytes or mtimes', async () => {
  const before = await collectFileState(trackedSample);
  await validateJudgeSample(trackedSample);
  const after = await collectFileState(trackedSample);
  assert.deepEqual(after, before);
});

test('pins the exact approved 15-file hash contract', async () => {
  const sums = parseJudgeSampleSha256Sums(await readFile(join(trackedSample, 'SHA256SUMS'), 'utf8'));
  assert.equal(Object.keys(JUDGE_SAMPLE_APPROVED_HASHES).length, 15);
  assert.deepEqual(Object.fromEntries(sums), JUDGE_SAMPLE_APPROVED_HASHES);
});

test('retains exactly the three approved WCAG mappings', async () => {
  const bundle = join(trackedSample, 'proof-bundle');
  const findings = ProofFindingsSchema.parse(
    JSON.parse(await readFile(join(bundle, 'findings.json'), 'utf8')),
  );
  const rows = validateWcagCsv(await readFile(join(bundle, 'wcag-map.csv'), 'utf8'), findings);
  assert.deepEqual(rows.slice(1).map((row) => [row[0], row[5]]), [
    ['CONTROLLED_BARRIER_EMAIL_NAME', '1.3.1'],
    ['CONTROLLED_BARRIER_EMAIL_NAME', '4.1.2'],
    ['CONTROLLED_BARRIER_FOCUS_VISIBLE', '2.4.7'],
  ]);
});

test('requires every report-relative link to remain inside the sample', async () => {
  const bundle = join(trackedSample, 'proof-bundle');
  const html = await readFile(join(bundle, 'report.html'), 'utf8');
  const availablePaths = new Set(Object.keys(JUDGE_SAMPLE_APPROVED_HASHES));
  assert.doesNotThrow(() => validateReportRelativeLinks(html, availablePaths));
  assert.throws(
    () => validateReportRelativeLinks(`${html}<a href="../outside">outside</a>`, availablePaths),
    /unsafe_bundle_path/,
  );
});

test('rejects credential and absolute-path leaks', () => {
  const keyShapedValue = ['sk', 'examplecredentialvalue123456789'].join('-');
  const absolutePath = ['', 'home', 'example', 'private', 'file'].join('/');
  assert.throws(
    () => scanGeneratedText('examples/judge-sample/README.md', keyShapedValue),
    /credential/,
  );
  assert.throws(
    () => scanGeneratedText('examples/judge-sample/README.md', absolutePath),
    /absolute_local_path/,
  );
});

test('requires the judge-sample README limitations', async () => {
  const readme = await readFile(join(trackedSample, 'README.md'), 'utf8');
  const unsupportedClaim = ['complete', 'accessibility testing'].join(' ');
  assert.doesNotThrow(() => validateJudgeSampleReadme(readme));
  assert.throws(
    () => validateJudgeSampleReadme(readme.replace('not complete accessibility testing', unsupportedClaim)),
    /judge_sample_readme_boundary_missing/,
  );
});
