import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import {
  collectJourneyEvidence,
  PHASE1_EVIDENCE_PATH,
  writeJourneyEvidence,
} from '../../packages/evidence-collector/src/index.ts';

test('collects the controlled journey as normalized evidence', async ({ page }) => {
  const repositoryRoot = process.cwd();
  const evidence = await collectJourneyEvidence(page, repositoryRoot);
  const outputPath = resolve(repositoryRoot, PHASE1_EVIDENCE_PATH);

  await writeJourneyEvidence(evidence, outputPath);

  expect(evidence.findings.map((finding) => finding.findingId)).toEqual([
    'CONTROLLED_BARRIER_EMAIL_NAME',
    'CONTROLLED_BARRIER_FOCUS_VISIBLE',
  ]);
  expect(evidence.axeSummary).toEqual({
    violationCount: 1,
    ruleIds: ['label'],
    targets: ['#email'],
  });
  expect(evidence.journey.confirmationReached).toBe(true);

  console.log(`PHASE1_EVIDENCE_WRITTEN=${PHASE1_EVIDENCE_PATH}`);
  console.log('KEYBOARD_JOURNEY_CONFIRMATION=REACHED');
});
