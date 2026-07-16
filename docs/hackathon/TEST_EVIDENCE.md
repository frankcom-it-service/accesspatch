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

- Environment: Node.js `v24.18.0`, pnpm `11.13.0`, system Chromium `/usr/bin/chromium`; implementation commit `207e0559d0d7664a24dcb297fb40b37700f36208`.
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
- Scope: no demo source changed; no patch, replay, report, or Proof Bundle was generated; Phase 1B is **COMPLETE** in `207e0559d0d7664a24dcb297fb40b37700f36208`.

### Phase 1B Commit Gate

- `pnpm install --frozen-lockfile`: exit `0`; all 5 workspaces already up to date in 392 ms.
- Exact-version scan: ripgrep exit `1`, no floating `latest` specification.
- `pnpm audit --audit-level=high`: exit `0`; `No known vulnerabilities found`.
- `pnpm licenses list --json`: exit `0`; no missing direct license and no new license category.
- `pnpm test:unit`: exit `0`; 38 passed, 0 failed, 0 skipped in 373.47 ms.
- `pnpm typecheck`: exit `0`; all packages, app, e2e tests, and unit tests passed.
- `pnpm build`: exit `0`; 16 modules transformed in 220 ms.
- `pnpm test:smoke`: exit `0`; 1 Chromium test passed in 3.4 seconds.
- `pnpm test:baseline`: expected exit `1`; confirmation reached, only the two controlled assertions failed, and axe returned one `label` violation targeting `#email`.
- Offline reviewed-artifact validation: all schemas valid, policy accepted, audit references matched, no forbidden audit content, and all three approved hashes were unchanged.
- Repository hygiene: diff, whitespace, credential, sensitive-ID, ignored-artifact, staged-path, tracked-path, and prohibited-output checks passed.
- Implementation commit: `207e0559d0d7664a24dcb297fb40b37700f36208` (`feat: add bounded evidence repair reasoner`).

## Phase 1C Isolated Repair — 2026-07-15 (Pending)

- Starting gate: `git status --short --branch` showed clean `main`; the three Phase 1B hashes matched their reviewed values; all schemas parsed; audit references matched; deterministic plan policy returned `ACCEPTED`.
- `pnpm install --frozen-lockfile`: exit `0`, all 6 workspace projects already up to date with pnpm `11.13.0`. An earlier sandboxed cache attempt failed with SQLite access and was superseded by the approved run.
- Exact-version scan: no floating `latest` specification found.
- `pnpm audit --audit-level=high`: exit `0`; exact result `No known vulnerabilities found`.
- `pnpm licenses list --json`: exit `0`; valid groups were Apache-2.0, BSD-3-Clause, ISC, MIT, and MPL-2.0.
- `pnpm test:unit`: exit `0`; 57 passed, 0 failed, 0 skipped. Phase 1C added 19 API-free tests covering template preconditions, already-repaired states, reviewed hashes, plan targets, change gates, manifests, patch paths, replay content, and artifact schemas.
- `pnpm typecheck`: exit `0` across the app, four packages, e2e tests, and unit tests after correcting Zod tuple inference.
- `pnpm build`: exit `0`; Vite transformed 16 modules. `pnpm test:smoke`: approved local-server run exit `0`, 1 Chromium test passed.
- `pnpm test:baseline`: expected exit `1`; emitted `KEYBOARD_JOURNEY_CONFIRMATION=REACHED`, reported only `CONTROLLED_BARRIER_EMAIL_NAME` and `CONTROLLED_BARRIER_FOCUS_VISIBLE`, and axe returned exactly one `label` violation for `#email`.
- Single `pnpm phase1:repair` execution: exit `1`. Before finalization it built the isolated copy and passed 1 generated Chromium replay in 1.8 seconds. Recorded result: focus `solid`/`3px`/`none` with indicator detected; zero axe violations; confirmation reached.
- Failure: `baseGitCommit` was 40 characters, but the initial schema incorrectly required a 64-character SHA-256. Cleanup removed the disposable copy and the main source diff remained empty. The schema and atomic artifact ordering were corrected; the command was not rerun.
- Real partial ignored artifacts: `patch.diff` SHA-256 `3303f8d8556f2d7e752e058093472a25af542e40244249f026a8231888ae9ac6`; `replay.spec.ts` SHA-256 `8eced10a99c8785fcbceebc800ecbd4aa781b70895bad4fe08bdeb549c2dec7e`; `manual-review.md` SHA-256 `0c6a71ed05fde2ce9a3d9bb714973b292936ce6e5c3ba09c69e3545f197681b1`. `verification.json` and `patch-audit.json` are **NOT YET PRODUCED**.
- Corrected offline validation: exit `0`; 57 tests and type-check passed; the reviewed Phase 1B schemas, audit references, hashes, and policy passed; the partial patch passed deterministic patch policy; generated replay bytes matched the real artifact; manual-review claim boundaries were present.
- Final hygiene: `git diff --check` exit `0`; all-current-file trailing-whitespace, high-risk credential, and non-empty OpenAI/sensitive-ID scans each exited `1` with no matches across 70 files; all five Phase 1C output paths are ignored; no `.accesspatch` file is staged or tracked; no disposable copy remains; main fixture diff is empty.
- Scope: Phase 1C remains **PENDING / UNCOMMITTED**. No credential access, API call, main-fixture repair, report, complete Proof Bundle, remote, deployment, publication, or Phase 2 work occurred.

