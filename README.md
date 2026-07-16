# AccessPatch

AccessPatch is a **Journey Repair and Proof Agent for React/TypeScript applications** built for the Developer Tools track of OpenAI Build Week.

## Status

**Phase 1A through Phase 4C are complete; optional Phase 5A is clean-clone verified and committed on its local feature branch.** Commit `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf` contains the controlled checkout baseline. Commit `207e0559d0d7664a24dcb297fb40b37700f36208` adds real normalized evidence and a bounded GPT-5.6 repair-plan reasoner. Commit `79ed0e60b2c7145f4113ecac3797a119ccb696ee` adds deterministic isolated patching and a successfully verified repaired replay for the two controlled findings. Commit `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3` adds the canonical Proof Bundle generator. Commit `e3811c8bf968dc78701f8d264dc1377543059d64` adds the source-backed controlled WCAG 2.2 mappings. Commit `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce` adds the curated tracked Judge Sample and read-only validation. Commit `84db92f9e27b6f7872495516f166a8bcaed8ef03` adds the one-command Judge Workflow. Commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed` adds the reviewed Phase 3B clean-clone evidence. Commit `f3953994883af959fdd80d2d5e5985b7cb987fd5` adds the private release surface, ownership record, privacy decision, third-party notices, and current submission drafts. Commit `079b191ade0ee8eee457c0f8060586488386213a` records the verified canonical private repository and pending read-only judging access. Commit `b05541f147a08cb0b38ecbda5ae5802db065a3d2` adds the isolated Accessibility Mutation Guard on local branch `feature/accessibility-mutation-guard`; merge into `main` remains a separate pending decision.

The controlled end-to-end submission workflow is implemented and verified: it reproduces two defined barriers, collects bounded evidence, obtains a constrained repair plan, applies deterministic templates in an isolated copy, verifies the repaired replay, packages the reviewed proof, and provides a one-command Judge Workflow. On 2026-07-15, one approved Phase 1B `gpt-5.6-sol` call produced the schema-valid, policy-accepted plan using bounded evidence and `store: false`. General arbitrary-repository support, retained patch application, complete fallback, and rollback remain incomplete.

AccessPatch supports accessibility engineering; it does not claim complete accessibility, WCAG certification, BFSG or EAA legal assurance, or replacement of disabled-user testing or qualified human review.

## Ownership and Repository Access

- Owner: Frank Heilmann, trading as “Frankcom IT Service”.
- Canonical private repository: `https://github.com/frankcom-it-service/accesspatch`.
- The repository is owned by the `frankcom-it-service` organization, remains private, and uses `main` as its default branch.
- AccessPatch is not offered under an open-source project license.
- Ownership and reuse boundaries are recorded in `OWNERSHIP.md`.
- The immutable baseline backup branch and tag are present remotely. The Phase 4B release branch remains local-only.
- Both required judging invitations were issued with read permission and remain pending. Acceptance and independent judge cloning are not yet verified.
- The organization repository URL above is the only canonical repository URL; no public source-code release exists.

## Project Record

