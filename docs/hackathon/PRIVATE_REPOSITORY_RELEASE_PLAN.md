# Private Repository Release Plan

This is a gated plan only. No remote repository or external access has been created.

## Release Steps

1. Create a private repository on the user-selected Git hosting service.
2. Verify the repository is private before any push.
3. Add the remote only after separate explicit approval.
4. Push `main`, tag `submission-baseline-2026-07-16`, and branch `backup/submission-baseline-2026-07-16`.
5. Confirm no other local-only branch is unintentionally published.
6. Invite `testing@devpost.com` and `build-week-event@openai.com`.
7. Verify both invitation and access states.
8. Verify judges can clone and test without payment.
9. Record the private repository URL in internal submission records.
10. Test judge access without making the repository public.
11. Do not make the repository public without a separate user decision.

## Release Gate

- Confirm the intended frozen commit, tag, and backup branch.
- Recheck repository privacy before and after the first push.
- Recheck tracked files for credentials, personal paths, account data, and unintended generated output.
- Confirm `OWNERSHIP.md` and third-party notices are present.
- Confirm the judging accounts receive only the intended private access.
- Record the final private URL only after access testing succeeds.

## Rollback

If visibility or remote configuration is incorrect:

1. Stop further pushes and invitations.
2. Make the repository private immediately if it was exposed.
3. Revoke incorrect invitations or access.
4. Remove or correct the local remote only after explicit approval.
5. Inspect provider audit and access settings.
6. Treat any exposed credential as compromised and revoke it outside the repository.
7. Document the incident and repeat the privacy, secret, and access checks before continuing.
