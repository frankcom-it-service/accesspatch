# Judge Test Guide

## Status

**PARTIAL / NOT SUBMISSION-READY.** The controlled Phase 1A fixture is committed at `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf`; its build and smoke test pass, while its baseline intentionally fails only for the two controlled barriers. Phase 2C commits an independently reviewed tracked sample and report smoke, but the final clean-machine judge path remains **NOT YET VERIFIED**.

The current verified environment uses `/usr/bin/chromium`. A clean environment without system Chromium can run `pnpm browser:install` to install Playwright Chromium only. Clean-install and cross-platform verification remain **NOT YET VERIFIED**.

The current FAQ and official announcement, checked 2026-07-15, require Developer Tools entries to document installation, supported platforms, and a judge testing path that does not require a complete rebuild.

## Planned Evaluation Path

Committed Phase 2C evidence can be inspected locally with `pnpm judge:sample:validate`, `pnpm test:judge-sample-report`, and `examples/judge-sample/proof-bundle/report.html`. These are read-only sample checks, not the complete final judge workflow.

1. Verify documented prerequisites and use a clean checkout of the feature-frozen commit.
2. Configure credentials locally from `.env.example`; never commit or share keys.
3. Start the future local fixture and AccessPatch using documented commands.
4. Run one named journey to capture baseline evidence.
5. Request a structured repair proposal and inspect its evidence and validation status.
6. Demonstrate deterministic rejection of a malformed or disallowed proposal.
7. Apply an approved repair in the controlled fixture, rerun the journey, and inspect the proof artifact.
8. Review limitations and distinguish automated evidence from human accessibility testing.

## Open Requirements

- `TODO`: promote the Phase 1A commands into a complete judge path with supported platforms, expected duration, and expected outputs.
- `TODO`: add a no-API fallback only if it is genuine and clearly labeled.
- `TODO`: verify every link and step from a clean environment after feature freeze.
