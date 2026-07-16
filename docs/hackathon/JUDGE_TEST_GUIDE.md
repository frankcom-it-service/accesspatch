# Judge Test Guide

## Status

**IMPLEMENTED / CLEAN-MACHINE VERIFICATION PENDING.** Phase 3A is complete in implementation commit `84db92f9e27b6f7872495516f166a8bcaed8ef03`. The corrected second lifetime workflow execution passed all eight stages with ignored runs absent. This establishes the local committed one-command path; clean-machine and broader-platform verification remain open.

The current verified environment uses `/usr/bin/chromium`. A clean environment without system Chromium can run `pnpm browser:install` to install Playwright Chromium only. Clean-install and cross-platform verification remain **NOT YET VERIFIED**.

The current FAQ and official announcement, checked 2026-07-15, require Developer Tools entries to document installation, supported platforms, and a judge testing path that does not require a complete rebuild.

## Current Evaluation Path

1. Install the exact locked dependencies:

   ```bash
   pnpm install --frozen-lockfile
   ```

2. Run the one-command verification:

   ```bash
   pnpm judge:verify
   ```

3. Optionally open `examples/judge-sample/proof-bundle/report.html` directly.

The workflow order is repository preflight, 139 API-free unit tests, type-check, build, smoke, passing controlled-baseline proof, tracked-sample validation, and tracked-report smoke. It creates empty restricted Git and npm/pnpm configuration below the reserved ignored workflow directory before preflight, redirects child configuration away from home and system files, disables credential prompts, and removes the runtime configuration afterward. `pnpm test:baseline` remains the intentionally failing developer diagnostic; `pnpm test:judge-baseline` passes only when those same two controlled defects are reproduced exactly. No credential is required for this judge path.

Successful final output:

```text
JUDGE_WORKFLOW_SAMPLE_PATH=examples/judge-sample/proof-bundle
JUDGE_WORKFLOW_FINDINGS=2
JUDGE_WORKFLOW_WCAG_MAPPINGS=3
JUDGE_WORKFLOW_BASELINE=expected-controlled-defects-confirmed
JUDGE_WORKFLOW_REPAIRED_EVIDENCE=validated
JUDGE_WORKFLOW_REPORT_AXE_VIOLATIONS=0
JUDGE_WORKFLOW_SECURITY=passed
JUDGE_WORKFLOW_VALID
```

## Open Requirements

- `TODO`: verify every link and step from a clean environment after feature freeze.
- `TODO`: confirm supported platforms beyond the current Node 24, pnpm 11.13.0, Chromium, and Linux environment.
