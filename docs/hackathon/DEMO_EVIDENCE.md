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
- Curated tracked Judge Sample: PHASE 2C COMPLETE in `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce`; exactly 17 tracked files comprising `README.md`, `SHA256SUMS`, and 15 byte-identical reviewed Proof Bundle files
- One-command Judge Workflow: PHASE 3A COMPLETE in `84db92f9e27b6f7872495516f166a8bcaed8ef03`
- Clean-clone proof: PHASE 3B COMPLETE in evidence commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed`; one frozen install and one Judge Workflow run passed from committed source with ignored runs absent
- Controlled AccessPatch repair workflow and final submission evidence: IMPLEMENTED AND VERIFIED for the fixed checkout journey; arbitrary repositories and retained patch application remain unsupported
- Hosted application demo: NOT AVAILABLE; the private repository judge path exists but invitation acceptance and an independent judge clone remain pending; the public submission video is owner-verified

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

The Phase 2A generator produced all entries from the reviewed Phase 1 source artifacts. `summary.json` is the manifest: it records every other generated file hash and omits its own hash to avoid a cycle; independent validation hashes the manifest separately. Every artifact must come from a real run, be reproducible, and be tied to a commit before final use; no result may be fabricated. The original demo repository remains preserved. Generated proof runs remain ignored by default; Phase 2C explicitly allowlists only the independently reviewed `examples/judge-sample/` copy.

The independently reviewed Phase 2B bundle replaces `UNMAPPED` with exactly three deterministic WCAG 2.2 rows: email → `1.3.1` and `4.1.2`; focus → `2.4.7`. `3.3.2` is explicitly excluded for this controlled email defect. The mapping sources and rationale are in `WCAG_MAPPING_SOURCES.md`. This limited mapping is not certification or a full-conformance conclusion.

Phase 2C commits that reviewed bundle in the explicit tracked location without changing any canonical file. Recursive `diff -qr --no-dereference` returned exit `0` with no output. The read-only, network-free validator uses only tracked content, and the tracked report smoke reported zero axe violations. Phase 3A integrates that sample into the one-command workflow, and Phase 3B verifies the committed path in one fresh Debian GNU/Linux 13 x86_64 clone. Broader-platform behavior and public judge access remain open.

## Published Submission Video

- Title: `AccessPatch — Journey Repair and Proof Agent | OpenAI Build Week 2026`.
- Public URL: `https://www.youtube.com/watch?v=eCHig9YUwU0`.
- Final duration: `2:49`, below the official three-minute maximum.
- Evidence boundary: no live GPT-5.6 call was used; only tracked, reviewed evidence was shown.
- Production verification: the complete final export passed review outside Clipchamp after the visual-gap repair. A custom thumbnail and corrected timed English SRT subtitles were added.
- Public verification: the project owner verified playback, thumbnail, audio, duration, and selectable English captions in a logged-out/incognito browser. This is owner verification, not an independent automated YouTube fetch.
- Published narration record: `VIDEO_CAPTIONS.srt` is the corrected SRT uploaded to YouTube. It contains 67 sequential, non-overlapping caption blocks from `00:00:00,190` through `00:02:48,662` and has SHA-256 `1d8bd5e0c3bac69e1fb07072a2c50b8cb5fe8a06bc266bc8986030f9d839730d`. `VIDEO_SCRIPT.md` distinguishes the actual shortened narration from the original production script.

## Required Demo Record

Before a demo claim is made, record:

- Feature-frozen commit and local environment.
- Exact setup and launch commands.
- Input application and journey fixture provenance.
- Before state, proposed repair evidence, validation outcome, and after state.
- Deterministic rejection or rollback behavior for an unsafe proposal.
- Human accessibility review scope and unresolved limitations.
- Artifact hashes or manifest, capture date, and link availability check.

The controlled record is populated by the tracked Judge Sample, Phase 3B and Phase 5A clean-clone evidence, the published-video record above, and their linked hashes and commits. External Devpost entry, accepted private judge access, final link verification, and submission remain pending human actions.
