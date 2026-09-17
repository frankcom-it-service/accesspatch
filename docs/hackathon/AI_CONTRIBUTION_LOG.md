# AI Contribution Log

## 2026-07-15 — Codex Phase 0 Session

- Tool: Codex CLI `0.144.4`.
- Model: `gpt-5.6-sol`.
- Reasoning setting: `high`.
- Central-session role: principal engineering thread for AccessPatch; started 2026-07-15 at 14:11 Europe/Berlin.
- Summarized input: product and track definition; strict Phase 0 scope; required records; verified coordination facts; submission deadlines and requirements; honesty, evidence, and security constraints.
- Concrete contribution: inspected the Git and tool baseline; drafted the documentation archive; added ignore and environment templates; corrected terminology, session metadata, official-rule status, requirements ownership, milestones, claim boundaries, and evidence gates.
- Human decision and review: the human set product scope and deadlines, supplied the verified model configuration and official-source findings, accepted the archive structure and secret hygiene, and requested the documented corrections before commit.
- Affected files: `README.md`, `AGENTS.md`, `.gitignore`, `.env.example`, and all 14 files in `docs/hackathon/`.
- Validations: complete tracked/untracked review; `git diff --check` passed; all-file whitespace and selected high-risk secret-pattern searches returned no matches; forbidden-scaffold inventory returned no files; working-tree status remained uncommitted. Exact commands and exits are in `TEST_EVIDENCE.md`.
- Foundation commit status: **COMPLETED**; `bbabb9207b0f7ae92b8262b2e02930511dd81521` (`docs: establish Phase 0 hackathon controls`).
- Result: corrected Phase 0 documentation foundation; no application functionality created.
- Limitations: dedicated-project API access and a minimal human-supervised model response are verified, but no AccessPatch product runtime integration, application test, demo, repository URL, submission, or `/feedback` Session ID exists.

The Devpost Hackathon plugin remains optional submission support and does not replace this central Codex engineering session.

## Final Phase 0 Documentation Correction

- Human input: binding one-checkbox-per-requirement checklist and exact 11-output MVP Proof Bundle inventory, plus preservation and evidence rules.
- Independent human review: the external archive review passed structure, secret hygiene, unsupported-claim handling, and scope control, then identified the two documentation gaps. It is not represented as having run commands in this repository.
- Codex contribution: expanded `SUBMISSION_CHECKLIST.md`; made `DEMO_EVIDENCE.md` the canonical Proof Bundle contract; added the README overview and ledger references; updated governance evidence.
- Affected files: `README.md`, `SUBMISSION_CHECKLIST.md`, `DEMO_EVIDENCE.md`, `SUBMISSION_LEDGER.md`, `BUILD_LOG.md`, `AI_CONTRIBUTION_LOG.md`, and `TEST_EVIDENCE.md`.
- Codex validations: diff check passed; all-file whitespace and selected high-risk secret searches returned no matches; no forbidden scaffold files or checked checklist entries were found; all 11 canonical Proof Bundle names appeared exactly once; working tree remained uncommitted. Exact repository commands and results are in `TEST_EVIDENCE.md`.
- Foundation commit status: **COMPLETED**; included in `bbabb9207b0f7ae92b8262b2e02930511dd81521`.
- Governance-record follow-up: committed separately with subject `docs: record Phase 0 completion`; its own hash is intentionally not embedded in that commit.
- Result: documentation correction only; Proof Bundle files and application behavior remain **NOT YET IMPLEMENTED**.

## GPT-5.6 Access-Verification Record

- Human-supervised work: created the restricted project and external key storage, applied least-privilege endpoint permissions and prepaid cost controls, and performed the quota and successful access checks.
- Codex contribution: documented the supplied evidence and updated stale access-status statements; Codex did not handle the secret or perform the model request.
- Result at that checkpoint: authentication, prepaid billing readiness, and minimal `gpt-5.6-sol` response access were verified; the Evidence-Based Repair Reasoner was still **NOT YET IMPLEMENTED**. The later Phase 1B record below supersedes that implementation status.