### Phase 1C Approved Corrected Rerun

- Preflight: expected Phase 1C working tree only; main source diff empty; all three reviewed Phase 1B hashes exact; evidence, plan, and audit schemas passed; audit references passed; repair policy accepted; 57 unit tests passed; type-check passed.
- Obsolete partial output: only `.accesspatch/runs/phase1c/` was removed; absence confirmed; Phase 1B hashes remained unchanged.
- Single approved rerun: `pnpm phase1:repair` exit `0`; no retry. Isolated replay passed 1 test in 2.6 seconds; focus was `solid`/`3px`/`none` with visible indicator; axe violations `0`; confirmation reached; original demo unchanged; cleanup removed the copy.
- Five artifact hashes: patch `3303f8d8556f2d7e752e058093472a25af542e40244249f026a8231888ae9ac6`; replay `8eced10a99c8785fcbceebc800ecbd4aa781b70895bad4fe08bdeb549c2dec7e`; verification `c85c56743496be7a615c4c3fc17c5c042c9cc431d20720eda62915ff6653b887`; audit `7086f12aa238e325565566797f1d73cc895b97e7acf3adb54a247f57e7a6d6a8`; manual review `0c6a71ed05fde2ce9a3d9bb714973b292936ce6e5c3ba09c69e3545f197681b1`.
- Offline result: verification and audit schemas passed; patch policy accepted exactly `App.tsx` and `styles.css`; replay contained no soft assertions and all required gates; audit sanitization passed; all artifacts remain ignored, unstaged, and untracked.
- Preserved main baseline: expected exit `1`, confirmation reached, only both controlled barriers failed, and axe returned one `label` violation targeting `#email`. Smoke exit `0`, 1 passed; build exit `0`, 16 modules transformed.
- Status: Phase 1C is **VALIDATED / UNCOMMITTED**. No API request, credential access, commit, push, remote, deployment, publication, complete Proof Bundle, or Phase 2 work occurred.

### Phase 1C Final Pre-Commit Correction and Regeneration

- Reviewed pre-correction hashes were exact: patch `3303f8d8556f2d7e752e058093472a25af542e40244249f026a8231888ae9ac6`; replay `8eced10a99c8785fcbceebc800ecbd4aa781b70895bad4fe08bdeb549c2dec7e`; verification `c85c56743496be7a615c4c3fc17c5c042c9cc431d20720eda62915ff6653b887`; audit `7086f12aa238e325565566797f1d73cc895b97e7acf3adb54a247f57e7a6d6a8`; manual review `0c6a71ed05fde2ce9a3d9bb714973b292936ce6e5c3ba09c69e3545f197681b1`.
- Isolation correction: audit strategy now says build output and test output are excluded, while source tests remain eligible. Manual copy excludes common credential paths and rejects included symlinks without following them. `.accesspatch/work/` is explicitly ignored.
- Unit coverage: 7 API-free cases added for 64 total; `.env.example`, ordinary source, and tests remain eligible; `.env*`, `.npmrc`, `.netrc`, key files, `secrets/`, generated outputs, and symlinks are handled as required. Final unit result before regeneration: 64 passed, 0 failed, 0 skipped.
- Offline gate: frozen install, exact-version scan, type-check, build, smoke, Phase 1B schemas/hashes/audit references/policy, main-source preservation, diff check, whitespace scan, and credential/sensitive-ID scans all passed.
- Single authorized regeneration: `pnpm phase1:repair` exit `0`; no retry. Isolated replay passed in 1.6 seconds; focus `solid`/`3px`/`none` was visible; axe violations `0`; confirmation reached; cleanup removed the copy; main source remained unchanged.
- Regenerated hashes: patch `3303f8d8556f2d7e752e058093472a25af542e40244249f026a8231888ae9ac6`; replay `8eced10a99c8785fcbceebc800ecbd4aa781b70895bad4fe08bdeb549c2dec7e`; verification `c85c56743496be7a615c4c3fc17c5c042c9cc431d20720eda62915ff6653b887`; audit `0e588e5975cc55a648bce92451c700af6303fca17503e35c19135fb45f3eea0b`; manual review `0c6a71ed05fde2ce9a3d9bb714973b292936ce6e5c3ba09c69e3545f197681b1`.
- Post-run: all JSON schemas passed; patch policy accepted exactly `App.tsx` and `styles.css`; four stable hashes were identical; the new audit contained the corrected strategy and no prohibited data. Baseline expected exit `1` with only both controlled barriers and one `label` target `#email`; smoke exit `0`; build exit `0`.
- Status at that gate: Phase 1C remained **VALIDATED / UNCOMMITTED**. Retained application, report viewer, rollback, broad repositories, clean-machine verification, complete Proof Bundle, publication, and submission remained open. No additional GPT-5.6 call occurred.

