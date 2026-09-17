# Submission Ledger

**Current repository transition — 2026-09-17:** The owner confirms that https://github.com/frankcom-it-service/accesspatch is now public and approves continuation as an open-source project under Apache License 2.0. `LICENSE` and `OWNERSHIP.md` record current terms. The July 2026 submission facts, private-access checks, pending invitations, deadlines, and readiness matrix below remain historical; no new invitation acceptance or judge clone is inferred.

Last updated: 2026-09-17 (repository-status transition only; submission evidence remains dated July 2026)

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
| Required judge invitations | ISSUED TO CORRECT RECIPIENTS; BOTH PENDING | Repository `frankcom-it-service/accesspatch`; the invitation entered for `testing@devpost.com` resolves to GitHub account `devposttesting`; the direct `build-week-event@openai.com` invitation remains pending; neither invitation was cancelled, changed, duplicated, or resent; acceptance is controlled by the recipients; repository access and independent judge cloning remain unverified |
| Accessibility Mutation Guard | PHASE 5A CLEAN-CLONE VERIFIED / MERGED INTO `main` | Implementation `b05541f147a08cb0b38ecbda5ae5802db065a3d2`; integrated HEAD `e7701516f07c204c8ba5792dcf2c100c9b508222` by strict fast-forward without merge commit; mutation `CONTROLLED_MUTATION_ARIA_HIDDEN_FOCUSABLE`; rule `FOCUSABLE_ELEMENT_ARIA_HIDDEN`; clean clone `d75954b672cbc88569d5502198effc57c4390c63`; 17/17 stages; one offline install with 33 reused and zero downloaded; temporary clone-only trust override restored before runtime; mutation `1/1`; 178 tests and all eight Judge stages; archive SHA-256 `eec0095939e73ccf623b5d5f8d75af73a6b7f5d16e686c34dad0000629fd97d6`; `docs/hackathon/evidence/phase5a-clean-clone/`; local feature branch retained unpublished; no model call |
| Central Codex `/feedback` record | COMPLETE; POSITIVE; NO LOGS UPLOADED | Status `Feedback recorded`; Thread ID `019f65ad-d02e-7ce3-9029-bb6a480c3275`; `CODEX_SESSION_RECORD.md`; no separate Session ID invented |
| Final submission video | COMPLETE; PUBLIC; OWNER-VERIFIED LOGGED OUT | `https://www.youtube.com/watch?v=eCHig9YUwU0`; duration `2:49`; custom thumbnail; corrected 67-block timed English track `VIDEO_CAPTIONS.srt`; final caption end `00:02:48,662`; SRT SHA-256 `1d8bd5e0c3bac69e1fb07072a2c50b8cb5fe8a06bc266bc8986030f9d839730d`; `VIDEO_SCRIPT.md`; `VIDEO_PRIVACY_CHECKLIST.md` |
| Devpost submission | COMPLETE; SUBMITTED TO OPENAI BUILD WEEK | `https://devpost.com/software/accesspatch`; project `AccessPatch`; Developer Tools; Individual; Germany; final preview owner-reviewed; official rules and Devpost terms accepted; confirmation page showed the project as submitted; public URL retained |
| Signed-out public submission verification | COMPLETE; PROJECT-OWNER VERIFIED | In a signed-out/incognito browser, `https://devpost.com/software/accesspatch` loaded without authentication; the complete project story, public thumbnail, and project presentation were visible; the embedded `https://www.youtube.com/watch?v=eCHig9YUwU0` video was playable; no internal `/feedback` identifier, private judge instructions, credential or token, or private local path was visible; this is not independent judge verification |
| Final owner-controlled release gates | COMPLETE; OWNER-VERIFIED 2026-07-17 | Dedicated Devpost `/feedback` Session ID manually matched the internal record; final video confirmed free of unlicensed music and unauthorized third-party brands or media; final official-source review completed; frozen-tree secret, token, dependency, Judge Sample security, and diff gates passed; owner confirmations are not independent external verification |
| Devpost source copy | COMPLETE; SUBMITTED CONTENT RECORD | `DEVPOST_SUBMISSION_DRAFT.md`; title, category, tagline, short description, motivation, product, implementation, Codex, GPT-5.6, challenges, accomplishments, learning, next steps, technologies, judge access, limitations, and internal-only `/feedback` field record |

## Central Requirements