## Phase 1A Implementation

- Human assignment: build only the controlled checkout fixture and deterministic two-barrier baseline; explicitly exclude repair, GPT-5.6 product integration, Proof Bundle generation, arbitrary repositories, deployment, and submission work.
- Codex contribution: created the pnpm workspace, React/Vite fixture, shared TypeScript setup, Chromium Playwright configuration, passing smoke test, soft-assertion keyboard baseline, and structured axe attachment.
- Human-controlled boundaries: the external OpenAI credential file was not read or used, and no API call occurred.
- Validation: install, type-check, and build exited `0`; smoke passed 1 test; baseline exited `1` only for the two controlled barriers, with axe reporting only the intended label finding.
- Commit status: **COMPLETE** — implementation commit `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf`.
- Pre-commit correction: Codex replaced floating direct specifications with the already resolved exact versions, added portable Chromium resolution and a Chromium-only install command, associated a visible required-field instruction with the form, and corrected stale security wording after independent human review. The two intentional barriers remain.
- Final gates: Codex ran the frozen install, high-severity audit, pnpm license inventory, type-check, build, smoke test, intentional baseline, staged review, and repository-hygiene checks. The audit found no known vulnerabilities; direct dependency licenses were all identified.

## Phase 1B Evidence and Reasoning

- Human assignment: implement only normalized journey evidence and the bounded GPT-5.6 Evidence-Based Repair Reasoner; permit exactly one real call after offline validation and prohibit patching, replay, Proof Bundle, deployment, and publication.
- Codex contribution: added stable Zod contracts, real Playwright evidence collection, allowlisted source excerpting, bounded prompting, deterministic plan policy, sanitized audit metadata, stale-plan removal on failure, and 21 API-free unit/policy tests.
- Model contribution: one `gpt-5.6-sol` call with low reasoning proposed exactly two later repairs—associate the existing email label and restore the controlled focus indicator. Structured and deterministic validation accepted the plan; no model output was applied.
- Privacy and cost controls: `store: false`, no tools, no retries, bounded evidence only, ignored run artifacts, external credential sourcing immediately before the command, and no secret or raw response persisted.
- Validation: status `completed`; usage 1,649 input, 795 output, 0 reasoning, 2,444 total tokens; evidence and plan hashes are recorded in `TEST_EVIDENCE.md`.
- Human decision and review: the human defined the findings, allowlists, permitted fix classes, one-call limit, and approval boundary, then approved the independently reviewed Phase 1B implementation for commit.
- Affected files: root workspace configuration; `packages/shared-types/`, `packages/evidence-collector/`, `packages/repair-reasoner/`; `tests/e2e/evidence.spec.ts`; `tests/unit/`; and relevant governance records.
- Commit status: **COMPLETE** — `207e0559d0d7664a24dcb297fb40b37700f36208` (`feat: add bounded evidence repair reasoner`).
- Limitations: the plan covers only the controlled fixture and does not establish repair correctness, complete accessibility, WCAG certification, BFSG/EAA legal assurance, or replacement of disabled-user testing or qualified human review.

### Phase 1B Pre-Commit Hardening

- Human input: supplied the independent artifact-review result and exact three hashes, then required stricter evidence mapping, portable realpath containment, no-code policy detection, returned-model verification, and no second API call.
- Codex contribution: implemented the requested fail-closed checks, updated stale runtime comments, and added 17 API-free negative tests for 38 total.
- Independent review versus Codex validation: the external review assessed the existing run artifacts; Codex separately reran repository tests, fresh journey evidence, offline schema/policy parsing, hash verification, and hygiene scans.
- Result: the reviewed evidence and plan remain valid and byte-identical after hardening; the sanitized audit remains unchanged. Phase 1B is committed at `207e0559d0d7664a24dcb297fb40b37700f36208`.