### Phase 1C Commit Gate

- `pnpm install --frozen-lockfile`: exit `0`; all 6 workspace projects were already up to date using pnpm `11.13.0`.
- Exact-version scan: no floating `latest` dependency specification.
- `pnpm audit --audit-level=high`: exit `0`; exact result `No known vulnerabilities found`.
- `pnpm licenses list --json`: exit `0`; valid license groups were Apache-2.0, BSD-3-Clause, ISC, MIT, and MPL-2.0.
- `pnpm test:unit`: exit `0`; 64 passed, 0 failed, 0 skipped.
- `pnpm typecheck`, `pnpm build`, and `pnpm test:smoke`: exit `0`; smoke passed 1 Chromium test.
- `pnpm test:baseline`: expected exit `1`; confirmation reached, only `CONTROLLED_BARRIER_EMAIL_NAME` and `CONTROLLED_BARRIER_FOCUS_VISIBLE` failed, and axe returned one `label` violation targeting only `#email`.
- Offline artifact gate: current schemas parsed, both deterministic policies accepted, Phase 1B and Phase 1C hashes were exact, the patch changed only `App.tsx` and `styles.css`, replay contained no soft assertion, and audit sanitization passed.
- Repaired result: axe violations `0`; focus `solid`/`3px`/`none` with visible indicator `true`; confirmation reached; original fixture unchanged; cleanup `removed`.
- Repository hygiene: diff, whitespace, credential, sensitive-ID, ignored/staged/tracked generated-artifact, and disposable-copy checks passed. No repair rerun, model call, or credential access occurred at the commit gate.
- Implementation commit: `79ed0e60b2c7145f4113ecac3797a119ccb696ee` (`feat: add isolated deterministic repair replay`). Phase 1C is **COMPLETE** for the controlled two-finding feasibility scope; the canonical Proof Bundle and broader product workflow remain open.

## Phase 2A Canonical Proof Bundle — 2026-07-15 (Complete)

- Starting gate: clean `main`; all eight reviewed Phase 1 hashes exact; evidence, plan, model audit, verification, and patch audit schemas passed; repair-plan and patch policies accepted.
- `pnpm install --frozen-lockfile`: exit `0`; all 7 workspaces already up to date in 487 ms with pnpm `11.13.0`. Exact-version scan found no `latest` specification.
- `pnpm audit --audit-level=high`: the sandboxed advisory request failed with `EAI_AGAIN`; the approved network-enabled rerun exited `0` with `No known vulnerabilities found`.
- `pnpm licenses list --json`: the sandboxed command returned an `ERR_SQLITE_ERROR` payload; the approved package-store-enabled rerun exited `0` with Apache-2.0, BSD-3-Clause, ISC, MIT, and MPL-2.0 groups and no new external dependency.
- `pnpm test:unit`: final exit `0`; 86 passed, 0 failed, 0 skipped. Phase 2A added 22 API-free cases. An earlier development run had 76 pass and 10 fail because a positive-claim regex also matched a negated report disclaimer; the detector was narrowed and all cases then passed.
- `pnpm typecheck`: exit `0` across the app, five packages, e2e tests, and unit tests. `pnpm build`: exit `0`; Vite transformed 16 modules in 243 ms.
- `pnpm test:smoke`: the sandboxed web server exited `1`; the approved rerun exited `0`, with 1 Chromium test passed in 4.0 seconds.
- `pnpm test:baseline`: expected exit `1`; confirmation reached; only `CONTROLLED_BARRIER_EMAIL_NAME` and `CONTROLLED_BARRIER_FOCUS_VISIBLE` failed; axe returned exactly one `label` violation targeting `#email`.
- Exactly one `pnpm phase2:bundle`: exit `0`; status `generated`, manifest `summary.json`, 15 generated files across the exact 11 top-level entries.
- `pnpm phase2:validate`: exit `0`; all 15 files passed schemas, inventory, policies, copied-byte hashes, CSV ordering, manifest, manual-review, HTML structure, and generated-content scans.
- `pnpm test:report`: the sandboxed Chromium launch failed before page load; the approved rerun exited `0`, 1 test passed in 2.0 seconds, skip-link focus passed, and `PHASE2_REPORT_AXE_VIOLATIONS=[]`.
- Before/after: before had two findings, one axe `label` violation for `#email`, no visible focus, and confirmation reached; isolated after evidence had zero axe violations, focus `solid`/`3px`/`none` with visible indicator `true`, and confirmation reached.
- Independent full-bundle review passed the source, generator, schemas, HTML, exact inventories, security controls, and all five packaged `test-results` files. The packaged test results accurately identify their Phase 1 source runs and do not claim Phase 2A re-execution. `wcag-map.csv` uses `UNMAPPED` rather than inventing criterion assignments.
- Reviewed hashes: `summary.json` `19613c7913a91ababb4fbe6cfe02cecc650006f9c80ccb46c18f10d6d9549906`; `audit-log.json` `ed2766d15d4ff5805b568b6d4a22d7def8ce464887a3d4ef366295b9cdcec361`; `findings.json` `a5f525321e120d4b75a57bad2677a0800ef6a86fd06094938ea2d6828e086a8c`; `journey-map.json` `8a08377c297a217297616725b0244d2c84f3dc9b74d5eca405fd069332fbecf5`; `repair-plan.json` `9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a`.
- Reviewed hashes: `patch.diff` `3303f8d8556f2d7e752e058093472a25af542e40244249f026a8231888ae9ac6`; `replay.spec.ts` `8eced10a99c8785fcbceebc800ecbd4aa781b70895bad4fe08bdeb549c2dec7e`; `report.html` `2e3ceeca44e004b9cecdf40d9e304e4918e8a6b3c18467ea2485056060e2e115`; `wcag-map.csv` `d38b4ffe10ac516b70ee2631f4c456f130463886559766fc304546fa106786af`; `manual-review.md` `0c6a71ed05fde2ce9a3d9bb714973b292936ce6e5c3ba09c69e3545f197681b1`.
- Reviewed hashes: `test-results/before-baseline.json` `381a7e969e5bf9ed0160f9df1cfbfafb55955525b00d4efa14c0e2ef0c9543b5`; `test-results/after-replay.json` `1d7ac030dc292fef6ffed764bbf198ecabb5387d5a1092587228775c8fca5209`; `test-results/verification.json` `c85c56743496be7a615c4c3fc17c5c042c9cc431d20720eda62915ff6653b887`; `test-results/model-audit.json` `3369c907622f0d6de9c0077e08ac50f28d8313803df213320570af6039e907c0`; `test-results/patch-audit.json` `0e588e5975cc55a648bce92451c700af6303fca17503e35c19135fb45f3eea0b`.
- Final commit gate: frozen install exited `0` in 537 ms; high-severity audit reported no known vulnerabilities; license inventory returned Apache-2.0, BSD-3-Clause, ISC, MIT, and MPL-2.0 groups; 86 unit tests passed in 1324.973819 ms; type-check, build (16 modules in 271 ms), smoke (1 passed in 3.8 seconds), bundle validation, and report smoke (1 passed in 2.0 seconds with zero axe violations) passed. The baseline retained its expected exit `1` with only the two controlled barriers.
- Status: **COMPLETE** in implementation commit `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`. Bundle remains ignored and unstaged; a tracked judge sample, clean-machine verification, and final judge workflow remain open. No API call, credential access, Phase 1 repair rerun, bundle regeneration during the commit gate, or source-fixture change occurred.

