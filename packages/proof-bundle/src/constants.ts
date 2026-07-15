export const PROOF_BUNDLE_OUTPUT_DIRECTORY =
  '.accesspatch/runs/phase2/proof-bundle';

export const REQUIRED_TOP_LEVEL_ENTRIES = [
  'summary.json',
  'findings.json',
  'journey-map.json',
  'repair-plan.json',
  'patch.diff',
  'replay.spec.ts',
  'report.html',
  'wcag-map.csv',
  'manual-review.md',
  'test-results',
  'audit-log.json',
] as const;

export const REQUIRED_TEST_RESULT_ENTRIES = [
  'before-baseline.json',
  'after-replay.json',
  'verification.json',
  'model-audit.json',
  'patch-audit.json',
] as const;

export const MANIFEST_HASHED_ENTRIES = [
  'findings.json',
  'journey-map.json',
  'repair-plan.json',
  'patch.diff',
  'replay.spec.ts',
  'report.html',
  'wcag-map.csv',
  'manual-review.md',
  'test-results/before-baseline.json',
  'test-results/after-replay.json',
  'test-results/verification.json',
  'test-results/model-audit.json',
  'test-results/patch-audit.json',
  'audit-log.json',
] as const;

export const PHASE1C_IMPLEMENTATION_COMMIT =
  '79ed0e60b2c7145f4113ecac3797a119ccb696ee';

export const REVIEWED_SOURCE_HASHES = {
  evidence: 'cc61b701c94fbd6653fa1d8ee8e05e30791761544c4fe0576771532c36a925c2',
  repairPlan: '9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a',
  modelAudit: '3369c907622f0d6de9c0077e08ac50f28d8313803df213320570af6039e907c0',
  patch: '3303f8d8556f2d7e752e058093472a25af542e40244249f026a8231888ae9ac6',
  replay: '8eced10a99c8785fcbceebc800ecbd4aa781b70895bad4fe08bdeb549c2dec7e',
  verification: 'c85c56743496be7a615c4c3fc17c5c042c9cc431d20720eda62915ff6653b887',
  patchAudit: '0e588e5975cc55a648bce92451c700af6303fca17503e35c19135fb45f3eea0b',
  manualReview: '0c6a71ed05fde2ce9a3d9bb714973b292936ce6e5c3ba09c69e3545f197681b1',
} as const;

export const SOURCE_ARTIFACT_PATHS = {
  evidence: '.accesspatch/runs/phase1/evidence.json',
  repairPlan: '.accesspatch/runs/phase1/repair-plan.json',
  modelAudit: '.accesspatch/runs/phase1/model-audit.json',
  patch: '.accesspatch/runs/phase1c/patch.diff',
  replay: '.accesspatch/runs/phase1c/replay.spec.ts',
  verification: '.accesspatch/runs/phase1c/verification.json',
  patchAudit: '.accesspatch/runs/phase1c/patch-audit.json',
  manualReview: '.accesspatch/runs/phase1c/manual-review.md',
} as const;
