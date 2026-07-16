# Limitations

## Current Limitations

- A controlled React checkout fixture and predefined Playwright journey exist; this fixture is not the AccessPatch product and supports only the seeded local scenario.
- Phase 1B can collect schema-valid evidence and obtain a deterministically constrained repair plan only for the two seeded findings. Committed Phase 1C code can generate and validate an isolated two-file patch and repaired replay for those findings. Committed Phase 2A code packages that reviewed evidence into the fixed canonical bundle. Arbitrary-repository inspection, retained patch application, rollback, broader proof formats, and the complete product workflow are **NOT YET IMPLEMENTED**.
- Dedicated-project authentication and one real `gpt-5.6-sol` Phase 1B planning call are verified. Broader output quality, latency, cost profile, failure modes, and supported findings remain **NOT YET VERIFIED**. Codex credits do not automatically provide OpenAI API credits.
- Only the controlled build, smoke, keyboard-baseline, and checkout axe results are verified; product-level accessibility, security, performance, compatibility, and usability remain **NOT YET VERIFIED**.
- No public repository, demo, or video URL exists. Core requirements were checked on 2026-07-15, but the official Rules-page body appears stale and the final applicable rules remain an open risk.
- Support beyond the controlled React fixture and Chromium-only test scope, including clean-install and cross-platform verification, remains `OPEN`; only two finding types and two safe-fix classes are currently allowed.
- The generated static report passed automated Chromium axe smokes, but it has not received complete accessibility review. Phase 2C commits an independently reviewed tracked byte-identical sample; clean-machine verification and integration into the final judge workflow remain open.
- The committed Phase 2B WCAG 2.2 mapping covers only three criteria for the two controlled findings. It does not assess other criteria, the whole page, the complete process, accessibility-supported usage, or WCAG conformance. Criterion expansion requires separate official-source review.

## Permanent Claim Boundaries

Even if implemented, AccessPatch cannot claim complete accessibility, provide WCAG certification, provide BFSG or EAA legal assurance, find every accessibility issue, or replace disabled-user testing and qualified human review. Automated and model-assisted results can be incomplete or incorrect and require review.
