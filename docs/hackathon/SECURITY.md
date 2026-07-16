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

The human-supervised development key is stored outside the repository at `$HOME/.config/accesspatch/openai.env`; the file mode is `600` and its containing directory is user-private. The secret value, project and organization identifiers, and payment data must never be recorded here.

The dedicated project is restricted to `gpt-5.6-sol`. Key permissions are model-list read, `/v1/responses` write, and no access to other endpoint groups. Cost exposure is bounded by an initial USD 5 prepaid balance with auto recharge disabled.

Phase 1B sourced `$HOME/.config/accesspatch/openai.env` only in the approved one-call shell immediately before `pnpm phase1:reason`; the key value was not displayed, inspected, logged, or copied. The request used `store: false`, no tools, no retries, and only normalized evidence with narrow allowlisted source excerpts. The demo uses sample values only and stores no orders, payments, or personal data.

The reasoner writes no raw API response. Its ignored audit record contains only timestamp, model and prompt versions, evidence and plan hashes, `store: false`, response status, token usage, policy result, and a sanitized failure category. Missing credentials fail closed; rejected or refused output produces no approved plan or repository change.

Pre-commit hardening adds portable requested-path and realpath containment, symlink-escape rejection, complete-file excerpt rejection, stricter controlled-evidence mappings, representative source-code-content rejection, and exact returned-model verification. An unexpected model records only sanitized `unexpected_model` failure metadata and cannot leave an approved plan.

Phase 1C keeps mutation inside a disposable ignored copy, excludes Git metadata, credentials, dependencies, builds, Playwright output, and prior runs, and accepts only exact transformations of the two allowlisted files. The approved corrected rerun removed temporary runtime configuration and the disposable copy, preserved the main fixture, and produced a validated sanitized audit containing no absolute user path, environment value, prompt, response, credential, sensitive identifier, or personal data.

Final Phase 1C isolation hardening explicitly ignores `.accesspatch/work/`, keeps ordinary source and test files eligible, excludes generated build/test output, `.env*` except `.env.example`, `.npmrc`, `.netrc`, private-key or certificate extensions `.pem`, `.key`, `.p12`, `.pfx`, and directories named `secrets`. The copy traverses regular files only and rejects an included symlink without following it; errors contain only repository-relative paths and never file contents. The corrected audit strategy supersedes the earlier wording that inaccurately implied source tests were excluded.

The controlled Phase 1C implementation is committed at `79ed0e60b2c7145f4113ecac3797a119ccb696ee`. Its reviewed audit records no credential, environment value, raw prompt, raw response, absolute user path, sensitive identifier, or personal data. No additional model request occurred during Phase 1C.

Phase 2A reads only the eight reviewed Phase 1 artifacts as regular files, rechecks their exact hashes and schemas, reruns both deterministic policies offline, and writes only to ignored `.accesspatch/runs/phase2/`. Bundle generation rejects symlinks, unsafe paths, unexpected inventory, credentials, environment values, absolute local paths, sensitive identifiers, raw prompt/response fields, and unsupported positive compliance claims. It validates a temporary bundle before atomic replacement and removes temporary directories after success or failure.

The real Phase 2A bundle passed these controls and independent full-bundle security review; it contains no remote report resources and remains untracked. Its static report's zero-violation axe smoke is a narrow automated result, not proof of complete accessibility. The generator is committed at `61b4b90a93c52c8e93fd4b539176e9f828c9f3b3`.

Phase 2B allows only six exact W3C hyperlinks in `report.html`: one normative and one informative source for each of the three approved mappings. The report loads no remote resource automatically, identifies every external link visually and programmatically, rejects altered sources and unsupported criteria, and fails on positive certification or full-conformance language. The implementation is committed at `e3811c8bf968dc78701f8d264dc1377543059d64`; the generated bundle remains ignored, untracked, and independently reviewed.

Committed Phase 2C implementation `e7286d6e14cefcc95faea31a5dfb4a7ca303f4ce` allowlists only `examples/judge-sample/` for tracked proof. Its bundle is byte-identical to the reviewed ignored run, and its external `SHA256SUMS` pins every file. The validator is read-only, network-free, independent of `.accesspatch/runs/`, rejects symlinks, special files, unsafe checksum paths, hash drift, unsafe report links, credentials, environment values, absolute local paths, sensitive identifiers, raw prompt/response fields, and unsupported claims. CLI-visible failures sanitize absolute and traversal paths rather than echoing them.

Committed Phase 3A passes only a minimal environment allowlist to child commands, omits OpenAI and other credential variables, sets external proxy routes to a closed local endpoint, and permits only local loopback for the fixture. Before preflight it creates empty restricted `gitconfig` and `npmrc` files under the reserved ignored workflow directory. Every Git child disables system configuration, redirects global configuration, disables terminal prompts, and disables interactive credential handling. Every pnpm child redirects user and global npm configuration and disables automatic dependency verification, update notification, audit, and funding behavior. Fake-home tests confirm marker `.gitconfig` and `.npmrc` values are not observed. Cleanup covers success, stage failure, preflight failure, and unexpected exceptions without touching reviewed runs. The corrected second lifetime workflow execution passed with ignored runs absent and removed all runtime configuration afterward. Clean-machine verification remains open.

## Reporting and Open Work

- Vulnerability reporting channel: `OPEN` — no public repository or contact route is configured.
- Threat model: `TODO` before arbitrary-repository support or patch application.
- Application code and package dependencies now exist. Phase 1B hardening secret-pattern and repository-hygiene scans passed before commit `207e0559d0d7664a24dcb297fb40b37700f36208`. `pnpm audit --audit-level=high` reported no known vulnerabilities, and `pnpm licenses list --json` identified licenses for OpenAI SDK `6.47.0`, Zod `4.4.3`, and the existing graph; manual review of final redistribution and attribution obligations remains `TODO` before submission.
- Authentication, authorization, sandboxing, retention, and deletion behavior: `NOT YET IMPLEMENTED`.
