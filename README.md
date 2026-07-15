# AccessPatch

AccessPatch is a planned **Journey Repair and Proof Agent for React/TypeScript applications**, created for the Developer Tools track of OpenAI Build Week.

## Status

**Phase 0: documentation foundation only.** No application, dependency graph, demo, test suite, or model integration is implemented yet.

The product direction is to inspect an accessibility-critical user journey, propose evidence-based repairs, apply schema validation and deterministic safety checks, and produce reviewable proof artifacts. GPT-5.6 integration is planned as the repair reasoner, but AccessPatch API access and runtime integration are **NOT YET VERIFIED** and **NOT YET IMPLEMENTED**.

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

## Next Phase

`OPEN`: define and approve the minimal architecture in a separate task. Internal feature freeze is 2026-07-20 at 02:00 CEST; submission-ready target is 2026-07-21 at 02:00 CEST; the currently stated official deadline is 2026-07-22 at 02:00 CEST. Do not interpret this repository as a working product yet.
