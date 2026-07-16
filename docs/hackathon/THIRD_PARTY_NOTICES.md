# Third-Party Notices

AccessPatch ownership and repository-use terms are recorded in `OWNERSHIP.md`. AccessPatch itself is not currently offered under an open-source license. Third-party packages remain governed by their own licenses.

## Direct External Dependencies

Exact versions are committed in package manifests and `pnpm-lock.yaml`.

| Package | Version | Direct role | Declared license |
| --- | --- | --- | --- |
| `@axe-core/playwright` | `4.12.1` | Accessibility integration; dependency and development dependency | MPL-2.0 |
| `@playwright/test` | `1.61.1` | Browser journey testing; dependency and development dependency | Apache-2.0 |
| `@types/node` | `26.1.1` | Development types | MIT |
| `@types/react` | `19.2.17` | Development types | MIT |
| `@types/react-dom` | `19.2.3` | Development types | MIT |
| `@vitejs/plugin-react` | `6.0.3` | Development build integration | MIT |
| `openai` | `6.47.0` | Official JavaScript SDK for the bounded Responses API integration | Apache-2.0 |
| `react` | `19.2.7` | Demo application runtime | MIT |
| `react-dom` | `19.2.7` | Demo application runtime | MIT |
| `typescript` | `7.0.2` | Development compiler and type checking | Apache-2.0 |
| `vite` | `8.1.4` | Development and production build tool | MIT |
| `zod` | `4.4.3` | Runtime schema validation | MIT |

Internal `@accesspatch/*` workspace packages are part of AccessPatch, are not separate third-party packages, and are not separately licensed.

## Transitive Dependencies

The offline `pnpm licenses list --json` inventory on 2026-07-16 identified the installed dependency graph under these declared license families:

- Apache-2.0
- BSD-3-Clause
- ISC
- MIT
- MPL-2.0

Direct external dependencies have declared MIT, Apache-2.0, or MPL-2.0 licenses. No direct dependency had an unknown, missing, or contradictory declared license, and no GPL or AGPL direct dependency was identified.

Dependency license texts and attribution details can be obtained from installed package metadata, the pnpm lockfile, package registry metadata, or the linked upstream repositories. This summary does not replace the applicable third-party license texts.

## Standards Sources

The controlled WCAG mapping cites official W3C material:

- https://www.w3.org/TR/WCAG22/#info-and-relationships
- https://www.w3.org/TR/WCAG22/#focus-visible
- https://www.w3.org/TR/WCAG22/#name-role-value
- https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
- https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html

The WCAG Recommendation is normative; Understanding documents are informative. No W3C specification body is redistributed. Mapping provenance and claim boundaries are recorded in `docs/hackathon/WCAG_MAPPING_SOURCES.md`.

## Assets and Evidence

- No third-party images, music, fonts, screenshots, logos, video assets, datasets, icon packs, or remotely loaded assets are included.
- Chromium is used for verification but is not distributed in the repository.
- The sanitized Phase 3B archive contains project-generated text evidence only.
- Package names and trademarks remain the property of their respective owners.
