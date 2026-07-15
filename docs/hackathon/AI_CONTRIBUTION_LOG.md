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
