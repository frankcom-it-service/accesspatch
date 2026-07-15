# Security

## Current Posture

Phase 1A adds a local static checkout fixture and browser tests only. It has no backend, authentication, payment processing, persistence, remote assets, or network dependency at runtime. It is not the AccessPatch product.

## Planned Boundaries

- Treat inspected repositories, journey content, browser output, and model responses as untrusted input.
- Minimize data sent to any model and never send secrets by default.
- Require structured model output, schema validation, deterministic safety checks, and explicit approval before a future repair is applied.
- Constrain file access and commands to an approved workspace; prevent path traversal and arbitrary command execution.
- Produce reviewable diffs, support rollback, and keep evidence provenance without storing credentials.
- Redact tokens, personal data, and sensitive application content from logs and proof artifacts.

## Secret Handling

Use `.env.example` only as a key-name template. Real `.env*` files, keys, certificates, logs, traces, and generated proof runs are ignored. A future curated judge-visible sample proof requires an explicit reviewed tracked location or allowlist. If a secret is exposed, revoke it outside this repository and remove it from all artifacts before continuing.

The human-supervised development key is stored outside the repository at `$HOME/.config/accesspatch/openai.env`; the file mode is `600` and its containing directory is user-private. The secret value, project and organization identifiers, and payment data must never be recorded here.

The dedicated project is restricted to `gpt-5.6-sol`. Key permissions are model-list read, `/v1/responses` write, and no access to other endpoint groups. Cost exposure is bounded by an initial USD 5 prepaid balance with auto recharge disabled.

Phase 1A did not read `$HOME/.config/accesspatch/openai.env` and made no OpenAI API call. The demo uses sample test values only and states that it stores no orders, payments, or personal data.

## Reporting and Open Work

- Vulnerability reporting channel: `OPEN` — no public repository or contact route is configured.
- Threat model: `TODO` after architecture selection.
- Application code and package dependencies now exist. Secret-pattern and repository-hygiene scans passed for Phase 1A; a full dependency vulnerability and license review remains `TODO`.
- Authentication, authorization, sandboxing, retention, and deletion behavior: `NOT YET IMPLEMENTED`.