## Phase 1C Isolated Repair Work

- Human assignment: apply only the approved two-finding plan through deterministic templates in an isolated copy, generate a real diff and replay, preserve the main fixture, prohibit further API use, and keep Phase 1C uncommitted.
- Codex contribution: implemented the patch-engine package, fail-closed preconditions, reviewed-hash and plan gates, two-file patch policy, disposable copy and cleanup, generated keyboard replay, sanitized artifact schemas, and 19 additional API-free tests for 57 total.
- Human boundary: the reviewed plan selected the only permitted strategies; Codex did not reinterpret model prose as source code and did not access or source credentials.
- Result: the first command produced a real passing replay but failed artifact finalization on a corrected Git-hash schema defect. After independent review and explicit approval, one controlled rerun exited `0`, reproduced the patch and replay, wrote all five validated artifacts, and preserved the original fixture.
- Commit status: **COMPLETE** — `79ed0e60b2c7145f4113ecac3797a119ccb696ee` (`feat: add isolated deterministic repair replay`). Reporting, broad repository support, retained patch application, and the complete Proof Bundle remain pending.

### Phase 1C Final Isolation Correction

- Human review: independently approved the repairs and artifacts, then identified inaccurate audit wording, stale environment status, missing work-copy ignore protection, and insufficient credential/symlink exclusion.
- Codex contribution: corrected the stable audit strategy, replaced filtered recursive copy with regular-file-only traversal, added credential exclusions and fail-closed symlink handling, ignored `.accesspatch/work/`, updated current status, and added 7 API-free tests for 64 total.
- Result: one authorized regeneration exited `0` without retry; four expected artifacts remained byte-identical, the sanitized audit changed only for timestamp and corrected strategy, and the reviewed implementation is committed at `79ed0e60b2c7145f4113ecac3797a119ccb696ee`.

## Phase 2A Canonical Proof Bundle Work

- Human assignment: generate the exact canonical 11-entry Proof Bundle only from the eight reviewed Phase 1 artifacts and current reproducibility metadata, without another model or repair run.
- Codex contribution: added versioned bundle schemas, reviewed-input validation, deterministic JSON/CSV/static-HTML rendering, a non-circular `summary.json` manifest, exact inventory enforcement, symlink/path/content rejection, atomic directory replacement, and a Chromium+axe report smoke test.
- Tests: added 22 API-free unit/integration tests, increasing the unit suite from 64 to 86; all 86 pass. One overbroad compliance-claim test regex was narrowed after it correctly failed the initial development run on a negated disclaimer.
- Result: exactly one `pnpm phase2:bundle` command exited `0` and produced 15 files across the required 11 top-level entries. Independent offline validation and the report smoke passed; the static report axe result was zero violations.
- Human review: an independent full review passed the source, generator, schemas, HTML, exact inventory, security controls, and all 15 generated artifacts. Human approval authorized the implementation commit while retaining the boundary between the ignored real bundle and a future tracked judge sample.
- Human boundary: no new checklist item is completed solely by the ignored bundle. No tracked judge sample, model call, credential access, repair rerun, source-fixture change, or Phase 2B work occurred.
- Commit status: **COMPLETE** in implementation commit `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`.

## Phase 2B Controlled WCAG Mapping Work