## Phase 2B Source-Backed WCAG Mapping — 2026-07-15 (Complete)

- Starting gate: clean `main`; all 15 reviewed Phase 2A hashes and all eight reviewed Phase 1 source hashes matched; current schemas, audit references, repair-plan policy, patch policy, and fixture-preservation checks passed.
- Official sources: W3C WCAG 2.2 normative criteria and informative Understanding documents were checked on 2026-07-15. Binding rows are email → `1.3.1` (A) and `4.1.2` (A), focus → `2.4.7` (AA). W3C’s Understanding 3.3.2 distinction supports explicitly excluding `3.3.2` for the already-visible email text.
- `pnpm install --frozen-lockfile`: exit `0`; all 7 workspaces current in 439 ms. Exact-version scan found no `latest` specifications. `pnpm audit --audit-level=high`: exit `0`, no known vulnerabilities. `pnpm licenses list --json`: exit `0`, Apache-2.0, BSD-3-Clause, ISC, MIT, and MPL-2.0 groups.
- `pnpm test:unit`: exit `0`; 98 passed, 0 failed, 0 skipped in 984.58025 ms. Phase 2B added 12 API-free tests and strengthened existing CSV/report coverage. `pnpm typecheck`: exit `0`. `pnpm build`: exit `0`, 16 modules in 276 ms. `pnpm test:smoke`: exit `0`, 1 passed in 3.6 seconds.
- Offline gates: Phase 1 schemas, audit references, repair and patch policies passed; `git diff --check`, whitespace, credential, OpenAI-key, sensitive-ID, and fixture-diff checks passed. An initial combined hygiene wrapper had a shell-quoting syntax error before executing its checks; the corrected wrapper passed and no generation occurred during that failed wrapper.
- Regeneration: the 15 archived Phase 2A hashes were rechecked immediately before removal; only `.accesspatch/runs/phase2/proof-bundle/` was removed. Exactly one authorized `pnpm phase2:bundle` exited `0`; no retry occurred.
- Post-run: `pnpm phase2:validate` exited `0` with 15 files. `pnpm test:report` exited `0`, 1 passed in 2.3 seconds, and `PHASE2_REPORT_AXE_VIOLATIONS=[]`. Inventory is exactly 11 top-level entries and 15 files; CSV has exactly three mapping rows; all structured files, official URLs, report links, manifest hashes, privacy scans, cleanup, ignore status, and claim boundaries passed. No `UNMAPPED` value remains.
- Independent review: complete source, schema, WCAG-source, CSV, HTML, inventory, manifest, security, and all-15-artifact review passed. All copied Phase 1 artifacts remained byte-identical.
- New hashes: `summary.json` `0ee0e7da1f141a95a897e6d3f57dc427443a11fc9f58d3ccabbf192664b50b80`; `audit-log.json` `02ec294b7870d27a91d2dc8ba98e2dff5dac1c64d1e9cb569df446222d3b7551`; `findings.json` `4e932780223584f14512d7fac593b188bf113778bac95756e418eb38aebd2e32`; `journey-map.json` `8a08377c297a217297616725b0244d2c84f3dc9b74d5eca405fd069332fbecf5`; `repair-plan.json` `9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a`.
- New hashes: `patch.diff` `3303f8d8556f2d7e752e058093472a25af542e40244249f026a8231888ae9ac6`; `replay.spec.ts` `8eced10a99c8785fcbceebc800ecbd4aa781b70895bad4fe08bdeb549c2dec7e`; `report.html` `f32888eb7b712d151bf140c95e76e98e6bb0ef98818b9f4e8f6231dfa1c45369`; `wcag-map.csv` `4d933d0aa5494a581f7b025459b08b2ef7f8e4eb76ce92de423168570eeae49c`; `manual-review.md` `0c6a71ed05fde2ce9a3d9bb714973b292936ce6e5c3ba09c69e3545f197681b1`.
- New hashes: `test-results/before-baseline.json` `381a7e969e5bf9ed0160f9df1cfbfafb55955525b00d4efa14c0e2ef0c9543b5`; `test-results/after-replay.json` `1d7ac030dc292fef6ffed764bbf198ecabb5387d5a1092587228775c8fca5209`; `test-results/verification.json` `c85c56743496be7a615c4c3fc17c5c042c9cc431d20720eda62915ff6653b887`; `test-results/model-audit.json` `3369c907622f0d6de9c0077e08ac50f28d8313803df213320570af6039e907c0`; `test-results/patch-audit.json` `0e588e5975cc55a648bce92451c700af6303fca17503e35c19135fb45f3eea0b`.
- Commit gate: frozen install, no-`latest` scan, high-severity audit, license inventory, 98-test suite, type-check, build, smoke, expected two-barrier baseline, bundle validation, zero-violation report smoke, hash/inventory/mapping/report checks, diff, whitespace, and secret scans all passed without regenerating the bundle.
- Status: **COMPLETE** in implementation commit `e3811c8bf968dc78701f8d264dc1377543059d64`. Generated output remains ignored and unstaged. No API call, credential access, reasoner run, repair run, fixture change, tracked judge sample, publication, or later-phase work occurred.

