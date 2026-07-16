import { resolve } from 'node:path';
import { JUDGE_SAMPLE_DIRECTORY } from './constants.ts';
import {
  sanitizeJudgeSampleFailure,
  validateJudgeSample,
} from './judge-sample.ts';

try {
  const result = await validateJudgeSample(resolve(process.cwd(), JUDGE_SAMPLE_DIRECTORY));
  console.log(`JUDGE_SAMPLE_PATH=${result.samplePath}`);
  console.log(`JUDGE_SAMPLE_FILE_COUNT=${result.fileCount}`);
  console.log(`JUDGE_SAMPLE_FINDING_COUNT=${result.findingCount}`);
  console.log(`JUDGE_SAMPLE_WCAG_MAPPING_COUNT=${result.wcagMappingCount}`);
  console.log(`JUDGE_SAMPLE_MANIFEST=${result.manifestStatus}`);
  console.log(`JUDGE_SAMPLE_POLICY=${result.policyStatus}`);
  console.log(`JUDGE_SAMPLE_SECURITY=${result.securityStatus}`);
  console.log('JUDGE_SAMPLE_VALID');
} catch (error) {
  console.error(`JUDGE_SAMPLE_INVALID=${sanitizeJudgeSampleFailure(error)}`);
  process.exitCode = 1;
}
