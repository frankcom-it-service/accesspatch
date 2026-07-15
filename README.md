# AccessPatch

AccessPatch is a planned **Journey Repair and Proof Agent for React/TypeScript applications**, created for the Developer Tools track of OpenAI Build Week.

## Status

**Phase 1A: controlled demo baseline, commit pending.** A local React checkout fixture, a passing smoke test, and an intentionally failing two-barrier keyboard baseline now exist. The AccessPatch repair engine and GPT-5.6 product integration remain **NOT YET IMPLEMENTED**.

The product direction is to inspect an accessibility-critical user journey, propose evidence-based repairs, apply schema validation and deterministic safety checks, and produce reviewable proof artifacts. Dedicated-project authentication and a minimal `gpt-5.6-sol` Responses API call were human-verified on 2026-07-15. The AccessPatch product integration remains **NOT YET IMPLEMENTED**.

AccessPatch will support accessibility engineering; it will not claim complete accessibility, WCAG certification, BFSG or EAA legal assurance, or replacement of disabled-user testing or qualified human review.

## Project Record

- Minimal initial README baseline: commit `0ac10988053a301c89689b8ce8fbd7e6aecd481f` (`chore: document initial hackathon repository`, 2026-07-15). It contains a three-line README and is not an empty commit.
- Codex is the principal engineering tool. This continuing Codex session is intended to become the central development session.
- The Devpost Hackathon plugin is a planned optional submission-support tool only; it does not replace the Codex engineering session.
- Core submission requirements and the deadline were checked on 2026-07-15 against the current FAQ, overview, and announcement. The returned official Rules-page body appears stale and remains an open source inconsistency requiring a fresh pre-submission check.
- Submission facts and evidence status: `docs/hackathon/SUBMISSION_LEDGER.md`.
- Current limitations: `docs/hackathon/LIMITATIONS.md`.
- Security posture: `docs/hackathon/SECURITY.md`.

## Planned Proof Bundle Contract

The MVP is planned to produce a fixed, reviewable Proof Bundle from a real run. Every artifact must be reproducible, tied to a commit, and never fabricated. The exact **NOT YET IMPLEMENTED** inventory and preservation rules are canonical in `docs/hackathon/DEMO_EVIDENCE.md`. Generated proof runs remain ignored by default; any curated judge-visible sample requires an explicitly reviewed tracked location or allowlist.

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

## Next Phase

`OPEN`: add structured evidence, repair planning, controlled patches, replay, and Proof Bundle generation in later approved phases. Internal feature freeze is 2026-07-20 at 02:00 CEST; submission-ready target is 2026-07-21 at 02:00 CEST; the currently stated official deadline is 2026-07-22 at 02:00 CEST. Do not interpret the controlled fixture as the completed AccessPatch product.
