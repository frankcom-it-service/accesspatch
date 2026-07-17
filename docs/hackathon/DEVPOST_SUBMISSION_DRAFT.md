# Devpost Submission Draft

This English draft is ready for later human review and form entry. External URLs and the Codex `/feedback` Session ID remain explicit placeholders. The applicable official rules and form fields must be rechecked immediately before submission.

## Project

- Title: AccessPatch
- Category: Developer Tools
- Tagline: Evidence-guided journey repair and reproducible proof for React and TypeScript applications.
- Private repository URL: `https://github.com/frankcom-it-service/accesspatch`
- Public YouTube URL: `TODO_PUBLIC_YOUTUBE_URL`
- Primary Codex `/feedback` Session ID: `TODO_CODEX_FEEDBACK_SESSION_ID`
- Final Devpost project URL: `TODO_FINAL_DEVPOST_PROJECT_URL`

## Problem

Accessibility barriers often break an end-to-end user journey rather than a single isolated component. Developers need a reviewable way to connect a real observed failure to bounded source context, a constrained repair strategy, deterministic changes, and reproducible before-and-after evidence.

## Why this matters to me

I believe many more digital projects should have a practical path to improving accessibility. Smaller development teams in particular need support that makes concrete barriers easier to identify, repair, and verify without pretending that automation can replace expert human review.

I see AccessPatch not as a complete solution, but as a deliberately limited first step toward making more digital experiences usable by more people.

## Target Users

AccessPatch is designed for React and TypeScript developers, accessibility engineers, QA engineers, and reviewers who need traceable evidence for a defined keyboard journey. The current feasibility scope is one controlled checkout fixture, not arbitrary repositories.

## Solution and Journey

The controlled demonstration:

1. Reproduces a checkout journey with two deliberate barriers: an email input without a programmatic accessible name and a primary action without a visible keyboard focus indicator.
2. Collects normalized Playwright and axe evidence with bounded source context.
3. Uses one bounded GPT-5.6 Structured Outputs call to propose exactly one approved repair strategy for each finding.
4. Applies deterministic templates in an isolated disposable repository copy rather than executing model output as source code.
5. Runs a repaired keyboard replay, verifies zero checkout-state axe violations, confirms visible focus, and reaches confirmation.
6. Packages the reviewed evidence into a canonical Proof Bundle and a static report.
7. Provides a tracked Judge Sample plus a one-command repository verification workflow.

## Differentiation

AccessPatch focuses on the chain from journey failure to reviewable proof. Model reasoning is deliberately separated from code mutation: GPT-5.6 selects from two bounded strategies, while schema validation, deterministic policy gates, predefined templates, hash checks, isolated execution, and replay decide whether evidence is accepted. The original broken fixture is preserved to keep the before state reproducible.

## Technical Implementation

- pnpm TypeScript workspace with React 19 and Vite.
- Chromium-only Playwright journeys and `@axe-core/playwright`.
- Versioned Zod schemas for findings, evidence, repair plans, verification, and audit metadata.
- Official OpenAI JavaScript SDK using `responses.parse`, Structured Outputs, `gpt-5.6-sol`, low reasoning, and `store: false`.
- Deterministic reasoner policy, source-context allowlists, path and symlink controls, and sanitized auditing.
- Deterministic two-template patch engine operating only in a disposable isolated copy.
- Generated repaired replay, patch policy, canonical Proof Bundle, source-backed controlled WCAG mapping, and static report.
- Curated tracked Judge Sample with fixed hashes and read-only validation.
- One-command Judge Workflow with isolated Git and npm/pnpm configuration.

## GPT-5.6 Use

One approved product call produced the bounded repair plan for the two controlled findings. The reviewed record reports status `completed`, 1,649 input tokens, 795 output tokens, 0 reasoning tokens, and 2,444 total tokens. No raw prompt, raw response, API key, project ID, or organization ID is committed. The model output was not applied directly.

## Codex Collaboration

Codex was the principal engineering tool and performed the majority of implementation and verification work under human coordination. It accelerated workspace and fixture scaffolding; schema, evidence, policy, patch-engine, Proof Bundle, validator, and Judge Workflow development; unit and Playwright testing; isolation hardening; and reproducibility, security, and audit documentation.

Human decisions defined the product scope, the two controlled barriers and fix classes, the single bounded model call, deterministic application boundary, preserved broken fixture, isolated replay strategy, claim limits, private-repository model, and final submission controls.

## Potential Impact and Novelty

The project demonstrates a practical developer workflow in which accessibility repair suggestions remain evidence-linked, bounded, reviewable, and reproducible. Its novelty is not a claim of automatic compliance; it is the combination of journey evidence, constrained model reasoning, deterministic repair templates, isolated replay, and a portable proof record.

## Installation and Judge Testing

Verified on Debian GNU/Linux 13 x86_64 with Node.js 24.18.0, pnpm 11.13.0, Git 2.47.3, and Chromium 148.0.7778.178:

```bash
pnpm install --frozen-lockfile
pnpm judge:verify
```

Read-only evidence path:

```bash
pnpm judge:sample:validate
```

Then open `examples/judge-sample/proof-bundle/report.html`. Windows, macOS, other Linux distributions, other architectures, broader browsers, and the Playwright-managed Chromium fallback remain unverified.

## Repository and Access

The submission repository is private at `https://github.com/frankcom-it-service/accesspatch` and is not offered under an open-source project license. Read-only invitations were issued to `testing@devpost.com` and `build-week-event@openai.com`; both remain pending. Invitation acceptance and independent judge cloning are not yet verified.

## Third-Party Acknowledgments

AccessPatch uses package-managed React, Vite, TypeScript, Playwright, axe-core integration, Zod, and the official OpenAI JavaScript SDK. Exact versions and license families are recorded in `docs/hackathon/THIRD_PARTY_NOTICES.md`. The project includes no third-party images, music, fonts, screenshots, logos, or video assets.

## Limitations and Claim Boundaries

- Only one controlled React checkout fixture, two finding IDs, and two deterministic fix classes are supported.
- No retained patch application into an arbitrary user repository, broad repository inspection, complete fallback, or rollback workflow exists.
- Human screen-reader, wording and label-adjacency, and visual-focus review remain required.
- The controlled WCAG mapping covers three criteria for two findings only.
- AccessPatch does not establish complete accessibility, WCAG conformance or certification, BFSG or EAA legal assurance, or replacement of disabled-user testing or qualified human review.
- A public video, accepted judging access, independent judge cloning, `/feedback` Session ID, and Devpost submission remain pending.

## Final Human Review

Before form entry, recheck the official rules, deadline, judging accounts, field limits, private repository access, link permissions, video visibility, disclosures, and every factual claim.
