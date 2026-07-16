# Submission Ledger

Last updated: 2026-07-16

This is the canonical ledger for claims, proof, and submission readiness. A claim may be presented as complete only when its evidence is linked here and reproducible.

## Verified Coordination Facts

| Item | Status | Evidence |
| --- | --- | --- |
| Product name: AccessPatch | VERIFIED | Repository and `README.md` |
| Selected track: Developer Tools | VERIFIED 2026-07-15 | Human coordination review |
| Product definition: Journey Repair and Proof Agent for React/TypeScript applications | PROJECT-SPECIFIED | Project brief |
| Legal owner and approved attribution | VERIFIED BY USER 2026-07-16 | `OWNERSHIP.md`; Frank Heilmann, trading as “Frankcom IT Service” |
| Repository publication model | PHASE 4C COMPLETE: PRIVATE ORGANIZATION REPOSITORY VERIFIED; ACCESS PENDING | `079b191ade0ee8eee457c0f8060586488386213a`; `https://github.com/frankcom-it-service/accesspatch`; `PRIVATE_RELEASE_AND_PRIVACY_DECISION.md`; `PRIVATE_REPOSITORY_RELEASE_PLAN.md` |
| Private release surface and ownership record | PHASE 4B COMPLETE | `f3953994883af959fdd80d2d5e5985b7cb987fd5`; `OWNERSHIP.md`; `THIRD_PARTY_NOTICES.md`; `README.md` |
| Minimal initial README baseline | VERIFIED | Root commit `0ac10988053a301c89689b8ce8fbd7e6aecd481f`; three-line README |
| Phase 0 documentation foundation | COMPLETE (COMMITTED) | `bbabb9207b0f7ae92b8262b2e02930511dd81521`; `TEST_EVIDENCE.md` |
| Governance-record follow-up | RECORDED IN FOLLOW-UP COMMIT | Subject `docs: record Phase 0 completion`; hash intentionally not embedded in its own content |
| Controlled `demo-checkout` fixture | PHASE 1A COMPLETE | `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf`; `apps/demo-checkout/`; `TEST_EVIDENCE.md` |
| AccessPatch repair product | CONTROLLED FEASIBILITY WORKFLOW IMPLEMENTED; GENERAL PRODUCT NOT YET IMPLEMENTED | Controlled Phase 1–3 commits and evidence |
| Codex central-session model | VERIFIED BY USER | `gpt-5.6-sol`, reasoning `high`; `CODEX_SESSION_RECORD.md` |
| Dedicated-project API authentication and minimal `gpt-5.6-sol` response access | VERIFIED 2026-07-15 | Human-supervised evidence in `TEST_EVIDENCE.md` |
| AccessPatch GPT-5.6 product integration | PARTIAL PRODUCT; PHASE 1B COMPLETE | `207e0559d0d7664a24dcb297fb40b37700f36208`; real bounded evidence-to-plan run; `TEST_EVIDENCE.md` |
| Structured Phase 1 evidence and approved repair plan | PHASE 1B COMPLETE; INDEPENDENT ARTIFACT REVIEW PASSED; GENERATED ARTIFACTS IGNORED | Three reviewed hashes plus hardened offline validation; `TEST_EVIDENCE.md` |
| Isolated deterministic repair and replay | PHASE 1C COMPLETE; GENERATED ARTIFACTS IGNORED | `79ed0e60b2c7145f4113ecac3797a119ccb696ee`; five runtime-validated feasibility artifacts and `TEST_EVIDENCE.md`; not the curated Proof Bundle |
| Canonical Proof Bundle generator and real bundle | PHASE 2A COMPLETE; INDEPENDENT FULL-BUNDLE REVIEW PASSED; OUTPUT IGNORED | `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`; ignored `.accesspatch/runs/phase2/proof-bundle/`; manifest SHA-256 `19613c7913a91ababb4fbe6cfe02cecc650006f9c80ccb46c18f10d6d9549906`; `TEST_EVIDENCE.md` |
| Controlled WCAG 2.2 mapping | PHASE 2B COMPLETE; INDEPENDENT FULL REVIEW PASSED; OUTPUT IGNORED | `e3811c8bf968dc78701f8d264dc1377543059d64`; `WCAG_MAPPING_SOURCES.md`; ignored regenerated bundle; `TEST_EVIDENCE.md` |
| Curated tracked Judge Sample | PHASE 2C COMPLETE; INDEPENDENT FULL REVIEW PASSED | `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce`; exactly 17 tracked files; byte-identical 15-file bundle plus `README.md` and `SHA256SUMS`; read-only validator and zero-violation report smoke |
| One-command Judge workflow | PHASE 3A COMPLETE; LOCAL END-TO-END PROOF PASSED | `84db92f9e27b6f7872495516f166a8bcaed8ef03`; corrected second lifetime `pnpm judge:verify` run passed all eight stages with ignored runs absent; 139 tests; stable success output; no third run |
| Clean-clone Judge verification | PHASE 3B COMPLETE; INDEPENDENT EVIDENCE REVIEW PASSED | Evidence commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed`; fresh clone of `7d0653cd344cf15be448ed9ef62b41b74c0d67ef`; one frozen install and one Judge Workflow run exited `0` without retry; `docs/hackathon/evidence/phase3b-clean-clone/` |
| Repository URL or demo URL | PRIVATE REPOSITORY URL VERIFIED; ACCESS PENDING | `https://github.com/frankcom-it-service/accesspatch`; both required read invitations remain pending; no demo deployment |
| Accessibility Mutation Guard | PHASE 5A CLEAN-CLONE VERIFIED / MERGED INTO `main` | Implementation `b05541f147a08cb0b38ecbda5ae5802db065a3d2`; integrated HEAD `e7701516f07c204c8ba5792dcf2c100c9b508222` by strict fast-forward without merge commit; mutation `CONTROLLED_MUTATION_ARIA_HIDDEN_FOCUSABLE`; rule `FOCUSABLE_ELEMENT_ARIA_HIDDEN`; clean clone `d75954b672cbc88569d5502198effc57c4390c63`; 17/17 stages; one offline install with 33 reused and zero downloaded; temporary clone-only trust override restored before runtime; mutation `1/1`; 178 tests and all eight Judge stages; archive SHA-256 `eec0095939e73ccf623b5d5f8d75af73a6b7f5d16e686c34dad0000629fd97d6`; `docs/hackathon/evidence/phase5a-clean-clone/`; local feature branch retained unpublished; no model call |

