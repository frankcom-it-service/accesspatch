# Decision Record

## D-001 — Preserve the Minimal Baseline

- Date: 2026-07-15
- Decision: treat root commit `0ac10988053a301c89689b8ce8fbd7e6aecd481f` as the minimal initial README baseline, not an empty commit.
- Reason: it proves the project began with only a three-line README.

## D-002 — Select Developer Tools

- Date: 2026-07-15
- Decision: Developer Tools is the current selected Build Week track.

## D-003 — Bounded Model Reasoning

- Date: 2026-07-15
- Decision: bound GPT-5.6 to the Evidence-Based Repair Reasoner role. Its structured proposals must be grounded in collected evidence and pass schema validation plus deterministic safety checks before any future application step.
- Status: implemented for the two controlled findings in Phase 1B commit `207e0559d0d7664a24dcb297fb40b37700f36208`; broader repair support remains open.

## D-004 — Fix Internal Delivery Targets

- Date: 2026-07-15
- Decision: feature freeze is 2026-07-20 at 02:00 CEST; submission-ready target is 2026-07-21 at 02:00 CEST; reserve the final 24 hours before the current 2026-07-22 at 02:00 CEST deadline for fixes and submission work.
- Discipline: recalculate remaining time at the beginning of each project day.

## D-005 — Keep Official-Source Inconsistency Open

- Date: 2026-07-15
- Decision: use requirements confirmed by the current FAQ, overview, and announcement, while treating the official Rules-page body describing an older 2025 event as an open inconsistency.
- Consequence: perform a fresh official-source and Rules-page check immediately before submission.

## D-006 — Central Codex Session and Optional Devpost Support

- Date: 2026-07-15
- Decision: Codex is the principal engineering tool and this continuing session is the intended central development session. Use the optional Devpost Hackathon plugin only for submission support, with human review; it never substitutes for the engineering session.

## D-007 — Evidence Before Claims

- Date: 2026-07-15
- Decision: public claims require reproducible evidence recorded in the submission ledger.
- Reason: prevent fabricated, stale, or broader-than-tested claims.

## D-008 — Least-Privilege API and Cost Controls

- Date: 2026-07-15
- Decision: use dedicated project `AccessPatch Build Week`, restrict it to `gpt-5.6-sol`, allow only model-list read and Responses write, and disable all other endpoint groups.
- Cost limit: start with USD 5 prepaid credit and keep auto recharge disabled.
- Secret handling: keep the project-scoped key outside the repository in the user-private configuration directory; never record its value or sensitive platform identifiers.
- Scope: the successful minimal access test does not establish product integration or repair quality.

## D-009 — Controlled Phase 1A Fixture

