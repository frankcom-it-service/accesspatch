# Video Privacy Checklist

The recording fails closed if any required item cannot be confirmed. Stop the capture, discard the affected take, correct the environment, and begin a new take only after review.

## Before Recording

- [ ] A separate unsigned browser profile is used with no sync, saved accounts, extensions, bookmarks, history, or account avatar.
- [ ] Do Not Disturb is enabled and all desktop notifications are disabled.
- [ ] Unrelated browser tabs, applications, chat windows, mail, and account pages are closed.
- [ ] The terminal prompt contains no personal username, machine name, home directory, or repository path.
- [ ] Terminal history is disabled for the recording shell and no previous command history is visible.
- [ ] No API key, token, password, cookie, authorization header, or credential-helper output is present.
- [ ] No `.env` file, `.env` content, or credential-file location is open or visible.
- [ ] No OpenAI API dashboard, API settings, raw prompt, or unredacted model response is open.
- [ ] No GitHub token, authentication output, repository administration page, invitation, collaborator, or organization settings screen is open.
- [ ] No personal email, Git author email, `/feedback` Thread ID, project ID, or organization ID is visible.
- [ ] No personal username, home path, temporary path, Windows user path, or `file://` URL can appear.
- [ ] Browser pages use only the approved localhost URLs.
- [ ] Synthetic checkout data is prepared; no real customer or personal information is used.
- [ ] Microphone monitoring confirms that no private conversation or ambient personal information is audible.
- [ ] No music, logos, screenshots, fonts, or media lacking permission are included.

## After Each Recording Take

- [ ] Review the beginning and end of the take for accidental desktop or terminal exposure.
- [ ] Review all address bars, title bars, prompts, tabs, and overlays.
- [ ] Confirm no notification appeared, even for a single frame.
- [ ] Confirm no private repository page or invitation information appeared.
- [ ] Confirm no credentials, tokens, `.env` information, personal paths, personal email, or author email appeared.
- [ ] Confirm the `/feedback` Thread ID did not appear or get spoken.
- [ ] Confirm the narration contains no accidental personal name, account information, or unsupported claim.
- [ ] Confirm the checkout data is entirely synthetic.
- [ ] Confirm terminal output is limited to the approved public-safe commands and result lines.
- [ ] Reject the take if any sensitive item is uncertain or partially obscured rather than clearly absent.

## Before Final Upload

- [ ] Perform a frame-by-frame privacy review at scene boundaries and every terminal or browser transition.
- [ ] Review the audio separately with headphones for unexpected speech, notifications, or personal information.
- [ ] Review captions separately; captions contain no IDs, credentials, paths, personal data, or unsupported claims.
- [ ] Confirm no browser bookmarks, sync profile, account avatar, or browsing history is visible.
- [ ] Confirm no raw prompt or raw model response is shown.
- [ ] Confirm no `file://` URL or local filesystem path is visible.
- [ ] Confirm no private repository administration, invitation, collaborator, or authentication screen is visible.
- [ ] Confirm the repository is never described as public or open source.
- [ ] Confirm the video states the controlled scope and human-review boundary.
- [ ] Confirm the edit uses no unlicensed music or unauthorized third-party media.
- [ ] Confirm the final duration is below three minutes and the planned target remains at or below `02:50`.
- [ ] Confirm the YouTube visibility will be public only after this checklist and the final content review pass.

## Final Approval

- [ ] Every item above is checked.
- [ ] Final reviewer name or initials: ____________________
- [ ] Review date and time: ____________________
- [ ] Final file reviewed: ____________________
- [ ] Approved for public upload: `YES / NO`

No upload is permitted while any item is unchecked or the approval value is `NO`.