- Human assignment: bind the two controlled findings to exactly three officially sourced WCAG 2.2 criteria, explicitly exclude `3.3.2`, regenerate the ignored bundle once, and preserve all claim boundaries.
- Codex contribution: verified the W3C criterion titles, levels, and explanatory 3.3.2 distinction; implemented one deterministic mapping allowlist across schemas, findings, CSV, summary, report, and validators; added source provenance and 12 API-free tests.
- Human decision: the binding mappings are email → `1.3.1` and `4.1.2`, focus → `2.4.7`; no other criterion is permitted without a separate source-backed review.
- Result: 98 API-free tests passed; one authorized bundle regeneration exited `0` without retry; exact mapping, manifest, privacy, and report checks passed with zero report axe violations.
- Independent review: complete source, schema, official-source, CSV, report, inventory, manifest, security, and all-15-artifact review passed.
- Limitations: evidence-oriented mapping only; no conformance determination, certification, complete WCAG coverage, tracked judge sample, clean-machine verification, or broader repository support.
- Commit status: **COMPLETE** in implementation commit `e3811c8bf968dc78701f8d264dc1377543059d64`. No model call, credential access, reasoner run, repair run, or fixture change occurred.

## Phase 2C Curated Judge Sample Work

- Human assignment: copy the reviewed Phase 2B bundle byte-for-byte into an explicit tracked sample and add read-only validation without regenerating evidence.
- Codex contribution: added the fixed 15-hash contract, shared report assertions, tracked-sample validator, browser smoke, checksum manifest, sample README, sanitized failure reporting, and 16 API-free tests.
- Human boundary: the sample is limited to the controlled fixture and is not the final judge workflow, clean-machine proof, arbitrary-repository evidence, accessibility certification, or legal assurance.
- Current result: the tracked and ignored bundles compare byte-for-byte; 114 API-free tests, both report smokes, and the read-only validator pass.
- Independent review: source, validator, tests, tracked sample, manifest, report, security, inventory, and byte identity passed full review.
- Commit status: **COMPLETE** in implementation commit `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce`. No API call, credential access, reasoner run, repair run, bundle regeneration, or fixture change occurred.

## Phase 3A Judge Workflow Work

- Human assignment: create a deterministic one-command judge workflow without modifying or regenerating reviewed evidence.
- Codex contribution: added a hard-assertion controlled-baseline contract, repository/sample preflight, fixed stage plan, local-only child environment, tracked-byte and sample-mtime snapshots, reserved-output cleanup, stable summary contract, and 25 API-free tests.
- Validation result: direct build, smoke, developer baseline, judge baseline, sample validator, and report smoke passed. The corrected unit suite has 139 passing tests with ignored runs absent.
- Single full run: exactly one `pnpm judge:verify` execution was attempted. It stopped at stage 2 because existing proof-bundle unit fixtures copied ignored source artifacts. No retry occurred.
- Corrections: proof-bundle unit fixtures now reconstruct the reviewed evidence hash from tracked sample facts and use byte-identical tracked artifacts. After independent review archive `2f328fbe97d1088945ba9291b8669f5bdd768137196b800356a779ba535df7a5` identified a remaining isolation gap, Codex added empty restricted runtime Git/npm configuration, Git system/global-config and credential-prompt blocking, npm/pnpm user/global-config redirection, automatic-install/audit/funding/update-notifier suppression, and cleanup covering preflight failures. Fake-home Git and pnpm tests confirm their marker configuration is not observed.
- Corrected proof run: after final independent pre-run archive review SHA-256 `1e458514f2737234765705a7063afa8658c8e887233a727d91e45eb05c2ec9b9`, the second lifetime workflow execution exited `0`; all eight stages started and passed exactly once, 139 tests passed, the exact controlled baseline and zero-violation report were confirmed, and no retry or third execution occurred.
- Preservation: `.accesspatch/runs/` was absent during execution; all 17 Judge Sample hashes and mtimes and all 23 ignored-run hashes remained unchanged after restoration. Runtime configuration and temporary workflow output were removed.
- Result: **COMPLETE** in implementation commit `84db92f9e27b6f7872495516f166a8bcaed8ef03`. No API call, credential access, reasoner run, repair run, bundle regeneration, fixture change, remote, deployment, or publication occurred.

## Phase 3B Clean-Clone Evidence Integration