- Date: 2026-07-15
- Decision: use a pnpm TypeScript workspace with one React/Vite checkout fixture and Chromium-only Playwright tests.
- Deliberate scope: seed exactly two high-confidence barriers—missing email accessible name and missing primary-action focus indicator—and reject unrelated axe findings.
- Evidence boundary: capture the checkout axe result as structured test attachment only; do not implement the AccessPatch analyzer or Proof Bundle yet.
- Dependency boundary: use no UI framework or remotely loaded asset; pin resolved packages through `pnpm-lock.yaml`.
- Reproducibility: use exact direct dependency specifications matching the lockfile.
- Browser resolution: prefer `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, then an existing `/usr/bin/chromium`, then Playwright-managed Chromium; install only Chromium with `pnpm browser:install` on a clean machine.

## D-010 — Phase 1B Evidence and Reasoner Boundary

- Date: 2026-07-15
- Decision: normalize real Playwright evidence with versioned Zod schemas, bounded allowlisted source excerpts, and stable finding IDs before model use.
- Model boundary: call `gpt-5.6-sol` through `responses.parse` with Structured Outputs, low reasoning, `store: false`, no tools, no SDK retries, and only the normalized evidence in the prompt.
- Safety boundary: accept only two low-risk repairs with the exact finding-to-fix mapping and target-file allowlist; reject unsafe paths, dependencies, code, commands, legal claims, unrelated redesign, missing review, or repository mutation.
- Pre-commit hardening: require exact evidence selector/source/metadata mappings, unique source allowlist entries, realpath containment including symlink resolution, complete-file excerpt rejection, representative CSS/JSX/JavaScript code rejection, and exact returned model identity.
- Preservation: write only ignored evidence, plan, and sanitized audit artifacts. No patch is generated or applied, and the original demo remains preserved for a later controlled step.
- Status: implemented in `207e0559d0d7664a24dcb297fb40b37700f36208`; current scope remains exactly two controlled findings and two safe-fix classes.

## D-011 — Isolate Deterministic Phase 1C Repairs

- Date: 2026-07-15
- Decision: never apply Phase 1C templates to the controlled main fixture. Validate reviewed hashes and policy, create an ignored disposable copy, apply exact templates, accept only the two allowlisted source changes, run the repaired replay, copy sanitized evidence out, and remove the copy.
- Rationale: preserve the reproducibly broken baseline while proving the repaired contrast and preventing model prose from acting as executable source.
- Status: implemented in `79ed0e60b2c7145f4113ecac3797a119ccb696ee` after one explicitly approved corrected rerun; all five ignored feasibility artifacts exist, while the broader workflow and curated proof remain open.
- Final isolation hardening: retain source tests in the disposable copy, exclude generated build/test output and common credential paths, reject every included symlink without following it, ignore `.accesspatch/work/`, and expose only repository-relative rejection paths. The corrected audit wording supersedes the earlier inaccurate strategy value.

## D-012 — Use `summary.json` as the Proof Bundle Manifest

- Date: 2026-07-15
- Decision: generate the exact canonical inventory in deterministic order, hash every generated file except `summary.json`, and store those hashes in `summary.json`; represent `test-results/` through its five contained file hashes.
- Rationale: a manifest cannot contain its own stable hash without circularity. Independent verification hashes `summary.json` separately and validates every listed entry against actual bytes.
- Safety: generate in a temporary sibling directory, reject unsafe paths, symlinks, unexpected entries, secrets, absolute local paths, raw prompt/response fields, sensitive IDs, and unsupported positive compliance claims, then replace the ignored final directory only after validation.
- Status: implemented in Phase 2A commit `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`; the real ignored bundle passed independent full-file review but is not a tracked judge sample.

## D-013 — Bind the Controlled WCAG 2.2 Mapping

- Date: 2026-07-15
- Decision: map `CONTROLLED_BARRIER_EMAIL_NAME` only to `1.3.1` Info and Relationships (A) and `4.1.2` Name, Role, Value (A); map `CONTROLLED_BARRIER_FOCUS_VISIBLE` only to `2.4.7` Focus Visible (AA).
- Exclusion: do not map the email defect to `3.3.2 Labels or Instructions`; visible identifying text exists, while the controlled failures concern programmatic association and accessible name.
- Sources: normative WCAG 2.2 criteria and informative W3C Understanding documents recorded in `WCAG_MAPPING_SOURCES.md`, checked 2026-07-15.
- Boundary: evidence-oriented mapping for one controlled journey only; not a conformance determination, certification, or complete WCAG coverage.
- Status: implemented and independently reviewed in Phase 2B commit `e3811c8bf968dc78701f8d264dc1377543059d64`; no additional criterion may be added without separate source-backed review.

## D-014 — Track Only the Reviewed Judge Sample

- Date: 2026-07-15
- Decision: allowlist `examples/judge-sample/` as the sole tracked proof sample and require its `proof-bundle/` to remain byte-identical to the independently reviewed Phase 2B run.
- Verification: pin all 15 hashes in `SHA256SUMS`; validate only tracked files with reused canonical policies; keep the ignored source run unchanged.
- Boundary: the sample is controlled-fixture evidence, not an arbitrary-repository result, complete accessibility test, conformance determination, certification, or final clean-machine judge workflow.
- Status: **COMPLETE** in independently reviewed Phase 2C implementation commit `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce`.

## D-015 — One Command Verifies but Never Regenerates Evidence

- Date: 2026-07-16
- Decision: `pnpm judge:verify` runs only repository preflight, API-free unit tests, type-check, build, smoke, the passing expected-defect proof, tracked-sample validation, and tracked-report smoke.
- Exclusions: installation, audit, license inventory, ignored-run validation, the intentionally failing developer baseline, model calls, evidence generation, repair, and bundle generation remain outside the command.
- Isolation: before preflight, the workflow creates empty restricted Git and npm/pnpm configuration under its reserved ignored directory. Child environments omit credentials, redirect Git and package-manager configuration away from user/system files, disable Git prompts and interactive credential handling, block proxy-routed external traffic while allowing local loopback, disable pnpm automatic dependency verification, update notification, audit, and funding behavior, and clean the reserved directory on success or failure.
- Untracked policy: execution-sensitive untracked files under `apps/`, `packages/`, `scripts/`, `tests/`, or `examples/judge-sample/` are rejected; unrelated non-ignored files outside those paths may remain when they cannot override the fixed workflow inputs.
- Result: the first lifetime run failed at the unit stage and remains part of the audit history. After fixture and home-configuration isolation corrections, the second lifetime run passed all eight stages exactly once with ignored runs absent; no third execution occurred.
- Status: **COMPLETE** in implementation commit `84db92f9e27b6f7872495516f166a8bcaed8ef03`. Phase 3B later verified one clean Debian clone; broader-platform verification remains open.

## D-016 — Track Sanitized Clean-Clone Evidence

- Date: 2026-07-16
- Decision: preserve the independently reviewed Phase 3B proof under `docs/hackathon/evidence/phase3b-clean-clone/` as one byte-identical sanitized archive, the exact 13 extracted evidence files, deterministic checksums, and a concise scope README.
- Provenance: the clean clone came only from committed Git history at `7d0653cd344cf15be448ed9ef62b41b74c0d67ef`; installation and the Judge Workflow each ran once and exited `0` without retry.
- Archive boundary: reject unsafe TAR entries and local identity metadata. The approved archive uses numeric ownership `0/0`, empty stored owner/group names, mode `0600`, normalized UTC timestamps, and no PAX atime/ctime metadata.
- Claim boundary: this proves the controlled judge path on Debian GNU/Linux 13 x86_64 only. It does not establish broader-platform support, complete accessibility, WCAG conformance, certification, or BFSG/EAA assurance.
- Status: **COMPLETE** in evidence commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed`. Independent review passed the final 16-file evidence directory; the archive is tracked as non-executable Git mode `100644`.