| Requirement | Level | Current status | Evidence file or artifact | Responsible phase | Latest target date | Open risk or blocker |
| --- | --- | --- | --- | --- | --- | --- |
| Working project using Codex and GPT-5.6 | Mandatory | CONTROLLED END-TO-END FEASIBILITY WORKFLOW COMMITTED | Phase 1–3 commits; tracked Judge Sample; Phase 3B evidence | Build and integration | 2026-07-20 02:00 CEST | Retained application, broad repositories, fallback/rollback, and production hosting remain open |
| One selected track | Mandatory | COMPLETE; DEVELOPER TOOLS SELECTED IN SUBMISSION | This ledger; `DEVPOST_SUBMISSION_DRAFT.md`; Devpost confirmation | Submission | 2026-07-17 | None for submitted category |
| Project description | Mandatory | COMPLETE; ENGLISH CONTENT ENTERED AND SUBMITTED | `DEVPOST_SUBMISSION_DRAFT.md`; `https://devpost.com/software/accesspatch` | Submission | 2026-07-17 | None for submitted content |
| Public YouTube demo, at most three minutes | Mandatory | COMPLETE; PUBLIC; ENTERED IN DEVPOST; OWNER-VERIFIED LOGGED OUT | `https://www.youtube.com/watch?v=eCHig9YUwU0`; final duration `2:49`; corrected uploaded `VIDEO_CAPTIONS.srt`; 67 blocks ending `00:02:48,662`; Devpost submission record | Demo and submission | 2026-07-17 | No independent automated YouTube fetch is claimed |
| Voiceover explains project, Codex use, and GPT-5.6 use | Mandatory | COMPLETE; FINAL VIDEO ENTERED IN DEVPOST | `VIDEO_SCRIPT.md` actual published narration; corrected uploaded `VIDEO_CAPTIONS.srt`; public video URL above; no live GPT-5.6 call; tracked evidence only | Demo and submission | 2026-07-17 | None for submitted video narrative |
| Code repository URL | Mandatory | CANONICAL PRIVATE URL ENTERED; ACCESS PENDING | `https://github.com/frankcom-it-service/accesspatch`; `PRIVATE_REPOSITORY_RELEASE_PLAN.md`; Devpost submission record | Submission | 2026-07-17 | Invitation acceptance and independent clone verification remain open |
| README setup and testing guidance | Mandatory | VERIFIED FOR CONTROLLED JUDGE PATH | `README.md`; `JUDGE_TEST_GUIDE.md`; Phase 3B clean-clone evidence | Build and verification | 2026-07-20 02:00 CEST | Broader-platform and final public-link guidance remain open |
| Primary build-thread `/feedback` identifier | Mandatory | COMPLETE; ENTERED IN DEDICATED DEVPOST FIELD | `CODEX_SESSION_RECORD.md`; internal form-entry record in `DEVPOST_SUBMISSION_DRAFT.md` | Submission | 2026-07-17 | Identifier remains excluded from public narrative |
| Developer Tools installation instructions | Mandatory | VERIFIED IN ONE CLEAN CLONE | `README.md`; `JUDGE_TEST_GUIDE.md`; `docs/hackathon/evidence/phase3b-clean-clone/` | Build and verification | 2026-07-20 02:00 CEST | Other operating systems and Playwright-managed browser fallback remain open |
| Supported platforms | Mandatory | VERIFIED LIMITED: DEBIAN 13 X86_64 | `JUDGE_TEST_GUIDE.md`; `environment-summary.txt` in Phase 3B evidence | Build and verification | 2026-07-20 02:00 CEST | Windows, macOS, other Linux distributions, architectures, and browser configurations unverified |
| Judge path without complete rebuild | Mandatory | ONE-COMMAND CLEAN-CLONE PATH VERIFIED; REQUIREMENT INTERPRETATION OPEN | `JUDGE_TEST_GUIDE.md`; `pnpm judge:verify`; `84db92f9e27b6f7872495516f166a8bcaed8ef03`; Phase 3B evidence | Demo and verification | 2026-07-21 02:00 CEST | Command intentionally performs a deterministic production build; confirm this satisfies final judging interpretation |
| Public repository with relevant license, or private sharing with specified judging addresses | Mandatory | PRIVATE REPOSITORY CREATED; CORRECT READ RECIPIENTS VERIFIED; INVITATIONS PENDING | `OWNERSHIP.md`; `PRIVATE_RELEASE_AND_PRIVACY_DECISION.md`; `PRIVATE_REPOSITORY_RELEASE_PLAN.md`; canonical private URL; `testing@devpost.com` resolved to `devposttesting`; direct `build-week-event@openai.com` invitation pending | Release | 2026-07-21 02:00 CEST | Recipient-controlled acceptance, repository access, and independent judge cloning remain unverified |
| Third-party licenses and attribution | Mandatory release control | REVIEW COMPLETE FOR CURRENT TREE | `THIRD_PARTY_NOTICES.md`; `pnpm-lock.yaml`; offline `pnpm licenses list --json` | Release | 2026-07-20 02:00 CEST | Repeat only if dependencies or assets change |
| Judge-accessible demo or sandbox | Recommended | LOCAL JUDGE PATH IMPLEMENTED; PRIVATE ACCESS PENDING | `JUDGE_TEST_GUIDE.md`; tracked Judge Sample; Phase 3B evidence; canonical private URL | Demo | 2026-07-21 02:00 CEST | Required read invitations remain pending; independent judge clone not verified |
| Fresh install and final link verification | Recommended | FRESH INSTALL VERIFIED ON DEBIAN; PUBLIC DEVPOST AND VIDEO LINKS OWNER-VERIFIED SIGNED OUT; PRIVATE ACCESS OPEN | `TEST_EVIDENCE.md`; `docs/hackathon/evidence/phase3b-clean-clone/`; `https://devpost.com/software/accesspatch`; public video URL; checklist | Verification release gate | 2026-07-17 | Repository invitation acceptance, private repository access, independent judge clone, and the broader all-link check remain open |
| Fixed MVP Proof Bundle inventory | Mandatory internal contract | GENERATOR, REVIEWED TRACKED SAMPLE, AND CLEAN-CLONE VALIDATION COMPLETE | Canonical contract in `DEMO_EVIDENCE.md`; generator `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`; Judge Sample `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce`; Phase 3B evidence | Build and evidence | 2026-07-20 02:00 CEST | Broader platforms and final public judge access remain open |