## Phase 2C Curated Judge Sample — 2026-07-15/16 (Complete)

- Preflight: clean `main`, no remote, deliberately broken controlled fixture, no tracked generated bundle, exact 11-entry/15-file ignored inventory, all 15 reviewed hashes, canonical bundle validation, and report smoke passed. Chromium initially hit the filesystem sandbox’s socket restriction; the same approved local smoke passed outside the sandbox with zero axe violations.
- Copy: `.accesspatch/runs/phase2/proof-bundle/` was copied once into `examples/judge-sample/proof-bundle/` without regeneration or editing. `README.md` and deterministic `SHA256SUMS` remain outside the canonical bundle.
- Tooling: `pnpm judge:sample:validate` reads only tracked sample files and reports 15 files, two findings, three mappings, passed manifest/policy/security gates, and `JUDGE_SAMPLE_VALID`. The shared browser helper supports both ignored and tracked reports.
- Final API-free suite after sanitized-error hardening: 16 new tests; 114 total passed, 0 failed or skipped, in 1048.777374 ms. Type-check passed. Build passed with 16 modules in 186 ms.
- Browser checks: smoke passed, 1 test in 2.7 seconds. The baseline returned expected exit `1`, reached confirmation, and reported only `CONTROLLED_BARRIER_EMAIL_NAME`, `CONTROLLED_BARRIER_FOCUS_VISIBLE`, and one axe `label` violation targeting `#email`. The ignored report smoke passed in 2.4 seconds and the tracked report smoke passed in 1.6 seconds; both logged zero axe violations.
- Dependency checks: frozen install exited `0`, all seven workspaces current in 434 ms; no `latest` specification. The first sandboxed audit attempt stopped on registry DNS `EAI_AGAIN`; the approved network retry reported no known vulnerabilities. License groups were Apache-2.0, BSD-3-Clause, ISC, MIT, and MPL-2.0.
- Integrity and hygiene: both validators passed; all 15 checksum entries passed; recursive byte and inventory comparisons found no differences; no secret, non-empty OpenAI key, sensitive ID, absolute-path leak, unsupported claim, unsafe link, symlink, special file, or temporary directory was found. The only trailing-space matches are three required unified-diff context markers in the reviewed byte-identical `patch.diff` at lines 5, 21, and 28.
- Final commit gate: frozen install exited `0` in 590 ms; high-severity audit found no known vulnerabilities; license groups were Apache-2.0, BSD-3-Clause, ISC, MIT, and MPL-2.0. Final API-free suite passed 114 tests in 1401.055396 ms; type-check passed; build passed with 16 modules in 256 ms; smoke passed in 3.4 seconds; the expected baseline exited `1`; both report smokes passed in 2.2 seconds with zero axe violations.
- Judge Sample contract: exactly 17 tracked files—`README.md`, `SHA256SUMS`, and 15 Proof Bundle files. `SHA256SUMS` has 15 lowercase, deterministic, safe relative entries. The manifest has 14 non-circular entry hashes and excludes `summary.json`. Recursive `diff -qr --no-dereference` returned exit `0` with no output, and validation changed neither bytes nor mtimes.
- Validator output: `JUDGE_SAMPLE_PATH=examples/judge-sample/proof-bundle`; `JUDGE_SAMPLE_FILE_COUNT=15`; `JUDGE_SAMPLE_FINDING_COUNT=2`; `JUDGE_SAMPLE_WCAG_MAPPING_COUNT=3`; `JUDGE_SAMPLE_MANIFEST=passed`; `JUDGE_SAMPLE_POLICY=passed`; `JUDGE_SAMPLE_SECURITY=passed`; `JUDGE_SAMPLE_VALID`.
- Reviewed hashes: `summary.json` `0ee0e7da1f141a95a897e6d3f57dc427443a11fc9f58d3ccabbf192664b50b80`; `audit-log.json` `02ec294b7870d27a91d2dc8ba98e2dff5dac1c64d1e9cb569df446222d3b7551`; `findings.json` `4e932780223584f14512d7fac593b188bf113778bac95756e418eb38aebd2e32`; `journey-map.json` `8a08377c297a217297616725b0244d2c84f3dc9b74d5eca405fd069332fbecf5`; `repair-plan.json` `9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a`.
- Reviewed hashes: `patch.diff` `3303f8d8556f2d7e752e058093472a25af542e40244249f026a8231888ae9ac6`; `replay.spec.ts` `8eced10a99c8785fcbceebc800ecbd4aa781b70895bad4fe08bdeb549c2dec7e`; `report.html` `f32888eb7b712d151bf140c95e76e98e6bb0ef98818b9f4e8f6231dfa1c45369`; `wcag-map.csv` `4d933d0aa5494a581f7b025459b08b2ef7f8e4eb76ce92de423168570eeae49c`; `manual-review.md` `0c6a71ed05fde2ce9a3d9bb714973b292936ce6e5c3ba09c69e3545f197681b1`.
- Reviewed hashes: `test-results/before-baseline.json` `381a7e969e5bf9ed0160f9df1cfbfafb55955525b00d4efa14c0e2ef0c9543b5`; `test-results/after-replay.json` `1d7ac030dc292fef6ffed764bbf198ecabb5387d5a1092587228775c8fca5209`; `test-results/verification.json` `c85c56743496be7a615c4c3fc17c5c042c9cc431d20720eda62915ff6653b887`; `test-results/model-audit.json` `3369c907622f0d6de9c0077e08ac50f28d8313803df213320570af6039e907c0`; `test-results/patch-audit.json` `0e588e5975cc55a648bce92451c700af6303fca17503e35c19135fb45f3eea0b`.
- Independent review passed source, validator, tests, tracked sample, manifest, report, security, inventory, and byte identity. The Judge Sample is the only explicitly allowlisted tracked generated evidence.
- Status: **COMPLETE** in implementation commit `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce`. No API call, credential access, reasoner run, repair run, bundle regeneration, fixture change, remote, deployment, publication, or final judge workflow occurred.

