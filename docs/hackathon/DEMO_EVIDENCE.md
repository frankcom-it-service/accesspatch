# Demo Evidence

## Current Status

- Controlled local demo fixture: PHASE 1A COMPLETE in commit `18c3828431348c8eadfc93aaae3e4d92ec4f3bcf`
- Product-to-confirmation keyboard journey: VERIFIED locally
- Deliberately failing two-barrier baseline: VERIFIED locally
- Normalized two-finding journey evidence: PHASE 1B COMPLETE in `207e0559d0d7664a24dcb297fb40b37700f36208`; reviewed run output remains ignored
- Schema-valid, deterministic-policy-approved GPT-5.6 repair plan: PHASE 1B COMPLETE; reviewed run output remains ignored and is not the curated Proof Bundle
- Isolated deterministic patch and repaired replay: PHASE 1C COMPLETE in `79ed0e60b2c7145f4113ecac3797a119ccb696ee`; all five reviewed feasibility artifacts remain ignored and are not the curated Proof Bundle
- Canonical Proof Bundle: PHASE 2A COMPLETE in `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`; exact inventory, manifest, and all 15 generated files independently reviewed; generated output remains ignored and untracked
- Controlled WCAG 2.2 mapping: PHASE 2B COMPLETE in `e3811c8bf968dc78701f8d264dc1377543059d64`; exactly `1.3.1`, `4.1.2`, and `2.4.7` with official W3C provenance; regenerated output remains ignored and untracked
- Complete AccessPatch repair workflow and final demo evidence: NOT YET IMPLEMENTED
- Hosted or judge-accessible demo: NOT YET AVAILABLE

## Canonical Proof Bundle Contract

The MVP Proof Bundle contains exactly these named outputs unless a later documented decision changes the contract:

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

The Phase 2A generator produced all entries from the reviewed Phase 1 source artifacts. `summary.json` is the manifest: it records every other generated file hash and omits its own hash to avoid a cycle; independent validation hashes the manifest separately. Every artifact must come from a real run, be reproducible, and be tied to a commit before final use; no result may be fabricated. The original demo repository remains preserved. The implementation is committed and the generated bundle passed independent review. Generated proof runs remain ignored by default; a curated judge-visible sample may later be stored only in an explicitly reviewed tracked location or allowlist.

The independently reviewed Phase 2B bundle replaces `UNMAPPED` with exactly three deterministic WCAG 2.2 rows: email → `1.3.1` and `4.1.2`; focus → `2.4.7`. `3.3.2` is explicitly excluded for this controlled email defect. The mapping sources and rationale are in `WCAG_MAPPING_SOURCES.md`. This limited mapping is not certification or a full-conformance conclusion.

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
