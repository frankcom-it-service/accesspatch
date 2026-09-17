# Security

## Current Posture

Phase 1B adds local evidence collection and one outbound Responses API integration for bounded repair planning. Phase 1C maps only approved safe-fix classes to deterministic templates inside a disposable copy; model output is not executed as source code and the controlled main fixture is not modified. The fixture still has no backend, authentication, payment processing, persistence, or remote runtime assets.

## Planned Boundaries

- Treat inspected repositories, journey content, browser output, and model responses as untrusted input.
- Minimize data sent to any model and never send secrets by default.
- Require structured model output, schema validation, deterministic safety checks, and explicit approval before a future repair is applied.
- Constrain file access and commands to an approved workspace; prevent path traversal and arbitrary command execution.
- Produce reviewable diffs, support rollback, and keep evidence provenance without storing credentials.
- Redact tokens, personal data, and sensitive application content from logs and proof artifacts.

## Secret Handling

Use `.env.example` only as a key-name template. Real `.env*` files, keys, certificates, logs, traces, and generated proof runs are ignored. The independently reviewed `examples/judge-sample/` is the only explicit tracked generated-evidence allowlist. If a secret is exposed, revoke it outside this repository and remove it from all artifacts before continuing.

The human-supervised development key is stored outside the repository in a user-private configuration file with mode `600`. Its precise location is intentionally omitted from public-facing documentation. The secret value, project and organization identifiers, and payment data must never be recorded here.

The dedicated project is restricted to `gpt-5.6-sol`. Key permissions are model-list read, `/v1/responses` write, and no access to other endpoint groups. Cost exposure is bounded by an initial USD 5 prepaid balance with auto recharge disabled.

Phase 1B sourced the external user-private credential file only in the approved one-call shell immediately before `pnpm phase1:reason`; the key value was not displayed, inspected, logged, or copied. The request used `store: false`, no tools, no retries, and only normalized evidence with narrow allowlisted source excerpts. The demo uses sample values only and stores no orders, payments, or personal data.

The reasoner writes no raw API response. Its ignored audit record contains only timestamp, model and prompt versions, evidence and plan hashes, `store: false`, response status, token usage, policy result, and a sanitized failure category. Missing credentials fail closed; rejected or refused output produces no approved plan or repository change.

Pre-commit hardening adds portable requested-path and realpath containment, symlink-escape rejection, complete-file excerpt rejection, stricter controlled-evidence mappings, representative source-code-content rejection, and exact returned-model verification. An unexpected model records only sanitized `unexpected_model` failure metadata and cannot leave an approved plan.

Phase 1C keeps mutation inside a disposable ignored copy, excludes Git metadata, credentials, dependencies, builds, Playwright output, and prior runs, and accepts only exact transformations of the two allowlisted files. The approved corrected rerun removed temporary runtime configuration and the disposable copy, preserved the main fixture, and produced a validated sanitized audit containing no absolute user path, environment value, prompt, response, credential, sensitive identifier, or personal data.

Final Phase 1C isolation hardening explicitly ignores `.accesspatch/work/`, keeps ordinary source and test files eligible, excludes generated build/test output, `.env*` except `.env.example`, `.npmrc`, `.netrc`, private-key or certificate extensions `.pem`, `.key`, `.p12`, `.pfx`, and directories named `secrets`. The copy traverses regular files only and rejects an included symlink without following it; errors contain only repository-relative paths and never file contents. The corrected audit strategy supersedes the earlier wording that inaccurately implied source tests were excluded.

The controlled Phase 1C implementation is committed at `79ed0e60b2c7145f4113ecac3797a119ccb696ee`. Its reviewed audit records no credential, environment value, raw prompt, raw response, absolute user path, sensitive identifier, or personal data. No additional model request occurred during Phase 1C.

Phase 2A reads only the eight reviewed Phase 1 artifacts as regular files, rechecks their exact hashes and schemas, reruns both deterministic policies offline, and writes only to ignored `.accesspatch/runs/phase2/`. Bundle generation rejects symlinks, unsafe paths, unexpected inventory, credentials, environment values, absolute local paths, sensitive identifiers, raw prompt/response fields, and unsupported positive compliance claims. It validates a temporary bundle before atomic replacement and removes temporary directories after success or failure.

The real Phase 2A bundle passed these controls and independent full-bundle security review; it contains no remote report resources and remains untracked. Its static report's zero-violation axe smoke is a narrow automated result, not proof of complete accessibility. The generator is committed at `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`.

Phase 2B allows only six exact W3C hyperlinks in `report.html`: one normative and one informative source for each of the three approved mappings. The report loads no remote resource automatically, identifies every external link visually and programmatically, rejects altered sources and unsupported criteria, and fails on positive certification or full-conformance language. The implementation is committed at `e3811c8bf968dc78701f8d264dc1377543059d64`; the generated bundle remains ignored, untracked, and independently reviewed.