The full binding readiness checklist is `SUBMISSION_CHECKLIST.md`. The canonical Proof Bundle Contract and exact required filenames are in `DEMO_EVIDENCE.md`; generated runs remain ignored except for the independently reviewed `examples/judge-sample/` allowlist.

## Official Verification Status

The current official OpenAI Build Week [Rules](https://openai.devpost.com/rules), [FAQ](https://openai.devpost.com/details/faqs), and [Dates](https://openai.devpost.com/details/dates) pages received a final review on 2026-07-17. As applicable, they require a project built using Codex and GPT-5.6, one selected category, an English project description, and a public YouTube demonstration under three minutes with audio explaining the project and the use of Codex and GPT-5.6. They also prohibit unauthorized copyrighted music, media, and trademarks and require a repository URL; a private repository must be shared with `testing@devpost.com` and `build-week-event@openai.com`. The deadline remains 2026-07-21 at 17:00 Pacific Time, corresponding to 2026-07-22 at 02:00 CEST. The official text does not establish invitation acceptance as a prerequisite to submission, so the two pending recipient-controlled acceptances remain accurately open rather than treated as submission invalidation.

`HISTORICAL OFFICIAL-SOURCE INCONSISTENCY`: an earlier Rules-page body observed during preparation appeared to contain the title, dates, and content of an older 2025 OpenAI Open Model Hackathon. The final 2026-07-17 review used the current Rules, FAQ, and Dates pages above. Before submitting, the project owner reviewed the final Devpost preview and read and accepted the official rules and Devpost terms. The project was then successfully submitted to OpenAI Build Week.

## Timeline and Freeze

- Central Codex session start: 2026-07-15 at 14:11 Europe/Berlin.
- Internal feature freeze: 2026-07-20 at 02:00 CEST.
- Internal submission-ready target: 2026-07-21 at 02:00 CEST.
- Current official deadline: 2026-07-22 at 02:00 CEST.
- Final 24 hours: fixes, evidence, video, links, Devpost, and unexpected submission issues only.
- Coordination check at approximately 2026-07-15 14:19 CEST: about 107h40m to freeze, 131h40m to submission-ready, and 155h40m to the official deadline.
- `REQUIRED`: recalculate remaining time at the beginning of each project day.

After freeze, accept only evidence, documentation, and critical correctness or security fixes. Record every exception in `DECISIONS.md` and rerun affected proof.
