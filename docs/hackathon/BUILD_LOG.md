# Build Log

## 2026-07-15 — Phase 0 Documentation Foundation

- Phase goal: establish a concise, evidence-first documentation and submission-control foundation without implementing the product.
- Codex assignment: inspect the minimal baseline and environment; create and then correct the requested Phase 0 records; preserve honest status, security, evidence, and submission boundaries.
- Baseline: clean `main`, no remote, and minimal three-line README commit `0ac10988053a301c89689b8ce8fbd7e6aecd481f`.
- Environment: Node.js `v24.18.0`, npm `11.16.0`, pnpm `11.13.0`, Git `2.47.3`, Codex CLI `0.144.4`.
- Central session: started 2026-07-15 at 14:11 Europe/Berlin; Codex model `gpt-5.6-sol`, reasoning `high`.
- Files changed: `README.md`, `AGENTS.md`, `.gitignore`, `.env.example`, and the 14 requested files under `docs/hackathon/`.
- Validation: `git diff --check` exited `0` with no output; the all-file trailing-whitespace and selected high-risk secret-pattern `rg` commands each exited `1` with no matches; the forbidden-scaffold `find` command exited `0` with no output; `git status --short` exited `0` and showed only `README.md` modified plus `.env.example`, `.gitignore`, `AGENTS.md`, and `docs/` untracked.
- Foundation commit status: **COMPLETED**.
- Phase 0 foundation commit: `bbabb9207b0f7ae92b8262b2e02930511dd81521` (`docs: establish Phase 0 hackathon controls`).
- Known issues: no application exists; product GPT-5.6 integration and validation remain unimplemented; `/feedback` Session ID is pending; official Rules-page body appears stale; repository, license, video, demo, and URLs do not exist.
- Next task: after explicit approval, define the minimal Phase 1 architecture and daily time recalculation; do not implement during Phase 0 correction.

## 2026-07-15 — Final Checklist and Proof Contract Correction

- Goal: align the Phase 0 archive with the binding handoff by expanding readiness checks and fixing the planned MVP Proof Bundle inventory.
- External review: an independent full-file archive review reported that structure, secret hygiene, unsupported-claim handling, and scope control passed, while checklist granularity and Proof Bundle inventory remained insufficient. The reviewer did not execute repository commands as part of this record.
- Codex correction: expanded every required submission gate into its own unchecked checkbox; added the canonical 11-output Proof Bundle contract and preservation rules; linked the checklist and contract from the ledger and README.
- Files changed in this correction: `README.md`, `SUBMISSION_CHECKLIST.md`, `DEMO_EVIDENCE.md`, `SUBMISSION_LEDGER.md`, `BUILD_LOG.md`, `AI_CONTRIBUTION_LOG.md`, and `TEST_EVIDENCE.md`.
- Codex repository validation: `git diff --check` exited `0`; all-file whitespace and selected high-risk secret scans exited `1` with no matches; forbidden-scaffold inventory exited `0` with no files; checked-checkbox scan exited `1` with no matches; all 11 canonical Proof Bundle names appeared exactly once; `git status --short` exited `0`. Exact commands and output are in `TEST_EVIDENCE.md`.
- Foundation commit status: **COMPLETED**; included in `bbabb9207b0f7ae92b8262b2e02930511dd81521`.
- Governance-record update: the following small commit uses subject `docs: record Phase 0 completion`; its own hash is intentionally not embedded in the commit it creates.

## Phase 0 Commit Record

- Original minimal baseline: `0ac10988053a301c89689b8ce8fbd7e6aecd481f` (`chore: document initial hackathon repository`).
- Phase 0 documentation foundation: `bbabb9207b0f7ae92b8262b2e02930511dd81521` (`docs: establish Phase 0 hackathon controls`).
- Governance-record follow-up: the next commit with subject `docs: record Phase 0 completion`; inspect Git history for its hash.
- Scope: Phase 0 documentation is complete. Product implementation and all previously recorded open risks remain unchanged.