Committed Phase 2C implementation `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce` allowlists only `examples/judge-sample/` for tracked proof. Its bundle is byte-identical to the reviewed ignored run, and its external `SHA256SUMS` pins every file. The validator is read-only, network-free, independent of `.accesspatch/runs/`, rejects symlinks, special files, unsafe checksum paths, hash drift, unsafe report links, credentials, environment values, absolute local paths, sensitive identifiers, raw prompt/response fields, and unsupported claims. CLI-visible failures sanitize absolute and traversal paths rather than echoing them.

Committed Phase 3A passes only a minimal environment allowlist to child commands, omits OpenAI and other credential variables, sets external proxy routes to a closed local endpoint, and permits only local loopback for the fixture. Before preflight it creates empty restricted `gitconfig` and `npmrc` files under the reserved ignored workflow directory. Every Git child disables system configuration, redirects global configuration, disables terminal prompts, and disables interactive credential handling. Every pnpm child redirects user and global npm configuration and disables automatic dependency verification, update notification, audit, and funding behavior. Fake-home tests confirm marker `.gitconfig` and `.npmrc` values are not observed. Cleanup covers success, stage failure, preflight failure, and unexpected exceptions without touching reviewed runs. The corrected second lifetime workflow execution passed with ignored runs absent and removed all runtime configuration afterward.

Phase 3B verified the committed workflow in a fresh local Git clone under isolated Git, npm/pnpm, cache, state, and temporary configuration. Frozen installation used registry access and emitted transient retry warnings; the subsequent Judge Workflow required no API credential, ran with `.accesspatch/runs/` absent, and had no external TCP connection observed by the monitor. Source and Judge Sample bytes remained unchanged, and the temporary clone and isolated configuration were removed.

The first evidence archive contained sanitized file contents but retained local owner/group names in TAR headers. It was repackaged without changing evidence bytes using neutral numeric ownership, empty stored names, restrictive modes, normalized timestamps, and no PAX atime/ctime metadata. Independent review passed the final archive at `docs/hackathon/evidence/phase3b-clean-clone/`. Evidence commit `8d2afef856d48d07ffb77013ad7385dd3810a4ed` tracks that archive as non-executable Git mode `100644`. This proves one controlled clean-clone execution, not general network isolation, security certification, or broader-platform support.

## Historical Private Release Posture — Build Week Submission

This section records the repository state at the original July 2026 Build Week submission. It no longer describes current visibility or licensing: AccessPatch is now public and released under Apache License 2.0 (`LICENSE`). The recorded access checks, decisions, and audit provenance remain historical; no invitation state is newly verified here.

Phase 4B selects a private judging repository and no open-source project license. Public-facing material must omit local usernames, home and temporary paths, credential locations, account screens, API settings, Git author email addresses, notifications, and private account data. Git history remains private and will not be rewritten because commit hashes anchor the evidence record.

The canonical repository is `https://github.com/frankcom-it-service/accesspatch`. It remains private under the `frankcom-it-service` organization, whose default repository permission is `none`; the repository owner retains admin access. Exactly five approved references are present remotely: `main`, two immutable baseline backup branches, and their two matching lightweight tags. Local feature and release branches remain unpublished.

Both required judging invitations were issued with read permission and remain pending. Invitation acceptance and independent judge cloning are not yet verified. The submission video is public on YouTube, but no public source repository, publicly hosted application demo, open-source project license, server, subdomain, Pages site, deployment, or software release exists.

The reviewed private release surface is committed at `f3953994883af959fdd80d2d5e5985b7cb987fd5`. It adds no `LICENSE` file; AccessPatch remains all-rights-reserved and is not offered under an open-source project license. The direct dependency review found no missing, unknown, or contradictory declared license.

## Accessibility Mutation Guard

Phase 5A copies only four allowlisted controlled fixture files as regular files, rejects symlinks and traversal, and omits Git metadata, credentials, environment files, dependencies, prior runs, caches, tests, documentation, and unrelated user content. Fixture ID `demo-checkout-controlled-v1` is bound to approved aggregate SHA-256 `50a88ce11e4afc62f66c595b313156f2f1a7f1fc98eb2f6ad1206b8260fbbfd4`; drift, missing input, or an already-mutated target fails before runtime creation or old-evidence deletion.

Child Vite and Playwright processes receive isolated HOME, configuration, cache, application-data, and temporary directories beneath one unique system-temporary runtime root. Real parent user/config/temp paths and credential-like variables are not propagated. Only required executable environment is retained, external proxy destinations are closed, and localhost remains allowed. The browser runtime is separate from the contained repository work copy because the verified system Chromium worker terminates when its Playwright profile is placed in repository work storage.

The fixed `.accesspatch`, work, runs, Phase 5A, and final-output chains are inspected with `lstat`, reject symlinks and non-directory ancestors, and require real-path containment inside the repository before creation, deletion, rename, or evidence writes. Unsafe external targets remain untouched.

