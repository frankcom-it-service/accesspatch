# Devpost Submission Draft

Everything in this file is a draft. Core requirements and the deadline were verified on 2026-07-15 against the current FAQ, overview, and announcement. Exact final fields and the inconsistent official Rules-page body require a fresh pre-submission check.

## Title

AccessPatch

## Tagline

`DRAFT`: Evidence-guided journey repair and proof for React/TypeScript applications.

## Problem

Accessibility defects often appear across an end-to-end journey rather than in an isolated component. Teams need a reviewable path from observed failure to bounded repair and repeatable evidence.

## Current Solution Direction

AccessPatch is planned to inspect a target journey, assemble local evidence, ask the GPT-5.6 Sol model (`gpt-5.6-sol`, current alias `gpt-5.6`) for a structured repair proposal, validate that proposal against a schema and deterministic safety rules, and generate before/after proof for human review.

**PARTIAL PRODUCT / PHASE 2A COMPLETE.** The controlled fixture produces normalized evidence, and one real bounded GPT-5.6 call produced a schema-valid, policy-accepted repair plan in commit `207e0559d0d7664a24dcb297fb40b37700f36208`. Commit `79ed0e60b2c7145f4113ecac3797a119ccb696ee` demonstrates isolated deterministic repair and a successful keyboard replay for exactly the two controlled findings. Commit `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3` generates the exact canonical Proof Bundle and static report; all 15 ignored generated files passed independent review. A curated tracked judge sample, retained application to a user-selected repository, broad repository support, a clean-machine judge workflow, and submission assets remain **NOT YET IMPLEMENTED**.

**PHASE 2B COMPLETE FOR THE CONTROLLED SCOPE:** commit `e3811c8bf968dc78701f8d264dc1377543059d64` adds an independently reviewed, officially sourced WCAG 2.2 mapping limited to `1.3.1`, `4.1.2`, and `2.4.7` for the two controlled findings. The ignored bundle is not yet the curated judge sample, and this mapping is not a conformance determination or certification.

## Built With

- `VERIFIED`: Codex CLI is the principal engineering tool for the project.
- `IMPLEMENTED FOR CONTROLLED FIXTURE`: React, TypeScript, Vite, Playwright, Chromium, and axe in a pnpm workspace.
- `PHASE 1B COMPLETE`: bounded GPT-5.6 Evidence-Based Repair Reasoner with Zod Structured Outputs and deterministic checks.
- `PHASE 1C CONTROLLED SCOPE COMPLETE`: isolated deterministic two-template repair, patch validation, and repaired replay.
- `PHASE 2A COMPLETE`: committed canonical bundle generator and independently reviewed real ignored bundle; a curated tracked judge sample remains open.
- `OPTIONAL`: Devpost Hackathon plugin for submission support, not engineering-session replacement.

## Evidence and Links

- Source repository: `TODO` — no remote URL exists.
- Live demo: `TODO` — no deployment exists.
- Video: `TODO` — no recording exists.
- Test evidence: `docs/hackathon/TEST_EVIDENCE.md`.
- Limitations: `docs/hackathon/LIMITATIONS.md`.

## Required Final Review

`TODO`: freshly verify the applicable Rules page, official fields, judging addresses, disclosures, link permissions, and every product claim immediately before submission. Current deadline: 2026-07-22 at 02:00 CEST.
