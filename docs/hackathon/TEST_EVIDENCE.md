# Test Evidence

## Phase 0

At Phase 0 completion, no application code or test suite existed. That documentation-only phase claimed no functional, accessibility, security, performance, or model-integration result.

Documentation correction validation status:

| Check | Result |
| --- | --- |
| Complete tracked diff and untracked full-file review | PASS — all current changes reviewed |
| `git diff --check` | PASS — exit `0`, no output |
| `rg -n '[[:blank:]]+$' AGENTS.md README.md .gitignore .env.example docs/hackathon` | PASS — exit `1`, no matches |
| Unsupported-claim review | PASS — completed-functionality claims were not found; future work remains labeled |
| Selected high-risk secret-pattern `rg` scan across all current files | PASS — exit `1`, no matches |
| `find` for `package.json`, `*.js`, `*.jsx`, `*.ts`, and `*.tsx` outside `.git` | PASS — exit `0`, no output |

`git status --short` exited `0` with this exact output before this evidence update; the file categories remain unchanged:

```text
 M README.md
?? .env.example
?? .gitignore
?? AGENTS.md
?? docs/
```

These checks validate Phase 0 repository hygiene only; they are not application, accessibility, security, or model tests. `git diff --check` does not include untracked file contents, so the separate all-file whitespace scan covered the new documents.

## Final Checklist and Proof Contract Correction

- External archive review: reported passed structure, secret hygiene, unsupported-claim handling, and scope control; it did not execute the repository commands recorded here.
- Codex `git diff --check`: exit `0`, no output.
- Codex `rg -n '[[:blank:]]+$' AGENTS.md README.md .gitignore .env.example docs/hackathon`: exit `1`, no matches.
- Codex selected high-risk secret-pattern `rg` scan across the same files: exit `1`, no matches.
- Codex `find` for `package.json`, `*.js`, `*.jsx`, `*.ts`, and `*.tsx` outside `.git`: exit `0`, no output.
- Codex `rg -n '^- \[[xX]\]' docs/hackathon/SUBMISSION_CHECKLIST.md`: exit `1`, no checked entries; 117 unchecked entries were present.
- Codex canonical contract check: each required name (`summary.json`, `findings.json`, `journey-map.json`, `repair-plan.json`, `patch.diff`, `replay.spec.ts`, `report.html`, `wcag-map.csv`, `manual-review.md`, `test-results/`, `audit-log.json`) appeared exactly once in `DEMO_EVIDENCE.md`; exit `0`.
- Codex `git status --short`: exit `0`; `README.md` modified, with `.env.example`, `.gitignore`, `AGENTS.md`, and `docs/` untracked.

## Phase 0 Commit Record

- Original minimal baseline: `0ac10988053a301c89689b8ce8fbd7e6aecd481f` (`chore: document initial hackathon repository`).
- Validated Phase 0 foundation: `bbabb9207b0f7ae92b8262b2e02930511dd81521` (`docs: establish Phase 0 hackathon controls`).
- Governance-record follow-up: committed separately with subject `docs: record Phase 0 completion`; its own hash is intentionally not embedded in the commit content.
- These are documentation commits only and do not establish application, accessibility, security, or model-runtime test results.

## Human-Supervised GPT-5.6 Access Verification — 2026-07-15

- Provenance: results supplied from the human-supervised setup; Codex did not rerun the request or access the secret.
- Project controls: dedicated `AccessPatch Build Week` project, model restricted to `gpt-5.6-sol`, model-list read and Responses write only, all other endpoint groups disabled.
- Cost controls: USD 5 prepaid balance; auto recharge disabled.
- First attempt before credit: HTTP `429`, error `insufficient_quota`.
- Successful access check after credit: Responses API HTTP `200`; model `gpt-5.6-sol`; status `completed`; exact visible output `ACCESSPATCH_API_OK`; `store: false`.
- Usage: input 16, output 8, reasoning 0, total 24 tokens.
- Interpretation: real authentication, billing readiness, and model-response evidence for a minimal access test only. AccessPatch integration, JSON schema validation, deterministic safety validation, privacy-conscious audit logging, fallback behavior, and the reproducible repair-plan demo remain **NOT YET IMPLEMENTED**.

## Phase 1A Controlled Baseline — 2026-07-15