## Phase 3A Judge Workflow — 2026-07-16 (Complete)

- Preflight: clean Phase 2C base, no remote, exactly 17 tracked sample files, exact 15 Proof Bundle hashes, deliberately broken fixture, sample validator pass, and tracked report smoke pass with `JUDGE_SAMPLE_REPORT_AXE_VIOLATIONS=[]`.
- Dependencies: `pnpm install --frozen-lockfile` exited `0` in 452 ms; exact-version scan passed; lockfile unchanged. `pnpm audit --audit-level=high` reported no known vulnerabilities. License inventory groups: Apache-2.0, BSD-3-Clause, ISC, MIT, MPL-2.0.
- New tests: 25 API-free tests; final offline suite 139 passed, 0 failed or skipped. Type-check passed.
- Build and smoke: production build passed with 16 modules in 339 ms; application smoke passed, 1 test in 4.6 seconds.
- Developer baseline: `pnpm test:baseline` returned the expected exit `1`, reached confirmation, and produced exactly two soft assertion errors: `CONTROLLED_BARRIER_EMAIL_NAME` and `CONTROLLED_BARRIER_FOCUS_VISIBLE`. Axe returned only `label` targeting `#email`.
- Judge baseline: `pnpm test:judge-baseline` passed. Product, cart, checkout, and form gates passed; focus was `outlineStyle=none`, `outlineWidth=3px`, `boxShadow=none`, visible `false`; exactly the two controlled finding IDs and one `label` target `#email` were confirmed; confirmation was reached.
- Tracked evidence: `pnpm judge:sample:validate` passed with 15 files, two findings, three mappings, and passed manifest/policy/security. `pnpm test:judge-sample-report` passed with zero axe violations.
- Hygiene: diff check passed; the only all-file trailing spaces remain the three reviewed unified-diff context lines in tracked `patch.diff`; credential, non-empty OpenAI key, sensitive-ID, new absolute-path, unsupported-claim, and fixture-diff scans passed.
- Single full execution: `.accesspatch/runs/` was safely moved outside the repository and exactly one `pnpm judge:verify` command was run. Preflight passed. Stage 2 ran 135 tests: 104 passed and 31 proof-bundle tests failed because their fixture setup read ignored Phase 1 source artifacts. The workflow exited `1` with `JUDGE_WORKFLOW_INVALID=judge_workflow_stage_failed`. No success summary was emitted and no retry occurred.
- Post-failure correction: proof-bundle tests now reconstruct the reviewed evidence byte-for-byte from tracked `findings.json` plus fixed reviewed metadata and verify SHA-256 `cc61b701c94fbd6653fa1d8ee8e05e30791761544c4fe0576771532c36a925c2`; the other source bytes come directly from tracked Judge Sample files. Independent corrected-source review archive SHA-256 `2f328fbe97d1088945ba9291b8669f5bdd768137196b800356a779ba535df7a5` passed this correction.
- Runtime-configuration correction: that review identified incomplete home-configuration isolation. Pending code now creates empty restricted `gitconfig` and `npmrc` files below `.accesspatch/work/judge-verify/runtime-config/` before preflight. Git disables system/global home configuration, prompts, and interactive credential handling. npm/pnpm user and global configuration are redirected; automatic dependency verification, update notification, audit, and funding behavior are disabled. Fake-home Git and pnpm marker queries were not observed, and cleanup passed after success simulation, child-stage failure, and preflight failure.
- Corrected offline result: the 139-test suite passed with `.accesspatch/runs/` absent; the directory was restored unchanged afterward.
- Preservation: before and after comparisons confirmed all 17 Judge Sample hashes and nanosecond mtimes unchanged, all 23 ignored-run file hashes unchanged, controlled fixture unchanged, and `.accesspatch/work/judge-verify` removed.
- Final pre-run review: archive `accesspatch-phase3a-final-prerun-review-2026-07-16.tar.gz`, SHA-256 `1e458514f2737234765705a7063afa8658c8e887233a727d91e45eb05c2ec9b9`, found no remaining source blocker.
- Corrected full execution: the second lifetime `pnpm judge:verify` run executed exactly once and exited `0`; no retry and no third lifetime execution occurred. `.accesspatch/runs/` was absent throughout. All eight `JUDGE_STAGE_START` and eight corresponding `JUDGE_STAGE_PASS` lines appeared exactly once.
- Workflow results: 139 unit tests passed; type-check, build, smoke, controlled Judge baseline, tracked sample validator, and tracked report smoke passed. Baseline focus was `none` / `3px` / `none` / `false`; exactly `CONTROLLED_BARRIER_EMAIL_NAME` and `CONTROLLED_BARRIER_FOCUS_VISIBLE` were reproduced; axe returned only `label` targeting `#email`; confirmation was reached; report axe violations were `0`.
- Stable output: `JUDGE_WORKFLOW_SAMPLE_PATH=examples/judge-sample/proof-bundle`; `JUDGE_WORKFLOW_FINDINGS=2`; `JUDGE_WORKFLOW_WCAG_MAPPINGS=3`; `JUDGE_WORKFLOW_BASELINE=expected-controlled-defects-confirmed`; `JUDGE_WORKFLOW_REPAIRED_EVIDENCE=validated`; `JUDGE_WORKFLOW_REPORT_AXE_VIOLATIONS=0`; `JUDGE_WORKFLOW_SECURITY=passed`; `JUDGE_WORKFLOW_VALID`.
- Final preservation: all 23 ignored-run hashes were restored unchanged; all 17 Judge Sample hashes and mtimes and all 15 Proof Bundle hashes remained unchanged; runtime configuration and workflow output were absent; controlled fixture and tracked bytes were unchanged.
- Status: **COMPLETE** in implementation commit `84db92f9e27b6f7872495516f166a8bcaed8ef03`. Clean-machine and broader-platform verification remain separate future phases.

