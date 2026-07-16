# AccessPatch Judge Sample

This directory is a curated byte-identical copy of the independently reviewed Phase 2B run. It proves the controlled journey’s two real findings, bounded repair plan, deterministic two-file patch, isolated repaired replay, and sanitized evidence chain without depending on ignored run files.

- Phase 2B implementation: `e3811c8bf968dc78701f8d264dc1377543059d64`
- Phase 2B governance: `b16606f91831e90a1412cc8e26cca322b84cd328`
- Report: open `proof-bundle/report.html` directly in a browser.
- Read-only verification: run `pnpm judge:sample:validate` from the repository root.

The controlled findings are `CONTROLLED_BARRIER_EMAIL_NAME` and `CONTROLLED_BARRIER_FOCUS_VISIBLE`. Their limited WCAG 2.2 evidence mappings are `1.3.1`, `4.1.2`, and `2.4.7`. GPT-5.6 produced the bounded repair plan once; deterministic templates produced the patch. This is evidence from the controlled local `demo-checkout` fixture, not an arbitrary third-party repository.

The sample contains sanitized evidence only. It includes no API key, raw prompt, raw response, environment value, screenshot, trace, or personal data.

This sample is not complete accessibility testing, is not a WCAG conformance determination or certification, and is not BFSG or EAA assurance. Qualified human screen-reader, wording/adjacency, and visual-focus review remain required.
