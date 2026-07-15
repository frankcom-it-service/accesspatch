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
- Status: product role **NOT YET IMPLEMENTED**; dedicated-project authentication and minimal `gpt-5.6-sol` response access verified 2026-07-15.

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

## Open Decisions

- `OPEN`: supported journey input and proof-bundle formats.
- `OPEN`: deterministic repair allowlist, rollback, and review gates.
- `OPEN`: repository visibility path, license, judging addresses, and final applicable Rules-page interpretation.
