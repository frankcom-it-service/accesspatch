import { test } from '@playwright/test';
import { assertProofBundleReport } from './report-assertions.ts';

test('canonical static report passes structural and automated axe smoke checks', async ({
  page,
}) => {
  await assertProofBundleReport(
    page,
    '.accesspatch/runs/phase2/proof-bundle',
    'PHASE2_REPORT_AXE_VIOLATIONS',
  );
});