## 2026-07-15 — Human-Supervised GPT-5.6 Access Verification

- Setup: dedicated OpenAI API project `AccessPatch Build Week`, restricted to `gpt-5.6-sol`, with a project-scoped development key stored outside the repository.
- Least privilege: model listing read, `/v1/responses` write, and all other endpoint groups disabled.
- Cost controls: USD 5 prepaid balance and auto recharge disabled.
- Evidence: the pre-credit request returned HTTP `429` with `insufficient_quota`; after credit, the Responses API returned HTTP `200`, status `completed`, and exact visible output `ACCESSPATCH_API_OK` using `store: false`.
- Usage: 16 input tokens, 8 output tokens, 0 reasoning tokens, 24 total tokens.
- Scope boundary: this was a minimal access-verification call, not the AccessPatch Evidence-Based Repair Reasoner. Product integration, schema and deterministic safety validation, privacy-conscious audit logging, fallback behavior, and a reproducible repair-plan demo remain **NOT YET IMPLEMENTED**.

## 2026-07-15 — Phase 1A Controlled Demo Baseline

- Goal: create one local checkout fixture and a reproducibly failing keyboard journey with exactly two deliberate accessibility barriers.
- Architecture: pnpm workspace; React `19.2.7`; React DOM `19.2.7`; TypeScript `7.0.2`; Vite `8.1.4`; Playwright `1.61.1`; `@axe-core/playwright` `4.12.1`; Chromium-only browser scope.
- Reproducibility correction: direct manifest and lockfile importer specifications use those exact versions; no resolved package changed.
- Browser selection: explicit `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, otherwise existing `/usr/bin/chromium`, otherwise Playwright-managed Chromium. The verified local path is `/usr/bin/chromium`; `pnpm browser:install` installs only Chromium for a clean machine. Clean-install and cross-platform verification remain pending.
- Created: root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `playwright.config.ts`, and `pnpm-lock.yaml`; the `apps/demo-checkout/` fixture; and both specs plus TypeScript configuration under `tests/e2e/`.
- Controlled barriers: the visible email text is not programmatically associated with its input; the primary continue button removes outline and box-shadow focus styling. Both source locations warn against production reuse.
- Form instruction: visible text states that all fields are required, the form references it with `aria-describedby`, and the country field is consistently required; the two deliberate barriers remain unchanged.
- `pnpm install`: initial exit `0` with 31 packages added; pre-commit correction rerun exit `0`, already up to date, with no resolved version change.
- `pnpm typecheck`: exit `0`.
- `pnpm build`: exit `0`; Vite production build completed.
- `pnpm test:smoke`: the first sandboxed attempt exited `1` because local listen was denied with `EPERM`; the approved local-server rerun exited `0` with 1 Chromium test passed. This was an execution-sandbox constraint, not an application defect.
- `pnpm test:baseline`: expected exit `1`; one test reached confirmation and reported exactly the empty email accessible name plus absent visible focus cue. Axe returned only `label`, impact `critical`, target `#email`.
- Final dependency gates: `pnpm install --frozen-lockfile` exited `0`; `pnpm audit --audit-level=high` exited `0` with `No known vulnerabilities found`; `pnpm licenses list --json` exited `0` after an initial sandbox-cache error and identified every installed dependency license.
- Direct license result: MIT, Apache-2.0, or MPL-2.0 only; no direct dependency had a missing or unknown license, and no GPL/AGPL direct dependency was present. The expected MPL-2.0 package is `@axe-core/playwright`.
- OpenAI: no credential file was read and no API or GPT-5.6 model call was made in this task.
- Remaining: structured evidence model, repair plan, patch generation, replay artifact, report, and Proof Bundle are **NOT YET IMPLEMENTED**.
- Implementation commit: **COMPLETE** — `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf` (`feat: add controlled checkout baseline`).

## 2026-07-15 — Phase 1B Structured Evidence and Repair Reasoner

