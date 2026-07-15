import { runPhase1Repair } from './repair.ts';

try {
  const { verification } = await runPhase1Repair();
  console.log(`PHASE1C_PATCH_SHA256=${verification.patchSha256}`);
  console.log(`PHASE1C_REPLAY_SPEC_SHA256=${verification.replaySpecSha256}`);
  console.log(
    `PHASE1C_REPAIRED_FOCUS=${JSON.stringify(verification.repairedFocusComputedValues)}`,
  );
  console.log(`PHASE1C_AXE_VIOLATIONS=${verification.axeResult.violationCount}`);
  console.log('PHASE1C_CONFIRMATION=REACHED');
  console.log('PHASE1C_ORIGINAL_DEMO=UNCHANGED');
  console.log('PHASE1C_WORKING_COPY_CLEANUP=REMOVED');
} catch (error) {
  const message = error instanceof Error ? error.message : 'unknown_error';
  console.error(`PHASE1C_REPAIR_FAILED=${message}`);
  process.exitCode = 1;
}
