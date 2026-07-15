# Test Evidence

## Phase 0

At Phase 0 completion, no application code or test suite existed. That documentation-only phase claimed no functional, accessibility, security, performance, or model-integration result.

Documentation correction validation status:

| Check | Result |
| --- | --- |
| Complete tracked diff and untracked full-file review | PASS — all current changes reviewed |
| `git diff --check` | PASS — exit `0`, no output |
| `rg -n '[[:blank:]]+$' AGENTS.md README.md .gitignore .env.example docs/hackathon` | PASS — exit `1`, no matches |
| Unsupported-claim review | PASS — completed-functionality claims were not found; future work remains labeled |
| Selected high-risk secret-pattern `rg` scan across all current files | PASS — exit `1`, no matches |
| `find` for `package.json`, `*.js`, `*.jsx`, `*.ts`, and `*.tsx` outside `.git` | PASS — exit `0`, no output |

`git status --short` exited `0` with this exact output before this evidence update; the file categories remain unchanged:

```text
 M README.md
?? .env.example
?? .gitignore
?? AGENTS.md
?? docs/
```

These checks validate Phase 0 repository hygiene only; they are not application, accessibility, security, or model tests. `git diff --check` does not include untracked file contents, so the separate all-file whitespace scan covered the new documents.

## Final Checklist and Proof Contract Correction

- External archive review: reported passed structure, secret hygiene, unsupported-claim handling, and scope control; it did not execute the repository commands recorded here.
- Codex `git diff --check`: exit `0`, no output.
- Codex `rg -n '[[:blank:]]+$' AGENTS.md README.md .gitignore .env.example docs/hackathon`: exit `1`, no matches.
- Codex selected high-risk secret-pattern `rg` scan across the same files: exit `1`, no matches.
- Codex `find` for `package.json`, `*.js`, `*.jsx`, `*.ts`, and `*.tsx` outside `.git`: exit `0`, no output.
- Codex `rg -n '^- \[[xX]\]' docs/hackathon/SUBMISSION_CHECKLIST.md`: exit `1`, no checked entries; 117 unchecked entries were present.
- Codex canonical contract check: each required name (`summary.json`, `findings.json`, `journey-map.json`, `repair-plan.json`, `patch.diff`, `replay.spec.ts`, `report.html`, `wcag-map.csv`, `manual-review.md`, `test-results/`, `audit-log.json`) appeared exactly once in `DEMO_EVIDENCE.md`; exit `0`.
- Codex `git status --short`: exit `0`; `README.md` modified, with `.env.example`, `.gitignore`, `AGENTS.md`, and `docs/` untracked.

## Phase 0 Commit Record

- Original minimal baseline: `0ac10988053a301c89689b8ce8fbd7e6aecd481f` (`chore: document initial hackathon repository`).
- Validated Phase 0 foundation: `bbabb9207b0f7ae92b8262b2e02930511dd81521` (`docs: establish Phase 0 hackathon controls`).
- Governance-record follow-up: committed separately with subject `docs: record Phase 0 completion`; its own hash is intentionally not embedded in the commit content.
- These are documentation commits only and do not establish application, accessibility, security, or model-runtime test results.

## Human-Supervised GPT-5.6 Access Verification — 2026-07-15

- Provenance: results supplied from the human-supervised setup; Codex did not rerun the request or access the secret.
- Project controls: dedicated `AccessPatch Build Week` project, model restricted to `gpt-5.6-sol`, model-list read and Responses write only, all other endpoint groups disabled.
- Cost controls: USD 5 prepaid balance; auto recharge disabled.
- First attempt before credit: HTTP `429`, error `insufficient_quota`.
- Successful access check after credit: Responses API HTTP `200`; model `gpt-5.6-sol`; status `completed`; exact visible output `ACCESSPATCH_API_OK`; `store: false`.
- Usage: input 16, output 8, reasoning 0, total 24 tokens.
- Interpretation: real authentication, billing readiness, and model-response evidence for a minimal access test only. AccessPatch integration, JSON schema validation, deterministic safety validation, privacy-conscious audit logging, fallback behavior, and the reproducible repair-plan demo remain **NOT YET IMPLEMENTED**.

## Phase 1A Controlled Baseline — 2026-07-15

- Environment: Node.js `v24.18.0`, pnpm `11.13.0`, system Chromium `/usr/bin/chromium`.
- `pnpm install`: initial exit `0` with 31 packages added; exact-specifier reconciliation rerun exit `0`, already up to date, and changed no resolved package.
- Direct-specifier scan: no `latest` remains in either package manifest or lockfile importer; exact versions match the resolved dependency graph.
- Chromium resolution: explicit environment path first, then existing `/usr/bin/chromium`, otherwise Playwright-managed Chromium. This run verified `/usr/bin/chromium`; clean-install and cross-platform verification remain pending.
- Form instruction: visible `All fields are required.` text is referenced by the form, and the country select is required; neither controlled barrier was repaired.
- `pnpm typecheck`: exit `0`.
- `pnpm build`: exit `0`; Vite `8.1.4` transformed 16 modules and produced `dist/`.
- `pnpm test:smoke`: latest approved local-server run exit `0`, 1 test passed in Chromium in 2.9 seconds. The earlier sandbox-only Vite `listen EPERM` did not recur outside that restriction.
- `pnpm test:baseline`: expected exit `1`, 1 test failed in 6.4 seconds after emitting `KEYBOARD_JOURNEY_CONFIRMATION=REACHED`.
- Barrier 1: `CONTROLLED_BARRIER_EMAIL_NAME`; expected `Email address`, received empty accessible name.
- Barrier 2: `CONTROLLED_BARRIER_FOCUS_VISIBLE`; computed focus styles reported `outlineStyle: none` and `boxShadow: none`.
- Axe checkout finding: exactly one violation, id `label`, impact `critical`, target `#email`; no unexpected axe violation was returned.
- Generated screenshot, trace, HTML report, error context, and structured axe attachment are ignored test artifacts.
- `git diff --check`: exit `0`, no output.
- All-current-file trailing-whitespace scan: ripgrep exit `1`, no matches.
- Selected high-risk credential-pattern scan: ripgrep exit `1`, no matches.
- Non-empty OpenAI-variable and sensitive project/organization identifier scan: ripgrep exit `1`, no matches.
- `git check-ignore` confirmed `apps/demo-checkout/dist`, `node_modules`, `playwright-report`, and `test-results` are ignored; exit `0`.
- Scope: expected product-barrier failures only. No OpenAI credential access, API call, repair, replay generation, analyzer, or Proof Bundle implementation occurred.

## Future Evidence Standard

Each test record must include date, commit, environment, exact command, exit status, relevant output, artifact location, and known limitations. Accessibility evidence must distinguish automated signals from disabled-user testing and qualified human review. It must not be presented as complete accessibility, WCAG certification, or BFSG/EAA legal assurance.
