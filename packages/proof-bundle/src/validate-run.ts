import { resolve } from 'node:path';
import { PROOF_BUNDLE_OUTPUT_DIRECTORY } from './constants.ts';
import { validateProofBundle } from './validation.ts';

try {
  const result = await validateProofBundle(
    resolve(process.cwd(), PROOF_BUNDLE_OUTPUT_DIRECTORY),
  );
  console.log(`PHASE2_BUNDLE_VALIDATION=passed`);
  console.log(`PHASE2_BUNDLE_FILE_COUNT=${Object.keys(result.fileHashes).length}`);
} catch (error) {
  console.error(`PHASE2_BUNDLE_VALIDATION_FAILED=${error instanceof Error ? error.message : 'unknown_error'}`);
  process.exitCode = 1;
}
