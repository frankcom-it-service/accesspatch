# Devpost Submission Record

This English source copy records the content entered for the completed AccessPatch submission to OpenAI Build Week. The project owner reviewed the final Devpost preview, read and accepted the official rules and Devpost terms, and successfully submitted the project.

## Project

- **Title:** AccessPatch
- **Event:** OpenAI Build Week
- **Category:** Developer Tools
- **Submitter type:** Individual
- **Country of residence:** Germany
- **Tagline:** Evidence-guided journey repair and reproducible proof for React and TypeScript applications.
- **Short description:** AccessPatch reproduces a broken keyboard journey, creates a bounded GPT-5.6 repair plan, applies deterministic fixes in an isolated copy, replays the same journey, and produces a verifiable Proof Bundle.
- **Devpost project:** `https://devpost.com/software/accesspatch`
- **Private repository:** `https://github.com/frankcom-it-service/accesspatch`
- **Public video:** `https://www.youtube.com/watch?v=eCHig9YUwU0`
- **Submission status:** Submitted to OpenAI Build Week; confirmation page reviewed and public project URL retained.

## Inspiration / Why this matters to me

I believe many more digital projects should have a practical path to improving accessibility. Smaller development teams in particular need support that makes concrete barriers easier to identify, repair, and verify without pretending that automation can replace expert human review.

I see AccessPatch not as a complete solution, but as a deliberately limited first step toward making more digital experiences usable by more people.

## What It Does

AccessPatch is a controlled Journey Repair and Proof Agent for React and TypeScript applications. The current demonstration follows one configured keyboard journey through a sample checkout and connects an observed barrier to bounded source evidence, a constrained repair plan, deterministic changes, replay, and reviewable proof.

It is designed for React and TypeScript developers, accessibility engineers, QA engineers, and reviewers who need traceable evidence for a defined keyboard journey.

The demonstrated workflow:

1. Reproduces two deliberate barriers: an email field without a programmatically associated accessible name and a focused primary action without a visible focus cue.
2. Collects normalized Playwright and axe evidence from the journey with bounded source context.
3. Uses one bounded GPT-5.6 product call to select one allowlisted repair strategy for each finding.
4. Applies predefined deterministic templates in a disposable isolated application copy; model output is never written or applied directly as source code.
5. Replays the same keyboard journey, reaches confirmation, reports zero checkout-state axe violations, and verifies a visible solid three-pixel focus outline.
6. Produces a fifteen-file Proof Bundle containing findings, the repair plan, exact diff, replay and verification evidence, audit records, manual-review boundaries, and three source-backed WCAG mappings.
7. Runs the optional Mutation Guard, which injects and detects one controlled `ARIA-hidden` regression in another disposable copy while preserving the original fixture.

## How It Was Built

AccessPatch is a pnpm TypeScript workspace with a React and Vite checkout fixture. Playwright and `@axe-core/playwright` reproduce the keyboard journey and collect browser evidence. Zod schemas define findings, repair plans, verification results, audit records, and Mutation Guard output.

The repair boundary is deliberately split. GPT-5.6 may select only allowlisted strategies from bounded evidence. Deterministic policy checks, fixture hashes, exact source templates, path and symlink controls, and isolated execution decide whether a plan can proceed. Repair and mutation demonstrations operate only in disposable copies; the original controlled fixture remains unchanged.

The committed judge path validates the repository contract, 178 API-free tests, TypeScript, the production build, the application smoke, the controlled broken baseline, the tracked Judge Sample, and the tracked report in an eight-stage Judge Workflow. A separate seventeen-stage clean-clone verification proved offline dependency materialization, Mutation Guard execution, the complete Judge Workflow, evidence stability, and cleanup on Debian GNU/Linux 13 x86_64 with Chromium.

## How Codex Was Used

Codex CLI was the primary engineering environment under human coordination. It performed most workspace and fixture scaffolding; schema, evidence, policy, patch-engine, Proof Bundle, validator, Judge Workflow, and Mutation Guard implementation; unit and Playwright testing; lifecycle and isolation hardening; clean-clone verification; and reproducibility, security, and governance documentation.

Human decisions controlled product scope, the two original barriers, the two deterministic repair classes, the single bounded model call, privacy and licensing posture, claim boundaries, release gates, and the decision not to expand into a broad Journey Gate before submission.

## How GPT-5.6 Was Used

One approved `gpt-5.6-sol` product call reviewed normalized evidence for the two controlled findings. The request used Structured Outputs, low reasoning, no tools, no retry, and `store: false`. The reviewed audit reports 1,649 input tokens, 795 output tokens, zero reasoning tokens, and 2,444 total tokens.

GPT-5.6 selected two allowlisted strategies: associate the visible email label with the input and restore the controlled focus indicator. Schema validation and deterministic policy accepted the plan. GPT-5.6 did not write, execute, or directly apply source code.

## Challenges Encountered

