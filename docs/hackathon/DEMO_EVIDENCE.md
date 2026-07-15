# Demo Evidence

## Current Status

- Controlled local demo fixture: PHASE 1A COMPLETE in commit `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf`
- Product-to-confirmation keyboard journey: VERIFIED locally
- Deliberately failing two-barrier baseline: VERIFIED locally
- AccessPatch repair workflow and final demo evidence: NOT YET IMPLEMENTED
- Hosted or judge-accessible demo: NOT YET AVAILABLE

## Planned Proof Bundle Contract

The planned MVP Proof Bundle must contain exactly these named outputs unless a later documented decision changes the contract:

- `summary.json`
- `findings.json`
- `journey-map.json`
- `repair-plan.json`
- `patch.diff`
- `replay.spec.ts`
- `report.html`
- `wcag-map.csv`
- `manual-review.md`
- `test-results/`
- `audit-log.json`

These outputs are **NOT YET IMPLEMENTED**. Every final artifact must come from a real run, be reproducible, and be tied to a commit; no result may be fabricated. The original demo repository must remain preserved. Generated proof runs remain ignored by default. A curated judge-visible sample may later be stored only in an explicitly reviewed tracked location or allowlist.

## Required Demo Record

Before a demo claim is made, record:

- Feature-frozen commit and local environment.
- Exact setup and launch commands.
- Input application and journey fixture provenance.
- Before state, proposed repair evidence, validation outcome, and after state.
- Deterministic rejection or rollback behavior for an unsafe proposal.
- Human accessibility review scope and unresolved limitations.
- Artifact hashes or manifest, capture date, and link availability check.

`TODO`: populate only with artifacts produced by the implemented, feature-frozen build.