- Human assignment: preserve and integrate the independently reviewed clean-clone proof without rerunning installation, tests, the Judge Workflow, or any generator.
- Prior verified execution: one fresh Git clone of committed source HEAD `7d0653cd344cf15be448ed9ef62b41b74c0d67ef` completed one frozen-lockfile install and one `pnpm judge:verify` execution, both exit `0` without retry. This was lifetime Judge Workflow execution number 3.
- Codex contribution in this task: revalidated the approved sanitized archive, copied it byte-for-byte, safely extracted the exact 13 evidence files, added deterministic checksums and an evidence README, and updated only project governance documentation.
- Human review: independent review confirmed the final archive has neutral numeric ownership, normalized metadata, sanitized contents, and internally consistent proof of all eight stages and 139 API-free tests.
- Result: **COMPLETE** in evidence commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed`. The reviewed archive is tracked as non-executable mode `100644`. No installation, project test, Judge Workflow, API call, credential access, reasoner, repair, bundle generation, implementation change, fixture change, remote, deployment, publication, or video work occurred during integration.

## Phase 4B Private Release Readiness

- Human assignment: prepare the private-repository release surface without creating a remote, granting access, publishing source, selecting an open-source license, or changing implementation or evidence.
- Human decisions: the legal owner is Frank Heilmann; approved attribution is `Frank Heilmann, trading as “Frankcom IT Service”`; the repository remains private for judging; no open-source project license is granted; Git history and immutable baseline references remain unchanged.
- Codex contribution: created `OWNERSHIP.md`, the private release/privacy decision, and the gated private repository release plan; completed third-party dependency notices; expanded the README’s Codex, human-decision, GPT-5.6, ownership, and judge-path explanations; refreshed the Devpost draft; corrected the video status; and removed the tracked local absolute repository path.
- Validation: `pnpm licenses list --json` exited `0`; all direct external licenses matched the committed versions; `pnpm judge:sample:validate` passed; all Judge Sample and Phase 3B checksums passed; immutable refs and external backup hashes remained unchanged; diff, whitespace, secret, identifier, real-local-path, author-email, placeholder, and claim scans passed.
- Independent wording correction: changed the README from planned/future tense to the implemented controlled-workflow status, confirmed this Codex session is central, and clarified that internal workspace packages are not separately licensed. General-product limitations and all external release blockers remain unchanged.
- Safety and privacy boundary: no Git author email was copied into public-facing material, no credential location or account screen was added, and no implementation, Judge Sample, Phase 3B evidence, package, lockfile, fixture, baseline ref, or external backup was modified.
- Result: **COMPLETE** in release-surface commit `f3953994883af959fdd80d2d5e5985b7cb987fd5`. No API call, credential access, reasoner, repair, bundle generation, Judge Workflow, mutation, remote, push, server, subdomain, deployment, publication, `/feedback`, video, or Devpost external action occurred.

## Phase 5A Accessibility Mutation Guard

- Human assignment: add one optional, deterministic mutation demonstration only after securing the immutable baseline and preserving submission-capable `main`.
- Human scope decision: support exactly `CONTROLLED_MUTATION_ARIA_HIDDEN_FOCUSABLE`; do not broaden to fuzzing, arbitrary repositories, retained mutation, complete WCAG coverage, certification, or legal assurance.
- Codex contribution: reused the patch engine’s hardened patterns to add an exact source template, four-file fixture allowlist, symlink and traversal rejection, minimal child environment, isolated Vite/Playwright execution, versioned Zod result validation, atomic ignored evidence, cleanup, and stable CLI output.
- Tests: 19 initial plus 20 focused hardening and lifecycle tests add 39 Phase 5A API-free tests, increasing the suite from 139 to 178. They cover schemas, target counts, already-mutated input, copy security, isolated child directories, unsafe runtime ancestors, deterministic focusability, fixture-hash drift, positive and negative detection, fixture preservation, pre-spawn preparation, child-process errors, independent multi-root cleanup, signal cleanup, and output stability.
- Runtime result: the initial implementation’s first browser attempt was blocked by the execution sandbox’s localhost bind restriction and left no runtime state. During the security correction, one initial hardened execution and two diagnostic executions exposed Chromium worker termination when browser temporary profiles were placed inside the repository work tree; all three failed closed and cleaned up. Moving the isolated child runtime to a unique system-temporary root preserved the isolation contract. After the final lifecycle correction, two executions again produced the same stable output and byte-identical evidence, each detecting one mutation and removing all runtime state. The existing eight-stage Judge Workflow passed once with 178 tests and was not extended to run the optional guard.
- Security corrections: child user/config/cache/temp paths resolve only beneath the disposable runtime; fixed work/evidence chains reject symlinks, non-directory ancestors, and escapes; fixture ID `demo-checkout-controlled-v1` is bound to the approved four-file hash; and abort cleanup is directly tested. A final independent review then identified a pre-`finally` Vite cleanup gap. Codex moved all detector/browser preparation before spawn, protected every post-spawn operation immediately, sanitized asynchronous spawn errors, made server waiting abortable, and made contained plus external root cleanup independent and mandatory before success evidence.
- Implementation completion: commit `b05541f147a08cb0b38ecbda5ae5802db065a3d2` passed final independent implementation, lifecycle, isolation, cleanup, evidence, documentation, fixture-integrity, and repository-scope review; review archive SHA-256 is `d2d63d1c708b57e000fe915092ac70c4f457608eededf0e96757b7a0c56a3c91`.
- Verified result: 178 API-free tests and the full eight-stage Judge Workflow passed after the final lifecycle correction. Fixture SHA-256 remained `50a88ce11e4afc62f66c595b313156f2f1a7f1fc98eb2f6ad1206b8260fbbfd4`; stable ignored hashes remained `0012aea061beb4d2d5dd7b72728043fa7c5882cf47b625be921186735865b3d0` for `result.json` and `5f382756c9908b45c699556bf787074573f03b24354094567fdc315d0159f2ac` for `result.md`.
- Clean-clone acceptance: committed feature HEAD `d75954b672cbc88569d5502198effc57c4390c63` passed all 17 stages once on Debian 13 x86_64. One offline frozen install reused 33 packages and downloaded zero; a temporary clone-only `trustLockfile: true` override was recognized and restored byte-for-byte before the Mutation Guard and Judge Workflow. Mutation injection/detection was `1/1`, all eight Judge stages and 178 tests passed, and the report axe result was zero.
- Evidence integration: the independently reviewed 16-file sanitized archive SHA-256 `eec0095939e73ccf623b5d5f8d75af73a6b7f5d16e686c34dad0000629fd97d6` and its exact extracted files are tracked under `docs/hackathon/evidence/phase5a-clean-clone/`; the directory contains 17 files total including the archive.
- Merge completion: reviewed Phase 5A HEAD `e7701516f07c204c8ba5792dcf2c100c9b508222` was integrated into `main` by strict fast-forward without a merge commit. The local feature branch is retained but unpublished.
- Preservation: the immutable emergency baseline remains separately preserved. No OpenAI or external API call, credential inspection, Proof Bundle change, fixture mutation, invitation or permission change, server access, `/feedback`, video, external Devpost action, deployment, public source release, or submission occurred.

## 2026-09-17 — Public Apache-2.0 Documentation Transition

- Human decision: continue AccessPatch as a public open-source project under Apache License 2.0, retaining Frank Heilmann, trading as “Frankcom IT Service”, as original creator and copyright holder.
- Codex contribution: added the official unmodified license text, updated current ownership/access notices, and explicitly contextualized historical private-release and submission documents.
- Scope: documentation and licensing only; implementation, tests, dependencies, fixture, proof contracts, curated evidence bytes, hashes, historical Git commits, and immutable baseline references are unchanged. No maturity, adoption, certification, or new accessibility result is claimed.