- Minimal initial README baseline: commit `0ac10988053a301c89689b8ce8fbd7e6aecd481f` (`chore: document initial hackathon repository`, 2026-07-15). It contains a three-line README and is not an empty commit.
- Phase 1A controlled checkout baseline: commit `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf` (`feat: add controlled checkout baseline`, 2026-07-15).
- Phase 1B bounded evidence repair reasoner: commit `207e0559d0d7664a24dcb297fb40b37700f36208` (`feat: add bounded evidence repair reasoner`, 2026-07-15).
- Phase 1C isolated deterministic repair replay: commit `79ed0e60b2c7145f4113ecac3797a119ccb696ee` (`feat: add isolated deterministic repair replay`, 2026-07-15).
- Phase 2A canonical Proof Bundle generator: commit `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3` (`feat: add canonical proof bundle generator`, 2026-07-15).
- Phase 2B source-backed WCAG mappings: commit `e3811c8bf968dc78701f8d264dc1377543059d64` (`feat: add source-backed WCAG mappings`, 2026-07-15).
- Phase 2C curated Judge Sample: commit `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce` (`feat: add curated judge sample`, 2026-07-16).
- Phase 3A one-command Judge Workflow: commit `84db92f9e27b6f7872495516f166a8bcaed8ef03` (`feat: add one-command judge verification`, 2026-07-16).
- Phase 3B clean-clone evidence: commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed` (`docs: add Phase 3B clean-clone evidence`, 2026-07-16).
- Phase 4B private release surface: commit `f3953994883af959fdd80d2d5e5985b7cb987fd5` (`docs: prepare private release surface`, 2026-07-16).
- Phase 4C private repository access state: commit `079b191ade0ee8eee457c0f8060586488386213a` (`docs: record private repository access state`, 2026-07-16).
- Codex is the principal engineering tool. This continuing Codex session is the central development session.
- The Devpost Hackathon plugin is a planned optional submission-support tool only; it does not replace the Codex engineering session.
- Core submission requirements and the deadline were checked on 2026-07-15 against the current FAQ, overview, and announcement. The returned official Rules-page body appears stale and remains an open source inconsistency requiring a fresh pre-submission check.
- Submission facts and evidence status: `docs/hackathon/SUBMISSION_LEDGER.md`.
- Current limitations: `docs/hackathon/LIMITATIONS.md`.
- Security posture: `docs/hackathon/SECURITY.md`.

## How Codex Accelerated the Work

Codex is the principal engineering tool and performed the majority of implementation and verification work under human coordination. Concrete contributions include:

- pnpm workspace and controlled React checkout scaffolding;
- normalized evidence and versioned schema design;
- deterministic reasoner policy and isolated patch-engine implementation;
- API-free unit tests and Playwright journey tests;
- canonical Proof Bundle generation and validation;
- tracked Judge Sample verification;
- the one-command Judge Workflow;
- Git, npm/pnpm, symlink, credential, and clean-clone isolation hardening;
- security, audit, evidence, and reproducibility documentation.

Codex accelerated engineering work; it did not make autonomous product, legal, privacy, licensing, or submission decisions.

## Important Human Decisions

Human coordination deliberately limited the submission scope to one controlled journey, exactly two original barriers, and exactly two deterministic repair classes. The user approved one bounded GPT-5.6 product reasoning call and required model output never to be applied directly as source code. Deterministic templates and policy gates implement the approved strategies.

The original fixture remains broken for reproducibility, while repaired replay runs only in an isolated disposable copy. Human review remains required, and the project makes no accessibility certification or legal-compliance claim. The user also chose private repository judging, declined broad arbitrary-repository support before submission, and created immutable emergency baseline references and backups before further release work.

## GPT-5.6 and Codex Contribution Boundary

GPT-5.6 produced one bounded structured repair plan using `store: false`; the reviewed token usage is recorded in the committed governance and audit evidence. Deterministic code validated and implemented the approved strategies. No raw prompt, raw response, API key, project ID, or organization ID is included in the repository.

Codex performed the majority of implementation and verification work under human coordination. Final product, scope, safety, privacy, licensing, and submission decisions remained human-controlled.

## Canonical Proof Bundle Contract

Phase 2A generates the fixed 11-entry contract from the reviewed Phase 1 artifacts under ignored `.accesspatch/runs/phase2/proof-bundle/`. `summary.json` is the non-circular manifest: it hashes every generated file except itself. Every artifact comes from real reviewed evidence; no result is fabricated. Phase 2B adds exactly three source-backed WCAG 2.2 mappings for the two controlled findings. Phase 2C tracks the independently reviewed byte-identical sample only under `examples/judge-sample/`; other generated runs remain ignored. The canonical inventory is in `docs/hackathon/DEMO_EVIDENCE.md`, and mapping provenance is in `docs/hackathon/WCAG_MAPPING_SOURCES.md`.

## Phase 1A Workspace

- `apps/demo-checkout/`: local React 19, TypeScript, and Vite checkout fixture.
- `tests/e2e/`: Chromium-only Playwright smoke and controlled keyboard-baseline tests using `@axe-core/playwright`.
- Root workspace: pnpm `11.13.0`, shared TypeScript configuration, Playwright configuration, and pinned `pnpm-lock.yaml`.

```bash
pnpm install
pnpm browser:install
pnpm typecheck
pnpm build
pnpm test:smoke
pnpm test:baseline
```

The local and Phase 3B clean-clone runs used system Chromium at `/usr/bin/chromium`. On a machine without an explicit `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` or local system Chromium, run `pnpm browser:install` to install Playwright Chromium. That fallback and platforms beyond the verified Debian GNU/Linux 13 x86_64 environment remain **NOT YET VERIFIED**.

`pnpm test:baseline` is intentionally expected to exit non-zero until a later repair step. It reports exactly two controlled barriers: the checkout email input has no accessible name, and the primary continue button has no visible outline or box-shadow focus cue. Generated reports, traces, screenshots, and test artifacts remain ignored.

## Phase 1B Components

- `packages/shared-types/`: versioned Zod schemas for evidence, repair plans, and sanitized audit metadata.
- `packages/evidence-collector/`: real Playwright journey evidence with allowlisted, bounded source excerpts.
- `packages/repair-reasoner/`: structured GPT-5.6 planning plus a deterministic rejection policy.

```bash
pnpm test:unit
pnpm phase1:evidence
# Requires OPENAI_API_KEY in the invoking environment; never commit credentials.
pnpm phase1:reason
```

Generated Phase 1B runs are written under ignored `.accesspatch/runs/`. The plan selected only explicit label association and visible-focus restoration; Phase 1C mapped those bounded strategies to deterministic templates rather than interpreting model output as source code. The plan is not a patch, a compliance certification, or proof of complete accessibility.

## Phase 1C Isolated Feasibility Proof

- `packages/patch-engine/`: validates the reviewed Phase 1B hashes and plan, copies the repository without Git, credentials, dependencies, builds, test output, or prior runs, and maps the two approved fix classes to exact deterministic templates.
- `pnpm phase1:repair`: applies those templates only in a disposable working copy, produces a two-file unified diff, builds the copy, and runs a generated keyboard replay before cleanup.
- Generated Phase 1C feasibility artifacts remain ignored under `.accesspatch/runs/phase1c/`; they are not the complete Proof Bundle.
- Ephemeral copies under `.accesspatch/work/` are ignored. The copy step retains source tests, excludes generated build/test output and common credential files, and rejects included symlinks without following them.

An approved controlled rerun completed successfully after correcting the initial Git-hash schema defect. It reproduced the reviewed patch and replay hashes, reached confirmation with zero axe violations and a computed `3px solid` focus outline, wrote all five Phase 1C artifacts, and removed the disposable copy. The controlled main fixture remains unchanged and intentionally failing. These ignored feasibility artifacts are not the complete Proof Bundle.

Phase 1C is committed in `79ed0e60b2c7145f4113ecac3797a119ccb696ee`. Its scope remains one controlled React fixture, exactly two finding IDs, and exactly two deterministic fix classes.

## Phase 2A Proof Bundle

- `packages/proof-bundle/`: validates reviewed source hashes and schemas, generates the exact canonical inventory in a temporary directory, scans it for unsafe content, and atomically publishes only after all checks pass.
- `pnpm phase2:bundle`: generates the ignored canonical bundle once from existing Phase 1 evidence without rerunning the model or repair engine.
- `pnpm phase2:validate`: independently validates inventory, schemas, manifest hashes, copied bytes, CSV ordering, report structure, safety boundaries, and deterministic policies.
- `pnpm test:report`: opens the static local report in Chromium and runs structural, keyboard-focus, and axe smoke checks.

The independently reviewed Phase 2B regenerated static report passed its structural and automated axe smoke with zero violations. The independent review covered the source, mapping files, report, manifest, and all 15 ignored artifacts. This is not a complete accessibility audit or certification; screen-reader, label-adjacency, and visual-focus review remain required.

## Phase 2B Controlled WCAG Mapping

The committed Phase 2B mapping is limited to WCAG 2.2 criteria `1.3.1` and `4.1.2` for the email accessible-name finding, and `2.4.7` for the focus-visible finding. The visible email text means the controlled defect is not mapped to `3.3.2`. The generator validates exact criterion labels, levels, official W3C URLs, cross-file agreement, manual-review requirements, and non-certification boundaries. WCAG criteria are normative; the cited Understanding documents are informative. This mapping is evidence-oriented, not a conformance determination or certification.

## Phase 2C Curated Judge Sample

`examples/judge-sample/` is the committed, independently reviewed Judge Sample. Its 17 tracked files comprise `README.md`, `SHA256SUMS`, and 15 Proof Bundle files byte-identical to the reviewed Phase 2B run. Run `pnpm judge:sample:validate` for read-only, network-free validation and `pnpm test:judge-sample-report` for the tracked report smoke. Phase 3A and Phase 3B separately provide the one-command workflow and one verified clean Debian clone.

## Phase 3A Judge Workflow

**COMPLETE** in implementation commit `84db92f9e27b6f7872495516f166a8bcaed8ef03`. After installing the locked dependencies, the primary judge path is:

```bash
pnpm install --frozen-lockfile
pnpm judge:verify
```

The eight stages are repository-contract preflight, API-free unit tests, TypeScript type-check, production build, application smoke, passing controlled-baseline proof, tracked Judge Sample validation, and tracked report smoke. `pnpm test:baseline` remains the intentionally failing developer diagnostic; `pnpm test:judge-baseline` is the hard-assertion passing proof that the exact two controlled defects still exist.

The first lifetime workflow execution failed at the unit stage because legacy Proof Bundle tests depended on ignored Phase 1 artifacts. The tests now reconstruct hash-verified fixtures from the committed Judge Sample. Independent review then identified incomplete Git/npm home-configuration isolation; the committed workflow creates empty restricted Git and npm/pnpm configuration under its reserved ignored directory, redirects every Git and pnpm child away from user and system configuration, disables credential prompting, and cleans the runtime configuration on every exit path.

The corrected second lifetime execution passed all eight stages exactly once with `.accesspatch/runs/` absent and 139 API-free tests passing. The Judge Sample remained byte- and mtime-identical, all 23 ignored reviewed-run hashes were restored unchanged, and no third execution occurred. The stable result ended with `JUDGE_WORKFLOW_VALID`.

## Phase 3B Clean-Clone Evidence

On 2026-07-16, a fresh clone created from committed Git history at source HEAD `7d0653cd344cf15be448ed9ef62b41b74c0d67ef` completed `pnpm install --frozen-lockfile` once and `pnpm judge:verify` once, both with exit `0` and no retry. The workflow passed all eight stages and 139 API-free tests while `.accesspatch/runs/` was absent. The verified environment was Debian GNU/Linux 13, x86_64, Node.js 24.18.0, pnpm 11.13.0, Git 2.47.3, and Chromium 148.0.7778.178.

The independently reviewed sanitized evidence archive and extracted checksum-protected records are committed under `docs/hackathon/evidence/phase3b-clean-clone/` in `8d2afef856d48d07ffb77013ad7385dd3810a4ed`. The archive is tracked as non-executable Git mode `100644`. Installation used package-registry access and emitted transient retry warnings; the Judge Workflow itself remained API-free, and its monitor observed no external TCP connection. Other operating systems and browser configurations remain unverified.

## Judge Paths

Full verified path:

```bash
pnpm install --frozen-lockfile
pnpm judge:verify
```

Read-only evidence path without rebuilding:

```bash
pnpm judge:sample:validate
```

Then open `examples/judge-sample/proof-bundle/report.html`.

The full path is verified only on Debian GNU/Linux 13 x86_64 with the environment recorded in Phase 3B evidence. Windows, macOS, other Linux distributions, other architectures, broader browsers, and the Playwright-managed Chromium fallback remain **NOT YET VERIFIED**.

## Optional Accessibility Mutation Guard

Phase 5A adds one API-free competition extension on local branch `feature/accessibility-mutation-guard`:

```bash
pnpm mutation:guard
```

The command binds fixture ID `demo-checkout-controlled-v1` to approved four-file SHA-256 `50a88ce11e4afc62f66c595b313156f2f1a7f1fc98eb2f6ad1206b8260fbbfd4`, copies only those allowlisted files into an ignored disposable directory, injects `aria-hidden="true"` exactly once on the existing keyboard-focusable checkout submit button, and uses a deterministic Playwright detector to confirm rule `FOCUSABLE_ELEMENT_ARIA_HIDDEN`. Child HOME, configuration, cache, application-data, and temporary paths remain beneath one unique disposable browser-runtime root; real user configuration and credential paths are not supplied. Fixed `.accesspatch` work and evidence chains reject symlinks, non-directory ancestors, and repository escapes. Detector and browser configuration is fully prepared before Vite starts; every post-spawn path is cleanup-protected, and contained-copy plus external-browser cleanup is attempted and verified independently.

Two consecutive executions after the final lifecycle correction produced the same stable output and byte-identical ignored evidence. The existing eight-stage `pnpm judge:verify` workflow then passed once with the expanded 178-test API-free suite; it is not modified to include the optional guard.

Signal interruption is directly tested during detector observation and server waiting; both paths stop the child process, remove disposable state, write no success artifact, and preserve the retained fixture. Spawn-error, post-start failure, and independent cleanup-failure paths are also tested. This extension supports exactly one mutation class in the fixed controlled fixture and the Chromium-controlled path only. It makes no broad mutation-testing, arbitrary-repository, complete WCAG, certification, legal-compliance, retained-patching, fallback, rollback, or human-review replacement claim. It does not call GPT-5.6 and does not alter the Proof Bundle contract or tracked Judge Sample.

Phase 5A is **CLEAN-CLONE VERIFIED / COMMITTED ON FEATURE BRANCH** in implementation commit `b05541f147a08cb0b38ecbda5ae5802db065a3d2`. Final implementation review passed with archive SHA-256 `d2d63d1c708b57e000fe915092ac70c4f457608eededf0e96757b7a0c56a3c91`. The independently reviewed clean clone at feature HEAD `d75954b672cbc88569d5502198effc57c4390c63` passed all 17 acceptance stages exactly once on Debian GNU/Linux 13 x86_64 with Node `v24.18.0`, pnpm `11.13.0`, Git `2.47.3`, and Chromium `148.0.7778.178`. Its single offline frozen installation reused 33 packages and downloaded zero. A disposable-clone-only `trustLockfile: true` setting bypassed offline trust-metadata revalidation and was restored byte-for-byte before `pnpm mutation:guard` or `pnpm judge:verify`.

The clean clone detected exactly one injected mutation, passed all eight Judge Workflow stages with 178 API-free tests, and preserved fixture SHA-256 `50a88ce11e4afc62f66c595b313156f2f1a7f1fc98eb2f6ad1206b8260fbbfd4`. Stable ignored evidence remained `0012aea061beb4d2d5dd7b72728043fa7c5882cf47b625be921186735865b3d0` for `result.json` and `5f382756c9908b45c699556bf787074573f03b24354094567fdc315d0159f2ac` for `result.md`; the tracked repaired report had zero axe violations. The sanitized acceptance archive SHA-256 is `eec0095939e73ccf623b5d5f8d75af73a6b7f5d16e686c34dad0000629fd97d6`, with its extracted records tracked under `docs/hackathon/evidence/phase5a-clean-clone/`. The feature remains limited to one mutation class, one controlled fixture, and the verified Debian/Chromium path. The branch remains local-only; `main` and the immutable emergency baseline remain unchanged. Merge into `main` requires separate approval.

## Next Phase

`OPEN`: verify acceptance of both pending read-only judging invitations and an independent judge clone; collect `/feedback`; produce and publish the reviewed video; enter and verify Devpost fields and links; verify additional operating systems and browser configurations; and design retained user-selected patch handling, fallback, and rollback. Broad-repository support remains open. Internal feature freeze is 2026-07-20 at 02:00 CEST; submission-ready target is 2026-07-21 at 02:00 CEST; the currently stated official deadline is 2026-07-22 at 02:00 CEST. Do not interpret the controlled fixture, feasibility repair, Judge Sample, or bounded judge workflow as the completed AccessPatch product.