- Environment: Node.js `v24.18.0`, pnpm `11.13.0`, system Chromium `/usr/bin/chromium`.
- `pnpm install`: initial exit `0` with 31 packages added; exact-specifier reconciliation rerun exit `0`, already up to date, and changed no resolved package.
- `pnpm install --frozen-lockfile`: final exit `0`; already up to date.
- `pnpm audit --audit-level=high`: exit `0`; exact result `No known vulnerabilities found`.
- `pnpm licenses list --json`: initial sandbox-cache attempt exited `1` with `ERR_SQLITE_ERROR`; approved rerun exited `0`. All installed packages were categorized as MIT, Apache-2.0, MPL-2.0, ISC, or BSD-3-Clause. Every direct dependency had an identified license; direct licenses were MIT, Apache-2.0, or MPL-2.0, with MPL-2.0 limited to the expected `@axe-core/playwright` dependency and no GPL/AGPL direct dependency.
- Direct-specifier scan: no `latest` remains in either package manifest or lockfile importer; exact versions match the resolved dependency graph.
- Chromium resolution: explicit environment path first, then existing `/usr/bin/chromium`, otherwise Playwright-managed Chromium. This run verified `/usr/bin/chromium`; clean-install and cross-platform verification remain pending.
- Form instruction: visible `All fields are required.` text is referenced by the form, and the country select is required; neither controlled barrier was repaired.
- `pnpm typecheck`: exit `0`.
- `pnpm build`: exit `0`; Vite `8.1.4` transformed 16 modules and produced `dist/`.
- `pnpm test:smoke`: latest approved local-server run exit `0`, 1 test passed in Chromium in 2.9 seconds. The earlier sandbox-only Vite `listen EPERM` did not recur outside that restriction.
- `pnpm test:baseline`: expected exit `1`, 1 test failed in 6.4 seconds after emitting `KEYBOARD_JOURNEY_CONFIRMATION=REACHED`.
- Barrier 1: `CONTROLLED_BARRIER_EMAIL_NAME`; expected `Email address`, received empty accessible name.
- Barrier 2: `CONTROLLED_BARRIER_FOCUS_VISIBLE`; computed focus styles reported `outlineStyle: none` and `boxShadow: none`.
- Axe checkout finding: exactly one violation, id `label`, impact `critical`, target `#email`; no unexpected axe violation was returned.
- Generated screenshot, trace, HTML report, error context, and structured axe attachment are ignored test artifacts.
- `git diff --check`: exit `0`, no output.
- All-current-file trailing-whitespace scan: ripgrep exit `1`, no matches.
- Selected high-risk credential-pattern scan: ripgrep exit `1`, no matches.
- Non-empty OpenAI-variable and sensitive project/organization identifier scan: ripgrep exit `1`, no matches.
- `git check-ignore` confirmed `apps/demo-checkout/dist`, `node_modules`, `playwright-report`, and `test-results` are ignored; exit `0`.
- Scope: expected product-barrier failures only. No OpenAI credential access, API call, repair, replay generation, analyzer, or Proof Bundle implementation occurred.
- Phase 1A implementation commit: `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf` (`feat: add controlled checkout baseline`).

## Phase 1B Structured Evidence and Reasoner — 2026-07-15

- Environment: Node.js `v24.18.0`, pnpm `11.13.0`, system Chromium `/usr/bin/chromium`; Phase 1B commit status **PENDING / UNCOMMITTED**.
- `pnpm install --frozen-lockfile`: exit `0`; all 5 workspace projects already up to date; completed with pnpm `11.13.0`.
- Exact-specifier scan: ripgrep found no `latest` in any package manifest or lockfile importer; exit `1`, no matches. New external direct dependencies are OpenAI SDK `6.47.0` and Zod `4.4.3`.
- `pnpm audit --audit-level=high`: exit `0`; exact result `No known vulnerabilities found`.
- `pnpm licenses list --json`: exit `0`; OpenAI SDK `6.47.0` is Apache-2.0 and Zod `4.4.3` is MIT. All installed packages were categorized as MPL-2.0, MIT, Apache-2.0, ISC, or BSD-3-Clause; no unknown or missing direct license appeared.
- `pnpm test:unit`: exit `0`; 21 tests passed, 0 failed, and no API call occurred. Coverage includes schema acceptance/rejection, duplicate or missing findings, fix mapping, fix class, target path, traversal/absolute paths, verification requirements, legal claims, dependency requests, missing key with stale-plan removal, sanitized audit data, and valid-plan policy acceptance.
- `pnpm typecheck`: exit `0` across all three packages, the demo app, e2e tests, and unit tests.
- `pnpm build`: exit `0`; Vite `8.1.4` transformed 16 modules and completed the production build.
- `pnpm phase1:evidence`: exit `0`; one Chromium test passed in 3.8 seconds and emitted `PHASE1_EVIDENCE_WRITTEN=.accesspatch/runs/phase1/evidence.json` plus `KEYBOARD_JOURNEY_CONFIRMATION=REACHED`.
- Normalized evidence: schema `1.0.0`, journey `demo-checkout-keyboard-v1`, exactly two findings, exactly one axe violation (`label`, impact `critical`, target `#email`), and computed focus values `outlineStyle=none`, `outlineWidth=3px`, `boxShadow=none`, `visibleIndicatorDetected=false`.
- Source minimization: allowlisted files are only `apps/demo-checkout/src/App.tsx` and `apps/demo-checkout/src/styles.css`; excerpts were 494 and 271 characters, below the 1,200-character cap; no complete file was included.
- Evidence SHA-256: `cc61b701c94fbd6653fa1d8ee8e05e30791761544c4fe0576771532c36a925c2`.
- Single approved runtime command: `bash -lc 'set +x; source "$HOME/.config/accesspatch/openai.env"; pnpm phase1:reason'`; exit `0`. This command was executed exactly once, the credential contents were not displayed or inspected, and the SDK used no automatic retries.
- API result: model `gpt-5.6-sol`; response status `completed`; low reasoning; `store: false`; 1,649 input tokens, 795 output tokens, 0 reasoning tokens, 2,444 total tokens.
- Plan result: schema `1.0.0`; exactly one `associate_explicit_label` repair for `CONTROLLED_BARRIER_EMAIL_NAME` and one `restore_focus_visible` repair for `CONTROLLED_BARRIER_FOCUS_VISIBLE`; both low risk, confidence `0.99`, correct allowlisted files, and required automated plus human review.
- Deterministic result: `accepted`. The validator confirmed exact IDs and mappings, safe-fix and target allowlists, safe paths, preservation of the original demo, and absence of code, patches, commands, dependency changes, unrelated redesign, mutation instructions, or compliance claims.
- Repair-plan SHA-256: `9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a`; sanitized audit timestamp `2026-07-15T15:10:53.264Z`.
- `pnpm test:smoke`: exit `0`; 1 Chromium test passed in 2.1 seconds.
- `pnpm test:baseline`: expected exit `1`; confirmation was reached, both controlled soft assertions were reported, and axe returned only `label` for `#email`. A preceding sandbox-wrapped attempt could not bind localhost and was discarded as infrastructure evidence; the approved direct command produced the valid baseline result.
- Generated evidence, plan, audit, build, screenshot, trace, report, and test outputs remain ignored. No patch, replay, report viewer, or Proof Bundle was generated.
- `git diff --check`: exit `0`, no output.
- All-current-file trailing-whitespace scan: ripgrep exit `1`, no matches across 55 tracked or untracked non-ignored files.
- Selected high-risk credential-pattern scan: ripgrep exit `1`, no matching file.
- Non-empty `OPENAI_API_KEY` and sensitive project/organization identifier scan: ripgrep exit `1`, no matching file.
- `git check-ignore -v`: exit `0`; confirmed all three `.accesspatch/runs/phase1/` outputs plus build, Playwright report, and test-result paths are ignored. No `.accesspatch/runs/` artifact or other generated output is staged or tracked.

