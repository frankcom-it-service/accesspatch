# AccessPatch Repository Guidance

These instructions apply to the entire repository.

## Product and Scope

- AccessPatch is a Developer Tools project: a planned Journey Repair and Proof Agent for React/TypeScript applications.
- Treat `docs/hackathon/SUBMISSION_LEDGER.md` as the source of truth for submission claims and evidence status.
- Preserve the minimal initial README baseline commit `0ac10988053a301c89689b8ce8fbd7e6aecd481f` in project history.

## Engineering Rules

- Use Codex as the principal engineering tool and record meaningful AI-assisted work in `docs/hackathon/AI_CONTRIBUTION_LOG.md`.
- Keep changes focused on the active phase; do not add dependencies or scaffolding without an explicit implementation task.
- Prefer deterministic checks around any future model-generated repair proposal.
- Never commit secrets, tokens, private user data, generated proof bundles, or environment files other than `.env.example`.
- Do not push, publish, create remotes, or commit unless explicitly requested.

## Evidence and Claims

- Mark incomplete work as `TODO`, `OPEN`, `NOT YET VERIFIED`, or `NOT YET IMPLEMENTED`.
- Never invent test results, model access, URLs, session identifiers, accessibility outcomes, or submission status.
- Do not claim complete accessibility, WCAG certification, BFSG or EAA legal assurance, or replacement of disabled-user testing or qualified human review.
- Record reproducible commands and actual outcomes in the hackathon evidence documents.
- Update limitations and security notes when behavior changes.

## Validation

- Review the complete diff before handoff.
- Run the narrowest relevant checks, then `git diff --check` and `git status --short`.
- Keep generated test artifacts, traces, builds, and proof runs out of Git. A future curated judge-visible sample requires an explicit reviewed tracked location or allowlist.