- **Keeping model reasoning bounded:** repair suggestions had to remain useful without allowing model-generated code to mutate the repository. The solution was a versioned schema, an allowlisted strategy vocabulary, deterministic policy, exact templates, and replay evidence.
- **Making proof independent of ignored development artifacts:** the first Judge Workflow execution exposed legacy tests that depended on ignored Phase 1 files. The corrected tests reconstruct hash-verified fixtures from the committed Judge Sample.
- **Isolating execution safely:** Git, npm/pnpm, child HOME/config/cache/temp paths, browser profiles, work roots, and cleanup required fail-closed handling for credentials, symlinks, path escapes, process errors, signals, and partial failures.
- **Proving reproducibility:** clean-clone verification had to use committed content, restore a temporary clone-only lockfile-trust setting before runtime, reuse the offline package store without downloads, and leave the source repository unchanged.

## Accomplishments

- Implemented and verified the complete controlled journey: broken baseline, bounded GPT-5.6 plan, deterministic isolated repair, same-journey replay, and Proof Bundle.
- Preserved the original deliberately broken fixture while the repaired replay reached confirmation with zero checkout-state axe violations and a visible solid `3px` outline.
- Added a deterministic Mutation Guard that injected and detected exactly one controlled regression, preserved the fixture, and cleaned all temporary runtime state.
- Passed exactly 178 API-free tests and all eight Judge Workflow stages.
- Passed all seventeen stages of the final Phase 5A clean-clone verification.
- Published a reviewed `2:49` English demonstration video with corrected selectable captions.

## What Was Learned

Useful model reasoning does not require direct model control over source code. Separating evidence, bounded strategy selection, deterministic mutation, replay, and proof creates a workflow that is easier to review and reproduce.

Clean-clone and failure-path testing also showed that reproducibility is a product feature, not only a release task. Hashes, sanitized evidence, isolated configuration, independent cleanup, and explicit human-review boundaries were as important as the successful repair itself.

## What’s Next

The Devpost submission is complete. Both required private-repository judging invitations remain pending, so invitation acceptance, repository access, and an independent judge clone are not yet verified.

Potential later product work includes user-selected retained patch application, a complete fallback and rollback workflow, broader fixture and platform support, and additional human accessibility evaluation. Those capabilities are not claimed by this submission.

## Built With

- TypeScript
- React
- Vite
- Node.js
- Playwright
- `@axe-core/playwright`
- OpenAI Responses API
- GPT-5.6
- Codex CLI
- pnpm
- Git and GitHub
- Zod

## Judge Access and Repository Instructions

The source repository is private at `https://github.com/frankcom-it-service/accesspatch` and is not offered under an open-source project license. Read invitations have been issued to the two required judging accounts, but acceptance and an independent judge clone remain pending. Judges require granted GitHub access; anonymous cloning is not supported.

Verified full path:

```bash
pnpm install --frozen-lockfile
pnpm judge:verify
```

Read-only evidence path:

```bash
pnpm judge:sample:validate
```

Then open `examples/judge-sample/proof-bundle/report.html`. The verified platform is Debian GNU/Linux 13 x86_64 with Node.js 24.18.0, pnpm 11.13.0, Git 2.47.3, and Chromium 148.0.7778.178.

## Third-Party Acknowledgments

AccessPatch uses package-managed React, Vite, TypeScript, Playwright, axe-core integration, Zod, and the official OpenAI JavaScript SDK. Exact versions and declared license families are recorded in `docs/hackathon/THIRD_PARTY_NOTICES.md`. No third-party images, music, fonts, screenshots, logos, or video assets are included in the repository.

## Limitations and Human-Review Boundary

- The implementation supports one controlled React checkout fixture, one configured keyboard journey, two original finding IDs, and two deterministic repair classes.
- Mutation Guard supports one fixed mutation class on the same versioned controlled fixture and Chromium path.
- No retained application into an arbitrary user repository, broad repository inspection, complete fallback, or rollback workflow exists.
- Verification covers Debian GNU/Linux 13 x86_64 and the recorded Chromium configuration; other operating systems, architectures, browser paths, and broader repositories remain unverified.
- The three WCAG mappings cover only the two controlled findings. They are not a whole-product conformance determination.
- AccessPatch does not provide complete accessibility testing, WCAG certification, BFSG or EAA legal assurance, or legal compliance verification.
- Automation and model-assisted results can be incomplete or incorrect. Disabled-user testing, expert accessibility review, wording and label-adjacency review, and visual-focus review remain necessary.

## Internal Form-Entry Data — Do Not Copy Into Public Narrative

- The recorded `/feedback` Thread ID was entered only in the dedicated Devpost Codex Session ID or `/feedback` field.
- Do not copy that identifier into the public project description, README, YouTube text, captions, screenshots, or other public-facing material.
- The retained public Devpost project URL is `https://devpost.com/software/accesspatch`.

## Final Human Review

The project owner reviewed the final Devpost preview, read and accepted the official rules and Devpost terms, explicitly approved submission, and confirmed the resulting OpenAI Build Week submission page. Required judging invitations remain pending; no invitation acceptance or independent repository clone is claimed.
