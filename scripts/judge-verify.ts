import { runJudgeWorkflow } from './judge-workflow.ts';

try {
  await runJudgeWorkflow();
} catch (error) {
  const category = error instanceof Error ? error.message.split(':', 1)[0] : 'unknown_error';
  console.error(`JUDGE_WORKFLOW_INVALID=${category}`);
  process.exitCode = 1;
}