## D-017 — Use a Private Judging Repository Without an Open-Source License

- Date: 2026-07-16
- Owner: Frank Heilmann, trading as “Frankcom IT Service”.
- Decision: keep the submission repository private and later share it only with `testing@devpost.com` and `build-week-event@openai.com`.
- License boundary: AccessPatch is not offered under an open-source project license. Private judging access does not grant general reuse, redistribution, sublicensing, or public-republication rights; third-party packages retain their own licenses.
- Privacy: do not copy local usernames, paths, credential locations, account screens, API settings, or Git author email addresses into public materials.
- History: do not rewrite Git history because committed hashes anchor the evidence record. Preserve the immutable submission baseline tag, backup branch, bundle, and source snapshot.
- External boundary: no remote, hosting, server, subdomain, invitation, or publication action is authorized in Phase 4B.
- Status: **COMPLETE** in release-surface commit `f3953994883af959fdd80d2d5e5985b7cb987fd5`. Execution steps remain unexecuted and are documented in `PRIVATE_REPOSITORY_RELEASE_PLAN.md`.

## D-018 — Use the Organization Private Repository as the Canonical URL

- Date: 2026-07-16
- Decision: use `https://github.com/frankcom-it-service/accesspatch` as the only canonical repository URL.
- Access boundary: repository visibility remains private, the organization default repository permission is `none`, and judging access is limited to explicit read invitations.
- Reference boundary: publish only `main`, `backup/submission-baseline-2026-07-16`, and tag `submission-baseline-2026-07-16`; keep `release/phase4b-private-readiness` local-only.
- Invitation state: both required read invitations were issued and remain pending. Acceptance and independent judge cloning are separate verification gates.
- Status: **COMPLETE** in `079b191ade0ee8eee457c0f8060586488386213a` (`docs: record private repository access state`). Phase 4C changed no invitation, collaborator, role, organization member, visibility, permission, implementation, evidence, or immutable baseline reference.

