# Video Asset Manifest

## Final Produced Asset

- Title: `AccessPatch — Journey Repair and Proof Agent | OpenAI Build Week 2026`.
- Public URL: `https://www.youtube.com/watch?v=eCHig9YUwU0`.
- Local filename, without a private path: `AccessPatch Build Week Video.mp4`.
- Final duration: `2:49`.
- Clipchamp-reported export size: `28.28 MB`.
- Finalization: Clipchamp visual-gap repair applied, custom AccessPatch thumbnail added, and corrected timed English SRT subtitles uploaded.
- Review: the complete export passed review outside Clipchamp; the project owner then verified public playback, thumbnail, audio, duration, and selectable English captions logged out/incognito.
- Runtime boundary: no live GPT-5.6 call was used; only tracked, reviewed evidence was shown.

## Command Plan

These commands are preparation instructions only. They were not executed while this production pack was created.

| Purpose | Exact command | During recording? | Expected visible output | Expected duration | Cleanup | Ignored output | OpenAI key | Public-display safety |
| --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| Controlled checkout server | `pnpm --filter @accesspatch/demo-checkout dev --host 127.0.0.1 --port 4173 --strictPort` | Yes, started before the live checkout take | Vite ready message and local URL `http://127.0.0.1:4173/` | 1–4s startup | Press `Ctrl+C` in its terminal | May create ordinary ignored Vite cache only | Not used | Safe only with a sanitized prompt and no visible local path |
| Local Proof Bundle report server | `python3 -m http.server 4174 --bind 127.0.0.1 --directory examples/judge-sample/proof-bundle` | Yes, started before the report take | Local server listening; report at `http://127.0.0.1:4174/report.html` | 1–2s startup | Press `Ctrl+C` in its terminal | None expected | Not used | Safe; keep the browser on localhost and do not show terminal request logs |
| Optional read-only validation | `pnpm judge:sample:validate` | Optional short terminal insert | `JUDGE_SAMPLE_FILE_COUNT=15`, `JUDGE_SAMPLE_FINDING_COUNT=2`, `JUDGE_SAMPLE_WCAG_MAPPING_COUNT=3`, `JUDGE_SAMPLE_SECURITY=passed`, `JUDGE_SAMPLE_VALID` | Under 2s | None | None | Not used | Safe with a sanitized prompt; omit if timing is tight |

Do not run `pnpm phase1:reason`, `pnpm phase1:repair`, `pnpm phase2:bundle`, `pnpm mutation:guard`, or `pnpm judge:verify` during recording. Use the tracked reviewed outputs below.

## Controlled Browser Pages

| Page | URL | Purpose | Capture boundary |
| --- | --- | --- | --- |
| Product | `http://127.0.0.1:4173/` | Title background and keyboard-journey start | Show the controlled product only |
| Checkout | `http://127.0.0.1:4173/checkout` | Demonstrate the two original barriers | Use synthetic data and keyboard input only |
| Confirmation | `http://127.0.0.1:4173/confirmation` | Show journey completion | Show `Order ready for review` |
| Proof report | `http://127.0.0.1:4174/report.html` | Human-readable before/after proof | Do not click external W3C links during the take |

## Tracked Evidence Assets

| Asset | Exact fields or content to show | Planned shot |
| --- | --- | --- |
| `examples/judge-sample/proof-bundle/test-results/before-baseline.json` | `findingIds`, `axeResult`, `focusValues`, `confirmationReached` | 04 |
| `examples/judge-sample/proof-bundle/repair-plan.json` | Both `safeFixClass` values, target files, permitted change descriptions, and `preserveOriginalDemoRepository` | 05 |
| `examples/judge-sample/proof-bundle/test-results/model-audit.json` | `modelId`, `store`, `responseStatus`, `usage.totalTokens`, `policyValidation` | 05 |
| `examples/judge-sample/proof-bundle/patch.diff` | The App.tsx label-association hunk and styles.css focus-suppression removal hunk | 06 |
| `examples/judge-sample/proof-bundle/test-results/after-replay.json` | `status`, `axeResult`, `focusValues`, `confirmationReached` | 07 |
| `examples/judge-sample/proof-bundle/test-results/verification.json` | `filesChanged`, `replayResult`, `originalRepositoryUnchanged`, `overallVerificationStatus` | 07 |
| `examples/judge-sample/proof-bundle/report.html` | `Before and after journey`, `Controlled findings`, `GPT-5.6 repair-plan summary`, `Exact changed files`, `Manual review and claim boundaries` | 08 |
| `docs/hackathon/evidence/phase5a-clean-clone/mutation-guard-output.txt` | All seven stable Mutation Guard result lines | 09 |
| `docs/hackathon/evidence/phase5a-clean-clone/judge-workflow-output.txt` | Test count `178`, eight stage-pass lines, and final `JUDGE_WORKFLOW_SECURITY=passed` plus `JUDGE_WORKFLOW_VALID` | 10 |
| `README.md` | `How Codex Accelerated the Work`, `Important Human Decisions`, and `GPT-5.6 and Codex Contribution Boundary` | 10 |

## Report Sections

- `#journey-summary`: before `2` findings and after `0` automated findings.
- `#findings-heading`: exact controlled finding IDs and strategies.
- `#reasoning-heading`: bounded GPT-5.6 plan and deterministic-template boundary.
- `#changes-heading`: exact changed files and original-fixture preservation.
- `#review-heading`: human-review and non-certification boundary.

## Required Overlays

- `Find it. Repair it. Prove it. Prevent it from returning.`
- `1 controlled journey · 2 findings · 2 deterministic repairs`
- `GPT-5.6: bounded plan only · no source code applied`
- `Replay: axe 0 · visible solid 3px focus · confirmation reached`
- `Proof Bundle: 15 tracked proof files`
- `Mutation Guard: injected 1 · detected 1 · original unchanged`
- `178 API-free tests · 8-stage Judge Workflow · 17-stage clean clone`
- `Controlled demonstration · Human review still required`

## Fallback Screenshots or Clips

Prepare these only during the separately approved recording phase:

1. Product-page title image.
2. Complete keyboard checkout clip with synthetic data.
3. Confirmation-page still.
4. Before-evidence crop.
5. Repair-plan and model-audit crops.
6. Two deterministic patch-hunk crops.
7. Repaired replay crop.
8. Proof report summary, findings, reasoning, changes, and limitation crops.
9. Mutation Guard result card.
10. Judge Workflow and Codex contribution summary card.
11. Closing limitation card.

Fallback assets must contain the same reviewed facts and pass `VIDEO_PRIVACY_CHECKLIST.md`.
