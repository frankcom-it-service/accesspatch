import { resolve } from 'node:path';
import { PHASE1_EVIDENCE_PATH } from '@accesspatch/evidence-collector';
import {
  PHASE1_MODEL_AUDIT_PATH,
  PHASE1_REPAIR_PLAN_PATH,
  ReasonerFailure,
  runReasoner,
} from './reason.ts';

async function main(): Promise<void> {
  const repositoryRoot = process.cwd();
  const result = await runReasoner({
    evidencePath: resolve(repositoryRoot, PHASE1_EVIDENCE_PATH),
    repairPlanPath: resolve(repositoryRoot, PHASE1_REPAIR_PLAN_PATH),
    auditPath: resolve(repositoryRoot, PHASE1_MODEL_AUDIT_PATH),
  });

  console.log('PHASE1_REASONER_API=SUCCESS');
  console.log(`PHASE1_REASONER_MODEL=${result.audit.modelId}`);
  console.log(`PHASE1_REASONER_STATUS=${result.audit.responseStatus}`);
  console.log(`PHASE1_REASONER_USAGE=${JSON.stringify(result.audit.usage)}`);
  console.log(`PHASE1_REASONER_POLICY=${result.audit.policyValidation}`);
  console.log(`PHASE1_REASONER_SUMMARY=${result.plan.evidenceBasedSummary}`);
  for (const repair of result.plan.repairs) {
    console.log(
      `PHASE1_REASONER_REPAIR=${repair.findingId}:${repair.safeFixClass}:${repair.permittedChangeDescription}`,
    );
  }
}

main().catch((error: unknown) => {
  if (error instanceof ReasonerFailure) {
    console.error(`PHASE1_REASONER_FAILED=${error.category}`);
    console.error(error.message);
  } else {
    console.error('PHASE1_REASONER_FAILED=api_error');
    console.error('The reasoner failed without producing an approved plan.');
  }
  process.exitCode = 1;
});
