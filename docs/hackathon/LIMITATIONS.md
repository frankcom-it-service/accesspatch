# Limitations

## Current Limitations

- A controlled React checkout fixture and predefined Playwright journey exist; this fixture is not the AccessPatch product and supports only the seeded local scenario.
- Phase 1B can collect schema-valid evidence and obtain a deterministically constrained repair plan only for the two seeded findings. Committed Phase 1C code can generate and validate an isolated two-file patch and repaired replay for those findings. Committed Phase 2A code packages that reviewed evidence into the fixed canonical bundle. Arbitrary-repository inspection, retained patch application, rollback, broader proof formats, and the complete product workflow are **NOT YET IMPLEMENTED**.
- Dedicated-project authentication and one real `gpt-5.6-sol` Phase 1B planning call are verified. Broader output quality, latency, cost profile, failure modes, and supported findings remain **NOT YET VERIFIED**. Codex credits do not automatically provide OpenAI API credits.
- Only the controlled build, smoke, keyboard-baseline, and checkout axe results are verified; product-level accessibility, security, performance, compatibility, and usability remain **NOT YET VERIFIED**.
- No public repository, demo, or video URL exists. Core requirements were checked on 2026-07-15, but the official Rules-page body appears stale and the final applicable rules remain an open risk.
- Support beyond the controlled React fixture and Chromium-only test scope, including clean-install and cross-platform verification, remains `OPEN`; only two finding types and two safe-fix classes are currently allowed.
- The generated static report passed one automated Chromium axe smoke, but it has not received complete accessibility review. The bundle passed independent source-and-artifact review but remains ignored and untracked; no curated judge sample exists.

## Permanent Claim Boundaries

Even if implemented, AccessPatch cannot claim complete accessibility, provide WCAG certification, provide BFSG or EAA legal assurance, find every accessibility issue, or replace disabled-user testing and qualified human review. Automated and model-assisted results can be incomplete or incorrect and require review.
