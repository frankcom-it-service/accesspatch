# Private Repository Release Plan

This remains the gated private-release plan and status record.

## Current Status

- Private repository created at `https://github.com/frankcom-it-service/accesspatch`.
- Owner organization: `frankcom-it-service`.
- Visibility: private.
- Default branch: `main`.
- Organization default repository permission: `none`.
- `main`, `backup/submission-baseline-2026-07-16`, and tag `submission-baseline-2026-07-16` are present remotely.
- `release/phase4b-private-readiness` remains local-only.
- Both required judging invitations were issued with read permission and remain pending.
- Invitation acceptance, independent judge cloning, and no-cost access verification remain open.

## Release Steps

1. Create a private repository on the user-selected Git hosting service. **Completed.**
2. Verify the repository is private before any push. **Completed.**
3. Add the remote only after separate explicit approval. **Completed.**
4. Push `main`, tag `submission-baseline-2026-07-16`, and branch `backup/submission-baseline-2026-07-16`. **Completed.**
5. Confirm no other local-only branch is unintentionally published. **Completed.**
6. Invite `testing@devpost.com` and `build-week-event@openai.com` with read permission. **Issued; both pending.**
7. Verify both invitation and access states. **Pending acceptance and independent clone.**
8. Verify judges can clone and test without payment.
9. Record the private repository URL in internal submission records. **Completed.**
10. Test judge access without making the repository public.
11. Do not make the repository public without a separate user decision.

## Release Gate

- Confirm the intended frozen commit, tag, and backup branch.
- Recheck repository privacy before and after the first push.
- Recheck tracked files for credentials, personal paths, account data, and unintended generated output.
- Confirm `OWNERSHIP.md` and third-party notices are present.
- Confirm the judging accounts receive only the intended private access.
- Treat `https://github.com/frankcom-it-service/accesspatch` as the canonical private URL while access verification remains pending.

## Rollback

If visibility or remote configuration is incorrect:

1. Stop further pushes and invitations.
2. Make the repository private immediately if it was exposed.
3. Revoke incorrect invitations or access.
4. Remove or correct the local remote only after explicit approval.
5. Inspect provider audit and access settings.
6. Treat any exposed credential as compromised and revoke it outside the repository.
7. Document the incident and repeat the privacy, secret, and access checks before continuing.