- Goal: collect reproducible evidence for exactly the two Phase 1A barriers and obtain one bounded, schema-valid, deterministically approved repair plan without generating or applying a patch.
- Architecture: added `packages/shared-types/`, `packages/evidence-collector/`, and `packages/repair-reasoner/`; direct additions are OpenAI SDK `6.47.0` and Zod `4.4.3`, specified exactly and locked.
- Evidence: `pnpm phase1:evidence` completed the real keyboard journey and wrote ignored schema `1.0.0` evidence with exactly `CONTROLLED_BARRIER_EMAIL_NAME` and `CONTROLLED_BARRIER_FOCUS_VISIBLE`; axe contained one `label` violation targeting only `#email`.
- Bounded context: only allowlisted excerpts from `apps/demo-checkout/src/App.tsx` and `apps/demo-checkout/src/styles.css` were included, capped at 1,200 characters per finding; no complete source file, environment value, Git metadata, or unrelated documentation was sent.
- Reasoner: one approved `gpt-5.6-sol` Responses API call used `responses.parse`, `zodTextFormat`, low reasoning, `store: false`, no tools, and SDK retries disabled. Status was `completed`; usage was 1,649 input, 795 output, 0 reasoning, and 2,444 total tokens.
- Result: schema validation and deterministic policy validation accepted exactly two low-risk strategies: associate the existing email label in `App.tsx`, and restore the controlled focus indicator in `styles.css`. The result contains no code, patch, command, dependency request, legal claim, or unrelated redesign.
- Provenance: evidence SHA-256 `cc61b701c94fbd6653fa1d8ee8e05e30791761544c4fe0576771532c36a925c2`; plan SHA-256 `9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a`; sanitized audit timestamp `2026-07-15T15:10:53.264Z`.
- Validation: frozen install, exact-version scan, high-severity audit, license inventory, 21 offline unit/policy tests, type-check, build, smoke, evidence collection, and the preserved intentional baseline were run; exact results are in `TEST_EVIDENCE.md`.
- Scope: no demo source repair, patch generation or application, replay, report, Proof Bundle, remote, deployment, or publication occurred.
- Implementation commit: **COMPLETE** — `207e0559d0d7664a24dcb297fb40b37700f36208` (`feat: add bounded evidence repair reasoner`).
- Next task: wait for explicit approval before any controlled patch or Phase 1C work.

### Phase 1B Pre-Commit Hardening

- Independent artifact review: the supplied review passed the actual evidence, repair plan, and sanitized audit for secret hygiene, privacy, unsupported claims, and internal consistency. Reviewed SHA-256 values are evidence `cc61b701c94fbd6653fa1d8ee8e05e30791761544c4fe0576771532c36a925c2`, plan `9071ab61c85a36a10634efd4e3f6cfc90cdd213faf4907d5b566ef5848b8d77a`, and audit `3369c907622f0d6de9c0077e08ac50f28d8313803df213320570af6039e907c0`.
- Schema hardening: controlled IDs now require their exact fix class, selector, source hint, matching source-context file, and correct metadata; the source allowlist must contain both files exactly once.
- Containment hardening: bounded source reads use portable relative-path and realpath checks, reject symlink escape and complete-file selection, and retain the 1,200-character limit.
- Policy hardening: representative unwrapped CSS, selector blocks, JSX attributes, and JavaScript/TypeScript assignment expressions are rejected while the reviewed prose-only plan remains accepted.
- Model hardening: a completed response must return exactly `gpt-5.6-sol`; mismatch removes stale plan output, records sanitized `unexpected_model`, and fails closed.
- Tests: 17 API-free cases added, increasing the unit suite from 21 to 38; all 38 pass, including the real symlink-escape test on this environment.
- Scope: no second API call, demo repair, patch, replay, report, or Proof Bundle was produced. Phase 1B is **COMPLETE** in `207e0559d0d7664a24dcb297fb40b37700f36208`.
