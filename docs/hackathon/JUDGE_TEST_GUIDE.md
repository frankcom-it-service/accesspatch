# Judge Test Guide

## Status

**NOT YET IMPLEMENTED / NOT YET VERIFIED.** No runnable product exists in Phase 0.

The current FAQ and official announcement, checked 2026-07-15, require Developer Tools entries to document installation, supported platforms, and a judge testing path that does not require a complete rebuild.

## Planned Evaluation Path

1. Verify documented prerequisites and use a clean checkout of the feature-frozen commit.
2. Configure credentials locally from `.env.example`; never commit or share keys.
3. Start the future local fixture and AccessPatch using documented commands.
4. Run one named journey to capture baseline evidence.
5. Request a structured repair proposal and inspect its evidence and validation status.
6. Demonstrate deterministic rejection of a malformed or disallowed proposal.
7. Apply an approved repair in the controlled fixture, rerun the journey, and inspect the proof artifact.
8. Review limitations and distinguish automated evidence from human accessibility testing.

## Open Requirements

- `TODO`: add exact commands, supported platforms, expected duration, and expected outputs.
- `TODO`: add a no-API fallback only if it is genuine and clearly labeled.
- `TODO`: verify every link and step from a clean environment after feature freeze.
