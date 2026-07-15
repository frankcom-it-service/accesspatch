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

**PARTIAL / PHASE 1B PENDING COMMIT.** The controlled fixture now produces normalized evidence, and one real bounded GPT-5.6 call produced a schema-valid, policy-accepted repair plan. Patch application, repaired replay, reporting, Proof Bundle generation, arbitrary-repository support, and the full judge workflow remain **NOT YET IMPLEMENTED**.

## Built With

- `VERIFIED`: Codex CLI is the principal engineering tool for the project.
- `IMPLEMENTED FOR CONTROLLED FIXTURE`: React, TypeScript, Vite, Playwright, Chromium, and axe in a pnpm workspace.
- `PHASE 1B PENDING COMMIT`: bounded GPT-5.6 Evidence-Based Repair Reasoner with Zod Structured Outputs and deterministic checks.
- `OPTIONAL`: Devpost Hackathon plugin for submission support, not engineering-session replacement.

## Evidence and Links

- Source repository: `TODO` — no remote URL exists.
- Live demo: `TODO` — no deployment exists.
- Video: `TODO` — no recording exists.
- Test evidence: `docs/hackathon/TEST_EVIDENCE.md`.
- Limitations: `docs/hackathon/LIMITATIONS.md`.

## Required Final Review

`TODO`: freshly verify the applicable Rules page, official fields, judging addresses, disclosures, link permissions, and every product claim immediately before submission. Current deadline: 2026-07-22 at 02:00 CEST.