## Central Requirements

| Requirement | Level | Current status | Evidence file or artifact | Responsible phase | Latest target date | Open risk or blocker |
| --- | --- | --- | --- | --- | --- | --- |
| Working project using Codex and GPT-5.6 | Mandatory | CONTROLLED END-TO-END FEASIBILITY WORKFLOW COMMITTED | Phase 1–3 commits; tracked Judge Sample; Phase 3B evidence | Build and integration | 2026-07-20 02:00 CEST | Retained application, broad repositories, fallback/rollback, and production hosting remain open |
| One selected track | Mandatory | VERIFIED: Developer Tools | This ledger; `DECISIONS.md` | Phase 0 | 2026-07-15 | Recheck final Devpost selection |
| Project description | Mandatory | CURRENT ENGLISH DRAFT; EXTERNAL FORM PENDING | `DEVPOST_SUBMISSION_DRAFT.md` | Submission | 2026-07-21 02:00 CEST | Final form limits and official rules require recheck |
| Public YouTube demo, at most three minutes | Mandatory | NOT YET IMPLEMENTED | `VIDEO_SCRIPT.md`; public URL TODO | Demo and submission | 2026-07-21 02:00 CEST | Recording, review, upload, and public-link verification absent |
| Voiceover explains project, Codex use, and GPT-5.6 use | Mandatory | DRAFT OUTLINE | `VIDEO_SCRIPT.md` | Demo and submission | 2026-07-21 02:00 CEST | Must reflect actual frozen build |
| Code repository URL | Mandatory | CANONICAL PRIVATE URL VERIFIED; FORM ENTRY PENDING | `https://github.com/frankcom-it-service/accesspatch`; `PRIVATE_REPOSITORY_RELEASE_PLAN.md` | Submission | 2026-07-21 02:00 CEST | Devpost form entry, invitation acceptance, and independent clone verification remain open |
| README setup and testing guidance | Mandatory | VERIFIED FOR CONTROLLED JUDGE PATH | `README.md`; `JUDGE_TEST_GUIDE.md`; Phase 3B clean-clone evidence | Build and verification | 2026-07-20 02:00 CEST | Broader-platform and final public-link guidance remain open |
| Primary build-thread `/feedback` Session ID | Mandatory | PENDING | `CODEX_SESSION_RECORD.md` | Submission | 2026-07-21 02:00 CEST | Must be collected from this central session; never invent |
| Developer Tools installation instructions | Mandatory | VERIFIED IN ONE CLEAN CLONE | `README.md`; `JUDGE_TEST_GUIDE.md`; `docs/hackathon/evidence/phase3b-clean-clone/` | Build and verification | 2026-07-20 02:00 CEST | Other operating systems and Playwright-managed browser fallback remain open |
| Supported platforms | Mandatory | VERIFIED LIMITED: DEBIAN 13 X86_64 | `JUDGE_TEST_GUIDE.md`; `environment-summary.txt` in Phase 3B evidence | Build and verification | 2026-07-20 02:00 CEST | Windows, macOS, other Linux distributions, architectures, and browser configurations unverified |
| Judge path without complete rebuild | Mandatory | ONE-COMMAND CLEAN-CLONE PATH VERIFIED; REQUIREMENT INTERPRETATION OPEN | `JUDGE_TEST_GUIDE.md`; `pnpm judge:verify`; `84db92f9e27b6f7872495516f166a8bcaed8ef03`; Phase 3B evidence | Demo and verification | 2026-07-21 02:00 CEST | Command intentionally performs a deterministic production build; confirm this satisfies final judging interpretation |
| Public repository with relevant license, or private sharing with specified judging addresses | Mandatory | PRIVATE REPOSITORY CREATED; READ INVITATIONS PENDING | `OWNERSHIP.md`; `PRIVATE_RELEASE_AND_PRIVACY_DECISION.md`; `PRIVATE_REPOSITORY_RELEASE_PLAN.md`; canonical private URL | Release | 2026-07-21 02:00 CEST | Both invitations were issued with read permission; acceptance and independent judge cloning remain unverified |
| Third-party licenses and attribution | Mandatory release control | REVIEW COMPLETE FOR CURRENT TREE | `THIRD_PARTY_NOTICES.md`; `pnpm-lock.yaml`; offline `pnpm licenses list --json` | Release | 2026-07-20 02:00 CEST | Repeat only if dependencies or assets change |
| Judge-accessible demo or sandbox | Recommended | LOCAL JUDGE PATH IMPLEMENTED; PRIVATE ACCESS PENDING | `JUDGE_TEST_GUIDE.md`; tracked Judge Sample; Phase 3B evidence; canonical private URL | Demo | 2026-07-21 02:00 CEST | Required read invitations remain pending; independent judge clone not verified |
| Fresh install and final link verification | Recommended | FRESH INSTALL VERIFIED ON DEBIAN; FINAL LINKS OPEN | `TEST_EVIDENCE.md`; `docs/hackathon/evidence/phase3b-clean-clone/`; checklist | Verification release gate | 2026-07-21 02:00 CEST | Public repository, demo, video, and Devpost links do not yet exist |
| Fixed MVP Proof Bundle inventory | Mandatory internal contract | GENERATOR, REVIEWED TRACKED SAMPLE, AND CLEAN-CLONE VALIDATION COMPLETE | Canonical contract in `DEMO_EVIDENCE.md`; generator `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`; Judge Sample `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce`; Phase 3B evidence | Build and evidence | 2026-07-20 02:00 CEST | Broader platforms and final public judge access remain open |

