# Video Recording Worksheet

Use this worksheet only after recording is separately approved. Do not improvise commands, evidence, claims, or account actions.

## 1. Prepare the Computer

- [ ] Close email, chat, password managers, account pages, and unrelated programs.
- [ ] Enable Do Not Disturb.
- [ ] Set the screen to `1920 × 1080` and the recorder to `30 fps`.
- [ ] Use a clean unsigned browser profile with no bookmarks, sync, history, or account avatar.
- [ ] Set browser zoom to `125%`; increase to `150%` for evidence text if needed.
- [ ] Open a fresh terminal with a neutral prompt such as `accesspatch$`.
- [ ] Disable terminal history for the recording shell.
- [ ] Open `VIDEO_PRIVACY_CHECKLIST.md` on a separate non-recorded screen or printed copy.

Do not open an API dashboard, `.env` file, GitHub administration page, invitation screen, `/feedback` record, or personal account.

## 2. Start the Controlled Checkout

- [ ] In the clean terminal, paste:

  ```bash
  pnpm --filter @accesspatch/demo-checkout dev --host 127.0.0.1 --port 4173 --strictPort
  ```

- [ ] Wait until the terminal shows that Vite is ready.
- [ ] Do not record the terminal if it shows a personal path.
- [ ] In the clean browser, open `http://127.0.0.1:4173/`.
- [ ] Confirm the page shows `Insulated sample mug`.

If the command fails, press `Ctrl+C`, stop the take, and use the reviewed fallback checkout clip. Do not install, update, repair, or change project files during recording.

## 3. Record the Keyboard Journey

- [ ] Start raw clip `01_checkout_keyboard_journey`.
- [ ] Ensure focus starts on the product heading.
- [ ] Press `Tab`, then `Enter` on `Add product to cart`.
- [ ] Press `Tab`, then `Enter` on `Open checkout`.
- [ ] Press `Tab`; type `Ada Lovelace`.
- [ ] Press `Tab`; type `12 Analytical Engine Way`.
- [ ] Press `Tab`; type `Berlin`.
- [ ] Press `Tab`; type `10115`.
- [ ] Press `Tab` to pass through the country control.
- [ ] Press `Tab`; type `ada@example.test`.
- [ ] Press `Tab` to focus `Continue to confirmation`.
- [ ] Pause to show the missing visible focus cue.
- [ ] Press `Enter`.
- [ ] Hold on `Order ready for review`.
- [ ] Stop the clip.

Do not use real personal data and do not use the mouse during this journey.

## 4. Start the Local Proof Report

- [ ] In a second clean terminal, paste:

  ```bash
  python3 -m http.server 4174 --bind 127.0.0.1 --directory examples/judge-sample/proof-bundle
  ```

- [ ] Open `http://127.0.0.1:4174/report.html`.
- [ ] Start raw clip `02_proof_bundle_report`.
- [ ] Slowly show:
  1. `Before and after journey`;
  2. `Controlled findings`;
  3. `GPT-5.6 repair-plan summary`;
  4. `Exact changed files`;
  5. `Manual review and claim boundaries`.
- [ ] Do not click external links.
- [ ] Stop the clip.

If the report server fails, press `Ctrl+C`, stop the take, and use the reviewed report screenshots. Do not open the report through a `file://` URL.

## 5. Record or Prepare the Evidence Inserts

Record each as a separate short clip or use independently reviewed screenshots:

- [ ] `03_before_evidence`
- [ ] `04_gpt_plan_and_audit`
- [ ] `05_deterministic_patch`
- [ ] `06_repaired_replay`
- [ ] `07_mutation_guard`
- [ ] `08_codex_and_verification`
- [ ] `09_limitations_close`

Use only the exact tracked files listed in `VIDEO_ASSET_MANIFEST.md`. Do not run the reasoner, repair command, Proof Bundle generator, Mutation Guard, or Judge Workflow during recording.

## 6. Optional Read-Only Validator Clip

Only if the edit needs a short terminal proof:

- [ ] Paste:

  ```bash
  pnpm judge:sample:validate
  ```

- [ ] Confirm the output ends with `JUDGE_SAMPLE_VALID`.
- [ ] Record only the bounded validator lines, not the prompt or surrounding terminal.
- [ ] Name the clip `10_optional_judge_sample_validator`.

If it fails, stop the take and omit this optional clip. Do not retry during recording.

## 7. Stop Local Processes

- [ ] Return to the checkout-server terminal and press `Ctrl+C`.
- [ ] Return to the report-server terminal and press `Ctrl+C`.
- [ ] Close the clean browser profile.
- [ ] Confirm no local server remains open.

## 8. Verify Repository Cleanliness

- [ ] In the neutral terminal, paste:

  ```bash
  git status --short --branch
  ```

- [ ] Confirm no modified or untracked project file is listed.
- [ ] If any unexpected file appears, stop. Do not delete or commit it without a separate review.

## 9. Record Narration Separately

- [ ] Use `VIDEO_SCRIPT.md` exactly.
- [ ] Record one section at a time in a quiet room.
- [ ] Speak slowly and clearly; follow the pronunciation guide.
- [ ] Name narration clips `narration_01` through `narration_11`.
- [ ] Do not speak a personal path, email, account name, or `/feedback` Thread ID.
- [ ] Keep the combined narration between `2:40` and `2:48`.

## 10. Assemble the Edit

- [ ] Follow `VIDEO_SHOTLIST.md` in order.
- [ ] Use no unlicensed music.
- [ ] Add `VIDEO_CAPTIONS.srt`.
- [ ] Keep evidence text large enough to read at normal playback speed.
- [ ] Keep Mutation Guard to the short bonus segment.
- [ ] Keep the final edit at or below `2:50`.
- [ ] Export a private review file before any upload.

## 11. Recover From a Failed Take

1. Stop recording.
2. Press `Ctrl+C` in any local-server terminal.
3. Do not install packages, change code, rerun GPT-5.6, or regenerate evidence.
4. Check repository cleanliness with `git status --short --branch`.
5. Use the matching reviewed fallback asset from `VIDEO_ASSET_MANIFEST.md`.
6. Start a new take only after the privacy checklist is clean.

## 12. Final Human Review

- [ ] Watch the complete video once without stopping.
- [ ] Watch it again frame by frame at every transition.
- [ ] Review audio and captions separately.
- [ ] Complete every item in `VIDEO_PRIVACY_CHECKLIST.md`.
- [ ] Confirm the final duration is below three minutes.
- [ ] Do not upload until a separate approval authorizes YouTube publication.
