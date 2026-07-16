import { test } from '@playwright/test';
import { assertProofBundleReport } from './report-assertions.ts';

test('tracked judge-sample report passes shared structural and axe checks', async ({ page }) => {
  await assertProofBundleReport(
    page,
    'examples/judge-sample/proof-bundle',
    'JUDGE_SAMPLE_REPORT_AXE_VIOLATIONS',
  );
});
