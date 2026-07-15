import { randomUUID } from 'node:crypto';
import { execFile as execFileCallback } from 'node:child_process';
import {
  lstat,
  mkdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import {
  AfterReplayResultSchema,
  AuditLogSchema,
  BeforeBaselineResultSchema,
  JourneyMapSchema,
  MANIFEST_STRATEGY,
  NON_CERTIFICATION_STATEMENT,
  PROOF_BUNDLE_VERSION,
  PROOF_SUMMARY_SCHEMA_VERSION,
  ProofFindingsSchema,
  ProofSummarySchema,
} from '@accesspatch/shared-types';
import {
  MANIFEST_HASHED_ENTRIES,
  PHASE1C_IMPLEMENTATION_COMMIT,
  PROOF_BUNDLE_OUTPUT_DIRECTORY,
  REVIEWED_SOURCE_HASHES,
} from './constants.ts';
import {
  createAfterResult,
  createAuditLog,
  createBeforeResult,
  createFindings,
  createJourneyMap,
  createReportHtml,
  createWcagMap,
} from './content.ts';
import { serializeJson, sha256 } from './hash.ts';
import { loadReviewedBundleSources } from './input.ts';
import { assertSafeRelativePath } from './security.ts';
import { validateProofBundle } from './validation.ts';

const execFile = promisify(execFileCallback);

export interface GenerateProofBundleOptions {
  generatedAtUtc?: string;
  repositoryHeadAtGeneration?: string;
  outputRelativePath?: string;
}

async function assertNoSymlinkPath(repositoryRoot: string, path: string): Promise<void> {
  const relativePath = relative(repositoryRoot, path).split(sep).join('/');
  const parts = relativePath.split('/').filter(Boolean);
  let current = repositoryRoot;
  for (const part of parts) {
    current = join(current, part);
    try {
      const stats = await lstat(current);
      if (stats.isSymbolicLink()) throw new Error(`bundle_path_symlink_rejected:${relative(repositoryRoot, current)}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
      throw error;
    }
  }
}

async function writeBundleFiles(
  directory: string,
  files: ReadonlyMap<string, Buffer>,
): Promise<void> {
  for (const [relativePath, content] of files) {
    assertSafeRelativePath(relativePath);
    const path = join(directory, relativePath);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}

export async function generateProofBundle(
  repositoryRoot = process.cwd(),
  options: GenerateProofBundleOptions = {},
): Promise<ReturnType<typeof validateProofBundle>> {
  const outputRelativePath = options.outputRelativePath ?? PROOF_BUNDLE_OUTPUT_DIRECTORY;
  assertSafeRelativePath(outputRelativePath);
  if (outputRelativePath !== PROOF_BUNDLE_OUTPUT_DIRECTORY) {
    throw new Error(`unsupported_bundle_output:${outputRelativePath}`);
  }

  const sources = await loadReviewedBundleSources(repositoryRoot);
  const generatedAtUtc = options.generatedAtUtc ?? new Date().toISOString();
  const repositoryHeadAtGeneration =
    options.repositoryHeadAtGeneration ??
    (await execFile('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot })).stdout.trim();
  const outputDirectory = resolve(repositoryRoot, outputRelativePath);
  const outputParent = dirname(outputDirectory);
  await assertNoSymlinkPath(repositoryRoot, outputParent);
  await mkdir(outputParent, { recursive: true });

  const token = `${process.pid}-${randomUUID()}`;
  const temporaryDirectory = join(outputParent, `.proof-bundle.tmp-${token}`);
  const backupDirectory = join(outputParent, `.proof-bundle.backup-${token}`);
  let backupCreated = false;
  let published = false;

  try {
    await mkdir(temporaryDirectory, { recursive: false });
    const findings = ProofFindingsSchema.parse(createFindings(sources));
    const journeyMap = JourneyMapSchema.parse(createJourneyMap());
    const beforeResult = BeforeBaselineResultSchema.parse(createBeforeResult(sources));
    const afterResult = AfterReplayResultSchema.parse(createAfterResult(sources));
    const report = createReportHtml(sources);
    const wcagMap = createWcagMap(sources);

    const files = new Map<string, Buffer>([
      ['findings.json', Buffer.from(serializeJson(findings))],
      ['journey-map.json', Buffer.from(serializeJson(journeyMap))],
      ['repair-plan.json', sources.bytes.repairPlan],
      ['patch.diff', sources.bytes.patch],
      ['replay.spec.ts', sources.bytes.replay],
      ['report.html', Buffer.from(report)],
      ['wcag-map.csv', Buffer.from(wcagMap)],
      ['manual-review.md', sources.bytes.manualReview],
      ['test-results/before-baseline.json', Buffer.from(serializeJson(beforeResult))],
      ['test-results/after-replay.json', Buffer.from(serializeJson(afterResult))],
      ['test-results/verification.json', sources.bytes.verification],
      ['test-results/model-audit.json', sources.bytes.modelAudit],
      ['test-results/patch-audit.json', sources.bytes.patchAudit],
    ]);
    const preAuditHashes = Object.fromEntries(
      [...files.entries()].map(([path, content]) => [path, sha256(content)]),
    );
    const auditLog = AuditLogSchema.parse(
      createAuditLog(sources, generatedAtUtc, preAuditHashes),
    );
    files.set('audit-log.json', Buffer.from(serializeJson(auditLog)));

    const generatedEntrySha256 = Object.fromEntries(
      MANIFEST_HASHED_ENTRIES.map((path) => {
        const content = files.get(path);
        if (!content) throw new Error(`manifest_entry_missing:${path}`);
        return [path, sha256(content)];
      }),
    );
    const usage = sources.modelAudit.usage;
    if (!usage) throw new Error('model_usage_missing');
    const manualReviewItemCount = sources.bytes.manualReview
      .toString('utf8')
      .split('\n')
      .filter((line) => line.startsWith('- ')).length;
    const summary = ProofSummarySchema.parse({
      schemaVersion: PROOF_SUMMARY_SCHEMA_VERSION,
      productName: 'AccessPatch',
      bundleVersion: PROOF_BUNDLE_VERSION,
      generatedAtUtc,
      manifestStrategy: MANIFEST_STRATEGY,
      baseImplementationCommit: PHASE1C_IMPLEMENTATION_COMMIT,
      repositoryHeadAtGeneration,
      journeyId: sources.evidence.journey.journeyId,
      scopeStatement: 'One controlled React checkout keyboard journey, two reviewed findings, and two deterministic isolated repair templates.',
      beforeStateFindingCount: 2,
      repairedFindingCount: 2,
      unresolvedAutomatedFindingCount: 0,
      manualReviewItemCount,
      model: {
        id: 'gpt-5.6-sol',
        responseStatus: 'completed',
        store: false,
        usage,
      },
      deterministicPolicyResult: 'accepted',
      patchVerificationResult: 'passed',
      replayResult: 'passed',
      axe: {
        before: sources.evidence.axeSummary,
        after: sources.verification.axeResult,
      },
      confirmationReached: true,
      originalFixturePreserved: true,
      sourceArtifactSha256: { ...REVIEWED_SOURCE_HASHES },
      generatedEntrySha256,
      nonCertificationStatement: NON_CERTIFICATION_STATEMENT,
    });
    files.set('summary.json', Buffer.from(serializeJson(summary)));

    await writeBundleFiles(temporaryDirectory, files);
    await validateProofBundle(temporaryDirectory);

    try {
      const existing = await lstat(outputDirectory);
      if (existing.isSymbolicLink() || !existing.isDirectory()) {
        throw new Error('existing_bundle_output_invalid');
      }
      await rename(outputDirectory, backupDirectory);
      backupCreated = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    await rename(temporaryDirectory, outputDirectory);
    published = true;
    if (backupCreated) await rm(backupDirectory, { recursive: true, force: true });
    return validateProofBundle(outputDirectory);
  } catch (error) {
    if (backupCreated && !published) {
      await rename(backupDirectory, outputDirectory);
    }
    throw error;
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
    if (published || !backupCreated) {
      await rm(backupDirectory, { recursive: true, force: true });
    }
  }
}
