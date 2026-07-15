import { isAbsolute } from 'node:path';
import type { RepairPlan } from '@accesspatch/shared-types';
import { PHASE1C_CHANGED_FILES } from './constants.ts';

const expectedRepairs = {
  CONTROLLED_BARRIER_EMAIL_NAME: {
    safeFixClass: 'associate_explicit_label',
    targetFile: 'apps/demo-checkout/src/App.tsx',
  },
  CONTROLLED_BARRIER_FOCUS_VISIBLE: {
    safeFixClass: 'restore_focus_visible',
    targetFile: 'apps/demo-checkout/src/styles.css',
  },
} as const;

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

export function assertApprovedRepairTargets(plan: RepairPlan): void {
  for (const repair of plan.repairs) {
    const expected = expectedRepairs[repair.findingId];
    if (
      repair.safeFixClass !== expected.safeFixClass ||
      repair.intendedTargetFile !== expected.targetFile
    ) {
      throw new Error(`repair_target_not_approved:${repair.findingId}`);
    }
  }
}

export function assertAllowedFileChanges(
  changedFiles: readonly string[],
  createdFiles: readonly string[],
  deletedFiles: readonly string[],
): void {
  if (
    JSON.stringify(sorted(changedFiles)) !==
    JSON.stringify(sorted(PHASE1C_CHANGED_FILES))
  ) {
    throw new Error(`changed_files_not_allowed:${sorted(changedFiles).join(',')}`);
  }
  if (
    createdFiles.length !== 1 ||
    createdFiles[0] !== 'tests/e2e/replay.spec.ts'
  ) {
    throw new Error(`created_files_not_allowed:${sorted(createdFiles).join(',')}`);
  }
  if (deletedFiles.length > 0) {
    throw new Error(`deleted_files_not_allowed:${sorted(deletedFiles).join(',')}`);
  }
}

export function validateGeneratedPatch(patch: string): void {
  const issues: string[] = [];
  const headerPaths = [...patch.matchAll(/^---\s+([^\t\n]+)|^\+\+\+\s+([^\t\n]+)/gm)]
    .map((match) => match[1] ?? match[2])
    .filter((path): path is string => Boolean(path));
  const allowedHeaders = new Set(
    PHASE1C_CHANGED_FILES.flatMap((file) => [`a/${file}`, `b/${file}`]),
  );

  if (headerPaths.length !== 4) {
    issues.push(`patch_header_count:${headerPaths.length}`);
  }
  for (const path of headerPaths) {
    const normalizedPath = path.replace(/^[ab]\//, '');
    if (
      !allowedHeaders.has(path) ||
      isAbsolute(normalizedPath) ||
      normalizedPath.split('/').includes('..')
    ) {
      issues.push(`unauthorized_patch_path:${path}`);
    }
  }
  if (!patch.includes('+                <label className="field-label" htmlFor="email">')) {
    issues.push('expected_label_association_missing');
  }
  if (!patch.includes('-  outline: none;') || !patch.includes('-  box-shadow: none;')) {
    issues.push('expected_focus_suppression_removal_missing');
  }
  if (/^[+](?![+])[^\n]*(?:WCAG|BFSG|EAA|certif|legal assurance)/im.test(patch)) {
    issues.push('legal_or_compliance_claim_added');
  }
  if (/package\.json|pnpm-lock\.yaml/.test(patch)) {
    issues.push('manifest_or_lockfile_change');
  }

  if (issues.length > 0) {
    throw new Error(`patch_policy_rejected:${[...new Set(issues)].join(',')}`);
  }
}