The full binding readiness checklist is `SUBMISSION_CHECKLIST.md`. The canonical Proof Bundle Contract and exact required filenames are in `DEMO_EVIDENCE.md`; generated runs remain ignored except for the independently reviewed `examples/judge-sample/` allowlist.

## Official Verification Status

The current OpenAI Build Week FAQ, overview, and official current announcement were checked on 2026-07-15 and support the requirements above. They currently show the deadline as 2026-07-21 at 17:00 PDT, corresponding to 2026-07-22 at 02:00 CEST.

`OPEN OFFICIAL-SOURCE INCONSISTENCY`: the body currently returned by the official Rules page appears to contain the title, dates, and content of an older 2025 OpenAI Open Model Hackathon. Do not silently treat that stale body as the applicable Build Week rules. Recheck all official sources, the applicable rules, judging addresses, and Devpost fields immediately before submission.

## Timeline and Freeze

- Central Codex session start: 2026-07-15 at 14:11 Europe/Berlin.
- Internal feature freeze: 2026-07-20 at 02:00 CEST.
- Internal submission-ready target: 2026-07-21 at 02:00 CEST.
- Current official deadline: 2026-07-22 at 02:00 CEST.
- Final 24 hours: fixes, evidence, video, links, Devpost, and unexpected submission issues only.
- Coordination check at approximately 2026-07-15 14:19 CEST: about 107h40m to freeze, 131h40m to submission-ready, and 155h40m to the official deadline.
- `REQUIRED`: recalculate remaining time at the beginning of each project day.

After freeze, accept only evidence, documentation, and critical correctness or security fixes. Record every exception in `DECISIONS.md` and rerun affected proof.
