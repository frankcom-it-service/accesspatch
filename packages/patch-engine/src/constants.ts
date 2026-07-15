export const PATCH_ENGINE_VERSION = '1.0.0-phase1c';
export const VERIFICATION_SCHEMA_VERSION = 'accesspatch.verification.v1';
export const PATCH_AUDIT_SCHEMA_VERSION = 'accesspatch.patch-audit.v1';

export const PHASE1B_ARTIFACT_PATHS = {
  evidence: '.accesspatch/runs/phase1/evidence.json',
  repairPlan: '.accesspatch/runs/phase1/repair-plan.json',
  modelAudit: '.accesspatch/runs/phase1/model-audit.json',
} as const;

export const REVIEWED_PHASE1B_HASHES = {
  evidence: 'cc61b701c94fbd6653fa1d8ee8e05e30791761544c4fe0576771532c36a925c2',
  repairPlan: '9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a',
  modelAudit: '3369c907622f0d6de9c0077e08ac50f28d8313803df213320570af6039e907c0',
} as const;

export const PHASE1C_OUTPUT_DIRECTORY = '.accesspatch/runs/phase1c';

export const ISOLATED_WORKING_COPY_STRATEGY =
  'disposable-copy-with-excluded-git-dependencies-build-output-test-output-and-prior-runs';

export const PHASE1C_CHANGED_FILES = [
  'apps/demo-checkout/src/App.tsx',
  'apps/demo-checkout/src/styles.css',
] as const;

export const PHASE1C_SAFE_FIX_CLASSES = [
  'associate_explicit_label',
  'restore_focus_visible',
] as const;
