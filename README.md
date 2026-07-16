# AccessPatch

AccessPatch is a planned **Journey Repair and Proof Agent for React/TypeScript applications**, created for the Developer Tools track of OpenAI Build Week.

## Status

**Phase 1A, Phase 1B, the controlled Phase 1C feasibility scope, Phase 2A, Phase 2B, and Phase 2C are complete.** Commit `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf` contains the controlled checkout baseline. Commit `207e0559d0d7664a24dcb297fb40b37700f36208` adds real normalized evidence and a bounded GPT-5.6 repair-plan reasoner. Commit `79ed0e60b2c7145f4113ecac3797a119ccb696ee` adds deterministic isolated patching and a successfully verified repaired replay for the two controlled findings. Commit `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3` adds the canonical Proof Bundle generator. Commit `e3811c8bf968dc78701f8d264dc1377543059d64` adds the source-backed controlled WCAG 2.2 mappings. Commit `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce` adds the curated tracked Judge Sample and read-only validation.

The product direction is to inspect an accessibility-critical user journey, propose evidence-based repairs, apply schema validation and deterministic safety checks, and produce reviewable proof artifacts. On 2026-07-15, one approved Phase 1B `gpt-5.6-sol` call produced a schema-valid, policy-accepted plan for the two controlled findings using bounded evidence and `store: false`. The broader workflow remains incomplete.

AccessPatch will support accessibility engineering; it will not claim complete accessibility, WCAG certification, BFSG or EAA legal assurance, or replacement of disabled-user testing or qualified human review.

## Project Record

- Minimal initial README baseline: commit `0ac10988053a301c89689b8ce8fbd7e6aecd481f` (`chore: document initial hackathon repository`, 2026-07-15). It contains a three-line README and is not an empty commit.
- Phase 1A controlled checkout baseline: commit `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf` (`feat: add controlled checkout baseline`, 2026-07-15).
- Phase 1B bounded evidence repair reasoner: commit `207e0559d0d7664a24dcb297fb40b37700f36208` (`feat: add bounded evidence repair reasoner`, 2026-07-15).
- Phase 1C isolated deterministic repair replay: commit `79ed0e60b2c7145f4113ecac3797a119ccb696ee` (`feat: add isolated deterministic repair replay`, 2026-07-15).
- Phase 2A canonical Proof Bundle generator: commit `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3` (`feat: add canonical proof bundle generator`, 2026-07-15).
- Phase 2B source-backed WCAG mappings: commit `e3811c8bf968dc78701f8d264dc1377543059d64` (`feat: add source-backed WCAG mappings`, 2026-07-15).
- Phase 2C curated Judge Sample: commit `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce` (`feat: add curated judge sample`, 2026-07-16).
- Codex is the principal engineering tool. This continuing Codex session is intended to become the central development session.
- The Devpost Hackathon plugin is a planned optional submission-support tool only; it does not replace the Codex engineering session.
- Core submission requirements and the deadline were checked on 2026-07-15 against the current FAQ, overview, and announcement. The returned official Rules-page body appears stale and remains an open source inconsistency requiring a fresh pre-submission check.
- Submission facts and evidence status: `docs/hackathon/SUBMISSION_LEDGER.md`.
- Current limitations: `docs/hackathon/LIMITATIONS.md`.
- Security posture: `docs/hackathon/SECURITY.md`.

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

The verified local run used system Chromium at `/usr/bin/chromium`. On a clean machine, run `pnpm browser:install` to install Playwright Chromium when no explicit `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` or local system Chromium is available. Clean-install and cross-platform verification remain **NOT YET VERIFIED**.

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

`examples/judge-sample/` is the committed, independently reviewed Judge Sample. Its 17 tracked files comprise `README.md`, `SHA256SUMS`, and 15 Proof Bundle files byte-identical to the reviewed Phase 2B run. Run `pnpm judge:sample:validate` for read-only, network-free validation and `pnpm test:judge-sample-report` for the tracked report smoke. Phase 2C is not the final clean-machine or one-command judge workflow.

## Phase 3A Judge Workflow

**COMPLETE** in implementation commit `84db92f9e27b6f7872495516f166a8bcaed8ef03`. After installing the locked dependencies, the primary judge path is:

```bash
pnpm install --frozen-lockfile
pnpm judge:verify
```

The eight stages are repository-contract preflight, API-free unit tests, TypeScript type-check, production build, application smoke, passing controlled-baseline proof, tracked Judge Sample validation, and tracked report smoke. `pnpm test:baseline` remains the intentionally failing developer diagnostic; `pnpm test:judge-baseline` is the hard-assertion passing proof that the exact two controlled defects still exist.

The first lifetime workflow execution failed at the unit stage because legacy Proof Bundle tests depended on ignored Phase 1 artifacts. The tests now reconstruct hash-verified fixtures from the committed Judge Sample. Independent review then identified incomplete Git/npm home-configuration isolation; the committed workflow creates empty restricted Git and npm/pnpm configuration under its reserved ignored directory, redirects every Git and pnpm child away from user and system configuration, disables credential prompting, and cleans the runtime configuration on every exit path.

The corrected second lifetime execution passed all eight stages exactly once with `.accesspatch/runs/` absent and 139 API-free tests passing. The Judge Sample remained byte- and mtime-identical, all 23 ignored reviewed-run hashes were restored unchanged, and no third execution occurred. The stable result ended with `JUDGE_WORKFLOW_VALID`.

## Next Phase

`OPEN`: verify the committed judge workflow from a clean environment; design retained user-selected patch handling, fallback, and rollback; and prepare submission assets. Broad-repository and broader-platform support remain open. Internal feature freeze is 2026-07-20 at 02:00 CEST; submission-ready target is 2026-07-21 at 02:00 CEST; the currently stated official deadline is 2026-07-22 at 02:00 CEST. Do not interpret the controlled fixture, feasibility repair, Judge Sample, or bounded judge workflow as the completed AccessPatch product.