## Phase 3B Clean-Clone Verification — 2026-07-16 (Complete)

- Source gate: source HEAD `7d0653cd344cf15be448ed9ef62b41b74c0d67ef`, clean source tree and index, no remote, 17 tracked Judge Sample files, all 15 approved Proof Bundle hashes, deliberately broken controlled fixture, and no tracked ignored-run output.
- Clone method: `git clone --no-hardlinks --no-tags` from local committed Git history into a unique isolated temporary root. The clone began without `node_modules`, `.accesspatch/runs/`, `.accesspatch/work/`, build output, Playwright output, or untracked files.
- Environment: Debian GNU/Linux 13, x86_64, Node.js 24.18.0, pnpm 11.13.0, Git 2.47.3, Chromium 148.0.7778.178. Git and npm/pnpm user/system configuration, cache, state, home, and temporary directories were isolated.
- Installation: `pnpm install --frozen-lockfile` ran exactly once and exited `0`; no retry occurred. Registry access was required and transient retry warnings appeared. The lockfile and tracked files remained unchanged.
- Workflow: `pnpm judge:verify` ran exactly once in the clean clone and exited `0`; no retry occurred. This was lifetime workflow execution number 3. All eight stages passed exactly once, 139 API-free tests passed, the controlled two-finding baseline was reproduced, Judge Sample validation passed, and tracked report axe violations were zero.
- Stable output: `JUDGE_WORKFLOW_SAMPLE_PATH=examples/judge-sample/proof-bundle`; `JUDGE_WORKFLOW_FINDINGS=2`; `JUDGE_WORKFLOW_WCAG_MAPPINGS=3`; `JUDGE_WORKFLOW_BASELINE=expected-controlled-defects-confirmed`; `JUDGE_WORKFLOW_REPAIRED_EVIDENCE=validated`; `JUDGE_WORKFLOW_REPORT_AXE_VIOLATIONS=0`; `JUDGE_WORKFLOW_SECURITY=passed`; `JUDGE_WORKFLOW_VALID`.
- Isolation and preservation: `.accesspatch/runs/` remained absent; the workflow monitor observed no external TCP connection; all 17 Judge Sample hashes and mtimes remained unchanged; runtime workflow output was removed; temporary clone and isolated configuration were deleted; source and clone Git states remained clean.
- Archive correction: the original evidence archive SHA-256 `e0a6c85be3daa95e771c6f04f498f4f02b245d306cc93827ba47e595f7f9389d` had sanitized contents but retained local owner/group names in TAR headers. The contents were repackaged byte-identically with neutral numeric metadata. Independent review passed the sanitized archive SHA-256 `27ac06541e02d3bfd554581beafaca4541dc8953316a6a5e4acc0572c5bdf0fd`.
- Tracked evidence: `docs/hackathon/evidence/phase3b-clean-clone/`; archive and extracted files are protected by deterministic `SHA256SUMS`.
- File hashes: `clean-clone-file-inventory.txt` `4e5109ae400b3fb60498d4a61a2d98ee1b9e9c85a42a81e69f78da7e914e6fe5`; `clean-clone-git-status.txt` `adb2f78b5fbda6c14be71a5d1bd1f4c0c072c90aa378fbfb56ea1e68c4d99117`; `cleanup-summary.txt` `7b47cc937f61ac736df55fcfb89913c72f10db80f6db25efae6539f0cdcb6e73`.
- File hashes: `clone-preflight.txt` `ce089884e52c1c1704fdce70f797705fecab18961227968996a4509c5cc17beb`; `environment-summary.txt` `11135cb35e9267cd04f70d87d11901e00201df680099c7df0d2a7eb309010aed`; `install-exit-status.txt` `d45dd1d3494b9dc069bc6fd9ea0dfb7695a42b09ae3cbf418d07904d2d89c3ec`; `install-output.txt` `efd42ea9e74a76d695e80eb4c26cd9baab46c1f7a69cb46c0d3fd8042733906b`.
- File hashes: `judge-final-summary.txt` `182b5cab53f71bca84f8ec6c38f0b90c8d0d8bb0458742c14798b2fa850a2f9f`; `judge-sample-sha256.txt` `1227d3f1e8049eeac7858dd95be78273e4771f6c7c6323061291a906aefc2023`; `judge-stage-summary.txt` `af910459165be3035d81585335f3ff1fea202955cd29a9561f76f6cd827fdd3f`.
- File hashes: `judge-workflow-exit-status.txt` `330039a9ddb8754b8899d75054d665f4999bf0fce8c300f4af022ca9b64ded1f`; `judge-workflow-output.txt` `0cd3b91af65014519a114a17e84eba8c4ffc0b23d6b61b291c65432d8ae5aae3`; `security-scan-summary.txt` `29859515a778bed889a4ae1f9d367c54d2572f740cd943c447104a130fdce6d6`.
- Final commit gate: independent review passed the exact 16-file evidence directory, all 14 checksum entries, archive metadata and byte identity, supported governance claims, and the unchanged eight checklist selections. The archive content remained SHA-256 `27ac06541e02d3bfd554581beafaca4541dc8953316a6a5e4acc0572c5bdf0fd` while its tracked mode was corrected to non-executable `100644`.
- Status: **COMPLETE** in evidence commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed`. No installation, Judge Workflow, API call, credential access, reasoner run, repair run, bundle generation, implementation change, fixture repair, push, remote, deployment, publication, or video occurred during evidence integration.

## Future Evidence Standard

Each test record must include date, commit, environment, exact command, exit status, relevant output, artifact location, and known limitations. Accessibility evidence must distinguish automated signals from disabled-user testing and qualified human review. It must not be presented as complete accessibility, WCAG certification, or BFSG/EAA legal assurance.
