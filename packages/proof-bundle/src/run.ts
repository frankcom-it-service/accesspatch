import { generateProofBundle } from './generate.ts';

try {
  const result = await generateProofBundle(process.cwd());
  console.log(`PHASE2_BUNDLE_STATUS=generated`);
  console.log(`PHASE2_BUNDLE_MANIFEST=summary.json`);
  console.log(`PHASE2_BUNDLE_ENTRIES=${Object.keys(result.fileHashes).length}`);
} catch (error) {
  console.error(`PHASE2_BUNDLE_FAILED=${error instanceof Error ? error.message : 'unknown_error'}`);
  process.exitCode = 1;
}
