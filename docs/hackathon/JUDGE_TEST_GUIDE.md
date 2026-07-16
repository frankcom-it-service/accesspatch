# Judge Test Guide

## Status

**IMPLEMENTED / CLEAN-CLONE VERIFIED ON ONE PLATFORM.** Phase 3A is complete in implementation commit `84db92f9e27b6f7872495516f166a8bcaed8ef03`. Phase 3B is complete in evidence commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed`. The committed path was validated from a fresh Git clone at source HEAD `7d0653cd344cf15be448ed9ef62b41b74c0d67ef`: frozen installation and `pnpm judge:verify` each ran exactly once, exited `0`, and were not retried.

The verified clean-clone environment is Debian GNU/Linux 13, x86_64, Node.js 24.18.0, pnpm 11.13.0, Git 2.47.3, and Chromium 148.0.7778.178 selected from `/usr/bin/chromium`. A clean environment without system Chromium can run `pnpm browser:install` to install Playwright Chromium only. That fallback and other operating systems or browser configurations remain **NOT YET VERIFIED**.

The current FAQ and official announcement, checked 2026-07-15, require Developer Tools entries to document installation, supported platforms, and a judge testing path that does not require a complete rebuild.

## Repository Access

Canonical private repository: `https://github.com/frankcom-it-service/accesspatch`.

The repository is not publicly cloneable. Judges require granted GitHub access. Read-only invitations to the two required judging recipients remain pending, so acceptance and an independent judge clone are not yet verified.

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

The sanitized clean-clone evidence is tracked at `docs/hackathon/evidence/phase3b-clean-clone/`. The installation required registry access and encountered transient retry warnings. The Judge Workflow itself is API-free; `.accesspatch/runs/` remained absent, and the workflow monitor observed no external TCP connection.

## Optional Phase 5A Clean-Clone Evidence

The optional Mutation Guard feature remains on local branch `feature/accessibility-mutation-guard` and is not part of remote `main`. Its committed HEAD `d75954b672cbc88569d5502198effc57c4390c63` passed a separate 17-stage clean-clone acceptance on Debian GNU/Linux 13 x86_64 with Node `v24.18.0`, pnpm `11.13.0`, Git `2.47.3`, and Chromium `148.0.7778.178`.

The isolated installation ran once with `--offline --frozen-lockfile`, reused 33 packages, and downloaded zero. A temporary `trustLockfile: true` key existed only in the disposable clone and the original `pnpm-workspace.yaml` was restored byte-for-byte before `pnpm mutation:guard` and `pnpm judge:verify`. The guard detected exactly one mutation, and the Judge Workflow passed all eight stages with 178 tests and zero axe violations in the tracked repaired report.

The reviewed evidence is tracked under `docs/hackathon/evidence/phase5a-clean-clone/`; archive SHA-256 is `eec0095939e73ccf623b5d5f8d75af73a6b7f5d16e686c34dad0000629fd97d6`. This is evidence for one fixed mutation class, one controlled fixture, and one Debian/Chromium path only. It does not establish broader platform or repository support.

## Open Requirements

- `TODO`: confirm supported platforms beyond the verified Debian GNU/Linux 13 x86_64, Node.js 24.18.0, pnpm 11.13.0, Git 2.47.3, and Chromium 148.0.7778.178 environment.
- `TODO`: verify the Playwright-managed Chromium fallback and final public links after feature freeze.
- `TODO`: verify both judging invitations are accepted and a judge can clone the private repository.
