# Private Release and Privacy Decision

**Historical Build Week record:** This document preserves the July 2026 submission/production state, including then-private access and licensing decisions. Those descriptions are not current repository policy. As recorded on 2026-09-17, AccessPatch is now public and Apache-2.0 licensed; see root `README.md`, `OWNERSHIP.md`, and `LICENSE`. Historical checklist results and evidence are not retroactively changed.

- Decision date: 2026-07-16
- Legal owner: Frank Heilmann
- Approved attribution: Frank Heilmann, trading as “Frankcom IT Service”
- Repository model: private hackathon judging repository
- Canonical repository: `https://github.com/frankcom-it-service/accesspatch`
- Repository owner: `frankcom-it-service`

The repository exists privately with `main` as its default branch. The organization default repository permission is `none`, and the repository owner retains admin access. The immutable baseline backup branch and tag are present remotely; the Phase 4B release branch remains local-only.

The required judging invitations were issued with read permission and remain pending:

- `testing@devpost.com`, resolved by GitHub to `devposttesting`
- `build-week-event@openai.com`, invited directly by email

Invitation acceptance and independent judge cloning are not yet verified. Pending invitations do not establish completed access.

No public source-code repository is currently approved, and AccessPatch is not offered under an open-source project license. Public materials may explain the product concept and show the controlled demonstration, but they should avoid exposing source code unnecessarily.

Public-facing material must not include local usernames, home or temporary paths, credential locations, account screens, API settings, Git author email addresses, notifications, or private account data. Existing Git author metadata remains part of the private repository history. Git history will not be rewritten because doing so would invalidate commit hashes and evidence references. The author email must not be copied into the README, Devpost text, video overlays, screenshots, or public web pages.

The sanitized Judge Sample and Phase 3B clean-clone evidence remain approved. A separate server capable of hosting a subdomain exists, but no server access, subdomain configuration, or demo hosting is authorized in Phase 4B.

The organization repository URL is the only current canonical repository URL. Any later public release requires a separate user decision and a separate licensing and privacy review.
