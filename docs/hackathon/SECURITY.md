# Security

## Current Posture

Phase 1B adds local evidence collection and one outbound Responses API integration for bounded repair planning. The fixture still has no backend, authentication, payment processing, persistence, or remote runtime assets. No model output can modify the repository in this phase.

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

Phase 1B sourced `$HOME/.config/accesspatch/openai.env` only in the approved one-call shell immediately before `pnpm phase1:reason`; the key value was not displayed, inspected, logged, or copied. The request used `store: false`, no tools, no retries, and only normalized evidence with narrow allowlisted source excerpts. The demo uses sample values only and stores no orders, payments, or personal data.

The reasoner writes no raw API response. Its ignored audit record contains only timestamp, model and prompt versions, evidence and plan hashes, `store: false`, response status, token usage, policy result, and a sanitized failure category. Missing credentials fail closed; rejected or refused output produces no approved plan or repository change.

Pre-commit hardening adds portable requested-path and realpath containment, symlink-escape rejection, complete-file excerpt rejection, stricter controlled-evidence mappings, representative source-code-content rejection, and exact returned-model verification. An unexpected model records only sanitized `unexpected_model` failure metadata and cannot leave an approved plan.

## Reporting and Open Work

- Vulnerability reporting channel: `OPEN` — no public repository or contact route is configured.
- Threat model: `TODO` before arbitrary-repository support or patch application.
- Application code and package dependencies now exist. Phase 1B hardening secret-pattern and repository-hygiene scans passed before the pending commit. `pnpm audit --audit-level=high` reported no known vulnerabilities, and `pnpm licenses list --json` identified licenses for OpenAI SDK `6.47.0`, Zod `4.4.3`, and the existing graph; manual review of final redistribution and attribution obligations remains `TODO` before submission.
- Authentication, authorization, sandboxing, retention, and deletion behavior: `NOT YET IMPLEMENTED`.