### Phase 1B Pre-Commit Hardening

- Independent artifact review supplied by the human: PASS for evidence, plan, and audit secret hygiene, privacy, unsupported claims, and internal consistency. The reviewer is not represented as having executed the repository commands below.
- Reviewed hashes: evidence `cc61b701c94fbd6653fa1d8ee8e05e30791761544c4fe0576771532c36a925c2`; plan `9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a`; audit `3369c907622f0d6de9c0077e08ac50f28d8313803df213320570af6039e907c0`.
- Unit coverage: 17 API-free tests added, increasing 21 to 38. Added negatives cover duplicate allowlist files, selector/source/context mismatches, visible-focus mismatch, incorrect finding metadata, bounded-context markers/size/complete-file/symlink escape, CSS/JSX/assignment content, and unexpected returned model. Final `pnpm test:unit`: exit `0`, 38 passed, 0 failed, 0 skipped.
- `pnpm install --frozen-lockfile`: exit `0`; all 5 workspace projects already up to date using pnpm `11.13.0`.
- Exact-version scan: ripgrep exit `1`, no `latest` manifest or importer specification.
- `pnpm audit --audit-level=high`: exit `0`; exact result `No known vulnerabilities found`.
- `pnpm licenses list --json`: exit `0`; installed licenses remain MPL-2.0, MIT, Apache-2.0, ISC, or BSD-3-Clause with no unknown or missing direct license.
- `pnpm typecheck`: exit `0` across all packages, app, e2e tests, and unit tests.
- `pnpm build`: exit `0`; Vite transformed 16 modules and completed in 224 ms.
- `pnpm test:smoke`: exit `0`; 1 Chromium test passed in 3.4 seconds.
- `pnpm phase1:evidence`: exit `0`; 1 Chromium test passed in 3.7 seconds, reached confirmation, returned exactly both findings, one axe `label` target `#email`, and the existing 494/271-character excerpts. The reviewed evidence bytes were backed up before this required regeneration and restored afterward; all three reviewed hashes remained unchanged.
- `pnpm test:baseline`: expected exit `1`; confirmation reached and the only soft failures were `CONTROLLED_BARRIER_EMAIL_NAME` plus `CONTROLLED_BARRIER_FOCUS_VISIBLE`; axe returned exactly one `label` violation targeting only `#email`.
- Hardened offline artifact validation: evidence, plan, and audit schemas valid; deterministic policy accepted; audit references matched evidence and plan; no raw prompt, raw response, credential, or sensitive identifier field was present.
- Model-call count: no second request was made; `pnpm phase1:reason` was not executed during hardening.
- Scope: no demo source changed; no patch, replay, report, or Proof Bundle was generated; Phase 1B remains **PENDING / UNCOMMITTED**.

## Future Evidence Standard

Each test record must include date, commit, environment, exact command, exit status, relevant output, artifact location, and known limitations. Accessibility evidence must distinguish automated signals from disabled-user testing and qualified human review. It must not be presented as complete accessibility, WCAG certification, or BFSG/EAA legal assurance.