## D-019 — Limit Mutation Guard to One Disposable Regression

- Date: 2026-07-16
- Decision: support only mutation `CONTROLLED_MUTATION_ARIA_HIDDEN_FOCUSABLE` on the existing checkout submit button, detected by rule `FOCUSABLE_ELEMENT_ARIA_HIDDEN`.
- Injection boundary: apply an exact deterministic source template only inside an allowlisted disposable fixture copy; require one target and reject zero, multiple, or already-mutated matches.
- Detection boundary: require browser-confirmed keyboard focus, native enabled button semantics, nonnegative tab index, visibility, and `aria-hidden="true"`. Do not depend solely on a variable third-party rule result.
- Fixture boundary: bind `demo-checkout-controlled-v1` to approved internal four-file SHA-256 `50a88ce11e4afc62f66c595b313156f2f1a7f1fc98eb2f6ad1206b8260fbbfd4`; reject drift, missing files, or retained mutation before runtime creation or old-evidence deletion.
- Isolation boundary: reject source and `.accesspatch` work/evidence symlinks, non-directory ancestors, containment escapes, credentials, real user configuration, and unrelated repository content. The disposable source copy stays under the validated work chain; Chromium-compatible child HOME/config/cache/temp/application-data paths exist only below a separate unique system-temporary runtime root. Complete all detector/config/browser preparation before Vite spawn, place every post-spawn operation under immediate bounded process cleanup, and attempt plus verify the contained and external root removals independently. Signal or cleanup failure writes no success artifact.
- Product boundary: no fuzzing, broad mutation framework, arbitrary repository rewriting, Proof Bundle change, certification, legal assurance, retained mutation, fallback, rollback, or replacement for human review.
- Clean-clone decision: accept the optional feature only after a fresh local clone of committed HEAD `d75954b672cbc88569d5502198effc57c4390c63` passes one offline frozen installation, one Mutation Guard execution, and one complete Judge Workflow. A temporary clone-only `trustLockfile: true` setting may bypass unavailable trust-metadata revalidation only when the original workspace file is restored byte-for-byte before runtime execution.
- Acceptance evidence: all 17 stages passed exactly once; 33 packages were reused and zero downloaded; injection/detection was `1/1`; all eight Judge stages and 178 tests passed. The sanitized archive SHA-256 is `eec0095939e73ccf623b5d5f8d75af73a6b7f5d16e686c34dad0000629fd97d6` under `docs/hackathon/evidence/phase5a-clean-clone/`.
- Integration decision: reviewed Phase 5A HEAD `e7701516f07c204c8ba5792dcf2c100c9b508222` is approved for `main` after final clean-clone acceptance. Integrate only by strict fast-forward, create no merge commit, retain the local feature branch without publishing it, and preserve the immutable emergency baseline separately.
- Status: **CLEAN-CLONE VERIFIED / MERGED INTO `main`**. The implementation remains limited to mutation `CONTROLLED_MUTATION_ARIA_HIDDEN_FOCUSABLE`, detector rule `FOCUSABLE_ELEMENT_ARIA_HIDDEN`, one fixed fixture, and the verified Debian/x86_64 Chromium path.

## Open Decisions

- `OPEN`: supported journey input and broader proof-bundle formats beyond the fixed controlled contract.
- `OPEN`: controlled patch approval, rollback, and post-repair review gates.
- `OPEN`: judging-invitation acceptance, independent private clone verification, server/demo decision, and final applicable Rules-page interpretation.
