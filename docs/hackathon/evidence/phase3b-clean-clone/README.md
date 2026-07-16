# Phase 3B Clean-Clone Evidence

This directory preserves the independently reviewed clean-clone verification performed on 2026-07-16.

## Verified Scope

- Tested source HEAD: `7d0653cd344cf15be448ed9ef62b41b74c0d67ef`
- Judge Workflow implementation commit: `84db92f9e27b6f7872495516f166a8bcaed8ef03`
- Sanitized archive SHA-256: `27ac06541e02d3bfd554581beafaca4541dc8953316a6a5e4acc0572c5bdf0fd`
- Clone method: `git clone --no-hardlinks --no-tags` from local Git history
- Dependency installation: exactly one `pnpm install --frozen-lockfile` execution, exit `0`
- Judge verification: exactly one `pnpm judge:verify` execution in the clean clone, exit `0`
- Workflow history: lifetime execution number 3; no retry
- Result: all eight workflow stages and 139 API-free tests passed
- Isolation: `.accesspatch/runs/` remained absent; the Judge Sample remained unchanged
- Network observation: no external TCP connection was observed during the Judge Workflow monitor
- Cleanup: the temporary clone and isolated home, configuration, cache, state, and temporary directories were removed
- Source preservation: the source repository remained unchanged

The installation required package-registry access and completed after transient retry warnings. The Judge Workflow itself is API-free and was observed without an external TCP connection.

## Verified Environment

- Debian GNU/Linux 13
- x86_64
- Node.js `24.18.0`
- pnpm `11.13.0`
- Git `2.47.3`
- Chromium `148.0.7778.178`

Other operating systems, architectures, and browser configurations remain **NOT YET VERIFIED**.

## Integrity

`SHA256SUMS` covers the sanitized archive and every extracted evidence file. The archive and extracted files contain sanitized evidence only and were independently reviewed. The archive uses neutral numeric ownership and deterministic metadata.

This evidence is limited to the controlled AccessPatch checkout fixture and committed Judge Workflow. It is not complete accessibility testing, a WCAG conformance determination or certification, or BFSG/EAA legal assurance. Qualified human screen-reader, wording and adjacency, and visual-focus review remain necessary.
