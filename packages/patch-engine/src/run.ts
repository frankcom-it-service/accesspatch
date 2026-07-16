import {
  mutationGuardSuccessOutput,
  runMutationGuard,
  runPhase1Repair,
} from './repair.ts';

try {
  if (process.argv[2] === 'mutation-guard') {
    const controller = new AbortController();
    const abort = () => controller.abort();
    process.once('SIGINT', abort);
    process.once('SIGTERM', abort);
    try {
      const result = await runMutationGuard(process.cwd(), {
        signal: controller.signal,
      });
      for (const line of mutationGuardSuccessOutput(result)) {
        console.log(line);
      }
    } finally {
      process.off('SIGINT', abort);
      process.off('SIGTERM', abort);
    }
  } else {
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
  }
} catch (error) {
  const message = error instanceof Error ? error.message : 'unknown_error';
  const category = message.split(':', 1)[0]?.replace(/[^a-z0-9_]/gi, '_');
  if (process.argv[2] === 'mutation-guard') {
    console.error(`MUTATION_GUARD_FAILED=${category || 'unknown_error'}`);
  } else {
    console.error(`PHASE1C_REPAIR_FAILED=${message}`);
  }
  process.exitCode = 1;
}
