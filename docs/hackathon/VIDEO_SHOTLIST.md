# Final Video Shot List

## Production Result

The final `2:49` video was produced and published at `https://www.youtube.com/watch?v=eCHig9YUwU0`. The complete export passed owner review outside Clipchamp after the visual-gap repair. A custom thumbnail and corrected timed English captions were added. No live GPT-5.6 call was used; only tracked, reviewed evidence was shown. The authoritative published transcript is the corrected 67-block `VIDEO_CAPTIONS.srt`, ending at `00:02:48,662`; the plan below is retained as the original production shot list rather than an exact transcript.

## Production Boundary

- Planned total: `02:46`.
- Hard maximum: `02:50`.
- Primary story: broken journey → bounded GPT-5.6 repair plan → deterministic isolated repair → successful replay → verifiable proof.
- Mutation Guard is a short prevention bonus, not the main product story.
- Every evidence crop comes from the tracked Judge Sample or tracked Phase 5A evidence.

## Original Second-by-Second Production Plan

| Shot | Start–End | Duration | Screen shown | Action performed | Matching narration | Exact visible text | Zoom or crop | Transition | Privacy risk | Fallback asset |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | 00:00–00:12 | 12s | Clean title card over the controlled product page | No interaction | “Accessibility barriers can break a user journey…” through “…proves the result.” | `AccessPatch` and `Find it. Repair it. Prove it. Prevent it from returning.` | Product page at 125%; no browser chrome beyond localhost | 8-frame dissolve | Low; ensure no tabs, profile, or bookmarks appear | Still image of the controlled product page with the same title overlay |
| 02 | 00:12–00:38 | 26s | Live controlled checkout at `http://127.0.0.1:4173/` | Use the keyboard sequence below | “Here is one React checkout journey…” through “…no visible focus cue appears.” | Product title, `Add product to cart`, `Open checkout`, `Shipping and contact`, `Email address`, `Continue to confirmation` | Browser 125–150%; crop out desktop and account chrome | Straight cut | Medium; a mouse click would weaken the keyboard claim, and a visible local profile could expose private data | Pre-recorded clean checkout clip using the same synthetic data |
| 03 | 00:38–00:48 | 10s | Controlled confirmation page | Press `Enter` while the primary action has focus | “The form still reaches confirmation…” | `Journey complete` and `Order ready for review` | Center the confirmation heading | Straight cut | Low | Still image of the confirmation page |
| 04 | 00:48–01:02 | 14s | Tracked before-state evidence | Pan between the two bounded evidence blocks | “The evidence contains exactly two findings…” | `CONTROLLED_BARRIER_EMAIL_NAME`, `CONTROLLED_BARRIER_FOCUS_VISIBLE`, rule `label`, target `#email`, `visibleIndicatorDetected: false` | Crop `examples/judge-sample/proof-bundle/test-results/before-baseline.json`: `findingIds`, `axeResult`, and `focusValues` only | Short slide | Low; do not show local editor paths | Prepared screenshot of those exact JSON fields |
| 05 | 01:02–01:17 | 15s | Tracked GPT-5.6 plan and sanitized model audit | Highlight plan strategies, then audit fields | “One bounded GPT-5.6 call…” | `associate_explicit_label`, `restore_focus_visible`, `modelId: gpt-5.6-sol`, `store: false`, `totalTokens: 2444`, `policyValidation: accepted` | Crop `repair-plan.json` to both `safeFixClass` values; crop `test-results/model-audit.json` to the listed fields | Crossfade | Medium; never show an API dashboard, prompt, raw response, key, project ID, or organization ID | Two reviewed static screenshots from the tracked files |
| 06 | 01:17–01:34 | 17s | Tracked deterministic patch | Reveal the two hunks in sequence | “Deterministic templates perform the repair…” | `<label className="field-label" htmlFor="email">` and removal of `.controlled-focus-defect:focus` / `:focus-visible` suppression | Crop only the two hunks in `examples/judge-sample/proof-bundle/patch.diff`; 150% text zoom | Quick cut between hunks | Low; avoid unrelated source or repository history | Two static diff cards reproducing only the tracked hunks |
| 07 | 01:34–01:50 | 16s | Tracked repaired replay evidence | Emphasize after-state values | “The same journey is replayed after repair…” | `status: passed`, `violationCount: 0`, `outlineStyle: solid`, `outlineWidth: 3px`, `visibleIndicatorDetected: true`, `confirmationReached: true` | Crop `test-results/after-replay.json` and `test-results/verification.json` to those fields plus `originalRepositoryUnchanged: true` | Before/after wipe | Low | Prepared after-state evidence card |
| 08 | 01:50–02:12 | 22s | Live local Proof Bundle report at `http://127.0.0.1:4174/report.html` | Scroll from before/after summary through findings and claim boundary | “The fifteen-file Proof Bundle connects…” | `Before: 2 findings`, `After: 0 automated findings`, `GPT-5.6 repair-plan summary`, `Exact changed files`, and the non-certification statement | Browser 125%; use report anchors `#journey-summary`, `#findings-heading`, `#reasoning-heading`, `#changes-heading`, and `#review-heading` | Smooth scroll, no external link clicks | Medium; address bar must show localhost, never a `file://` path | Full-page screenshots of the same report sections |
| 09 | 02:12–02:28 | 16s | Tracked Mutation Guard output | Reveal seven stable result lines | “As a prevention bonus, Mutation Guard injects…” | `MUTATION_GUARD_INJECTED=1`, `MUTATION_GUARD_DETECTED=1`, `MUTATION_GUARD_ORIGINAL_UNCHANGED=true`, `MUTATION_GUARD_CLEANUP=passed`, `MUTATION_GUARD_VALID` | Crop `docs/hackathon/evidence/phase5a-clean-clone/mutation-guard-output.txt`; omit surrounding file browser | Terminal-style text fade | Low | Static output card from the same tracked file |
| 10 | 02:28–02:42 | 14s | Codex and verification summary card | No interaction | “Codex was the primary engineering environment…” | `178 API-free tests`, `8-stage Judge Workflow`, `17-stage clean-clone verification`, `Human-coordinated` | Use `README.md` sections `How Codex Accelerated the Work`, `Important Human Decisions`, and `GPT-5.6 and Codex Contribution Boundary`; pair with the final Judge Workflow summary crop | Slow zoom | Medium; do not show private repository metadata, author data, or the `/feedback` Thread ID | Prepared summary slide using only the listed facts |
| 11 | 02:42–02:46 | 4s | Closing limitation card | No interaction | “AccessPatch remains a controlled demonstration…” | `Controlled demonstration · Human review still required` | Full-screen high-contrast text | Fade to black | Low | Identical static closing card |

## Exact Live Checkout Keyboard Sequence

Use only synthetic information:

1. Start with focus on the product heading.
2. Press `Tab` to focus `Add product to cart`.
3. Press `Enter`.
4. Press `Tab` to focus `Open checkout`.
5. Press `Enter`.
6. Confirm the `Shipping and contact` heading receives focus.
7. Press `Tab`; type `Ada Lovelace`.
8. Press `Tab`; type `12 Analytical Engine Way`.
9. Press `Tab`; type `Berlin`.
10. Press `Tab`; type `10115`.
11. Press `Tab` to move through the country control.
12. Press `Tab`; type `ada@example.test`.
13. Press `Tab` to focus `Continue to confirmation`.
14. Pause long enough to show that no visible focus cue appears.
15. Press `Enter`.
16. Hold on `Order ready for review`.

Do not type real personal data and do not use the mouse during the journey.