The only transformation is an exact one-match injection of `aria-hidden="true"` on `.controlled-focus-defect` inside the disposable copy. Deterministic browser evidence must confirm one enabled visible native button, nonnegative tab index, active keyboard focus, one `aria-hidden="true"` match, and one accepted detector result. All isolated directories, Vite configuration, detector source, Chromium selection, Playwright configuration, and child environment are prepared before Vite spawn. The successful spawn returns only after an error listener is installed, and the caller immediately enters bounded process cleanup protection. Server waiting uses the supplied abort signal, asynchronous spawn errors are reduced to a stable category, and no raw child output or absolute runtime path is exposed.

Contained-copy removal and external-browser-runtime removal are attempted independently. Both roots must then be absent; a failure or remaining root produces a sanitized cleanup error and prevents success evidence. The retained fixture hash is still verified after operation and cleanup failures. Focused tests cover post-start exceptions, abort during server waiting, spawn error handling, and each independent cleanup-failure direction. Ignored evidence is written atomically only after cleanup and retained-fixture hash verification.

This optional guard makes no broad mutation-testing, complete WCAG, certification, compliance, retained-application, fallback, rollback, or human-review replacement claim. It calls no model or external API and does not modify the Proof Bundle contract or Judge Sample.

Phase 5A implementation commit `b05541f147a08cb0b38ecbda5ae5802db065a3d2` passed final review with archive SHA-256 `d2d63d1c708b57e000fe915092ac70c4f457608eededf0e96757b7a0c56a3c91`.

The final clean clone at `d75954b672cbc88569d5502198effc57c4390c63` used isolated Git/npm/home/cache/temp configuration and closed external proxies. Its single offline frozen installation reused 33 packages and downloaded zero. A temporary clone-only `trustLockfile: true` key skipped unavailable lockfile trust-metadata revalidation without weakening frozen-lockfile or tarball-integrity checks; the original workspace file was restored byte-for-byte before runtime execution. The Mutation Guard detected one mutation, the eight-stage Judge Workflow passed with 178 tests, and no residual process or runtime path remained.

The independently reviewed sanitized archive SHA-256 is `eec0095939e73ccf623b5d5f8d75af73a6b7f5d16e686c34dad0000629fd97d6`, tracked with its extracted checksum-protected files under `docs/hackathon/evidence/phase5a-clean-clone/`. Reviewed Phase 5A HEAD `e7701516f07c204c8ba5792dcf2c100c9b508222` was integrated into `main` by strict fast-forward without a merge commit; the local feature branch remains retained but unpublished. Fixture, Judge Sample, Phase 3B, immutable refs, and external backup bytes remained unchanged. This proves only the fixed Debian/x86_64 Chromium demonstration and makes no broad mutation, arbitrary-repository, certification, retained-application, fallback, or rollback claim.

## Final Frozen-Tree Gate — 2026-07-17

Frozen source HEAD `a6923d3294a62f1e2b7061c448a1629abce8f77b` passed a consolidated read-only release gate. Tracked-filename review found only the intentional empty-value template `.env.example`; high-risk private-key and service-token patterns, non-empty credential assignments, real personal filesystem paths, and unexpected public-facing email addresses produced no finding. `pnpm audit --audit-level=high` reported no known vulnerabilities, and `pnpm judge:sample:validate` reported passed manifest, policy, and security gates with `JUDGE_SAMPLE_VALID`. `git diff --check` passed. HEAD, the Git tree, index, worktree, immutable baseline references, and the five approved remote references remained unchanged during the gate.

The project owner separately confirmed that the dedicated Devpost `/feedback` Session ID matches the internal record exactly and that the published video contains no unlicensed music or unauthorized third-party brands, images, video, or other media. These are owner confirmations, not independent external verification. The identifier itself remains excluded from public-facing documentation.

## Reporting and Open Work

- Dedicated confidential vulnerability reporting channel: `OPEN` — no such channel is documented. Public repository availability does not establish a confidential reporting route; do not disclose secrets in public issues.
- Threat model: `TODO` before arbitrary-repository support or patch application.
- Application code and package dependencies now exist. Phase 1B hardening secret-pattern and repository-hygiene scans passed before commit `207e0559d0d7664a24dcb297fb40b37700f36208`. The frozen-tree 2026-07-17 `pnpm audit --audit-level=high` gate reported no known vulnerabilities. The 2026-07-16 offline `pnpm licenses list --json` review identified every installed license family and every direct external dependency license; no direct dependency had an unknown, missing, or contradictory declared license. Current attribution and redistribution notes are complete in `THIRD_PARTY_NOTICES.md`.
- Authentication, authorization, sandboxing, retention, and deletion behavior: `NOT YET IMPLEMENTED`.
