# Submission Ledger

Last updated: 2026-07-15

This is the canonical ledger for claims, proof, and submission readiness. A claim may be presented as complete only when its evidence is linked here and reproducible.

## Verified Coordination Facts

| Item | Status | Evidence |
| --- | --- | --- |
| Product name: AccessPatch | VERIFIED | Repository and `README.md` |
| Selected track: Developer Tools | VERIFIED 2026-07-15 | Human coordination review |
| Product definition: Journey Repair and Proof Agent for React/TypeScript applications | PROJECT-SPECIFIED | Project brief |
| Minimal initial README baseline | VERIFIED | Root commit `0ac10988053a301c89689b8ce8fbd7e6aecd481f`; three-line README |
| Phase 0 documentation foundation | COMPLETE (COMMITTED) | `bbabb9207b0f7ae92b8262b2e02930511dd81521`; `TEST_EVIDENCE.md` |
| Governance-record follow-up | RECORDED IN FOLLOW-UP COMMIT | Subject `docs: record Phase 0 completion`; hash intentionally not embedded in its own content |
| Controlled `demo-checkout` fixture | PHASE 1A COMPLETE | `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf`; `apps/demo-checkout/`; `TEST_EVIDENCE.md` |
| AccessPatch repair product | NOT YET IMPLEMENTED | None |
| Codex central-session model | VERIFIED BY USER | `gpt-5.6-sol`, reasoning `high`; `CODEX_SESSION_RECORD.md` |
| Dedicated-project API authentication and minimal `gpt-5.6-sol` response access | VERIFIED 2026-07-15 | Human-supervised evidence in `TEST_EVIDENCE.md` |
| AccessPatch GPT-5.6 product integration | PARTIAL PRODUCT; PHASE 1B COMPLETE | `207e0559d0d7664a24dcb297fb40b37700f36208`; real bounded evidence-to-plan run; `TEST_EVIDENCE.md` |
| Structured Phase 1 evidence and approved repair plan | PHASE 1B COMPLETE; INDEPENDENT ARTIFACT REVIEW PASSED; GENERATED ARTIFACTS IGNORED | Three reviewed hashes plus hardened offline validation; `TEST_EVIDENCE.md` |
| Isolated deterministic repair and replay | PHASE 1C COMPLETE; GENERATED ARTIFACTS IGNORED | `79ed0e60b2c7145f4113ecac3797a119ccb696ee`; five runtime-validated feasibility artifacts and `TEST_EVIDENCE.md`; not the curated Proof Bundle |
| Canonical Proof Bundle generator and real bundle | PHASE 2A COMPLETE; INDEPENDENT FULL-BUNDLE REVIEW PASSED; OUTPUT IGNORED | `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`; ignored `.accesspatch/runs/phase2/proof-bundle/`; manifest SHA-256 `19613c7913a91ababb4fbe6cfe02cecc650006f9c80ccb46c18f10d6d9549906`; `TEST_EVIDENCE.md` |
| Controlled WCAG 2.2 mapping | PHASE 2B COMPLETE; INDEPENDENT FULL REVIEW PASSED; OUTPUT IGNORED | `e3811c8bf968dc78701f8d264dc1377543059d64`; `WCAG_MAPPING_SOURCES.md`; ignored regenerated bundle; `TEST_EVIDENCE.md` |
| Repository URL or demo URL | OPEN | No Git remote configured; no demo deployed |

## Central Requirements

| Requirement | Level | Current status | Evidence file or artifact | Responsible phase | Latest target date | Open risk or blocker |
| --- | --- | --- | --- | --- | --- | --- |
| Working project using Codex and GPT-5.6 | Mandatory | PARTIAL PRODUCT: CONTROLLED PLANNING AND ISOLATED REPAIR COMMITTED | `207e0559d0d7664a24dcb297fb40b37700f36208`; `79ed0e60b2c7145f4113ecac3797a119ccb696ee`; ignored Phase 1C artifacts; `TEST_EVIDENCE.md` | Build and integration | 2026-07-20 02:00 CEST | Report, retained application, full workflow, and judge-visible reproducibility remain open |
| One selected track | Mandatory | VERIFIED: Developer Tools | This ledger; `DECISIONS.md` | Phase 0 | 2026-07-15 | Recheck final Devpost selection |
| Project description | Mandatory | DRAFT | `DEVPOST_SUBMISSION_DRAFT.md` | Submission | 2026-07-21 02:00 CEST | Final claims need proof |
| Public YouTube demo, at most three minutes | Mandatory | NOT YET IMPLEMENTED | `VIDEO_SCRIPT.md`; public URL TODO | Demo and submission | 2026-07-21 02:00 CEST | Product and recording absent |
| Voiceover explains project, Codex use, and GPT-5.6 use | Mandatory | DRAFT OUTLINE | `VIDEO_SCRIPT.md` | Demo and submission | 2026-07-21 02:00 CEST | Must reflect actual frozen build |
| Code repository URL | Mandatory | OPEN | URL TODO | Submission | 2026-07-21 02:00 CEST | No remote; publication requires approval |
| README setup and testing guidance | Mandatory | PARTIAL: PHASE 1A LOCAL COMMANDS | `README.md` | Build and verification | 2026-07-20 02:00 CEST | Final install, supported-platform, and judge guidance remain open |
| Primary build-thread `/feedback` Session ID | Mandatory | PENDING | `CODEX_SESSION_RECORD.md` | Submission | 2026-07-21 02:00 CEST | Must be collected from this central session; never invent |
| Developer Tools installation instructions | Mandatory | PARTIAL: FIXTURE INSTALL ONLY | `README.md`; `JUDGE_TEST_GUIDE.md` | Build and verification | 2026-07-20 02:00 CEST | Final product and judge installation path remain open |
| Supported platforms | Mandatory | OPEN | `JUDGE_TEST_GUIDE.md` | Build and verification | 2026-07-20 02:00 CEST | Compatibility untested |
| Judge path without complete rebuild | Mandatory | NOT YET IMPLEMENTED | `JUDGE_TEST_GUIDE.md` | Demo and verification | 2026-07-21 02:00 CEST | Packaging approach OPEN |
| Public repository with relevant license, or private sharing with specified judging addresses | Mandatory | OPEN | Repository and license TODO | Release | 2026-07-21 02:00 CEST | Visibility path, license, and judging addresses require final verification |
| Judge-accessible demo or sandbox | Recommended | NOT YET IMPLEMENTED | `DEMO_EVIDENCE.md` | Demo | 2026-07-21 02:00 CEST | Hosting and accessibility OPEN |
| Fresh install and final link verification | Recommended | NOT YET RUN | `TEST_EVIDENCE.md`; checklist | Verification release gate | 2026-07-21 02:00 CEST | Requires feature-frozen artifact |
| Fixed MVP Proof Bundle inventory | Mandatory internal contract | GENERATOR COMMITTED; REAL BUNDLE INDEPENDENTLY REVIEWED | Canonical contract in `DEMO_EVIDENCE.md`; `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`; ignored real bundle and manifest | Build and evidence | 2026-07-20 02:00 CEST | Curated tracked judge-visible sample and final judge workflow remain open |

The full binding readiness checklist is `SUBMISSION_CHECKLIST.md`. The canonical Planned Proof Bundle Contract and exact required filenames are in `DEMO_EVIDENCE.md`; generated runs remain ignored unless a curated judge sample receives an explicitly reviewed tracked location or allowlist.

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
