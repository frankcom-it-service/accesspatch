# Security

## Current Posture

Phase 0 contains documentation and configuration examples only. There is no application security implementation to assess yet.

## Planned Boundaries

- Treat inspected repositories, journey content, browser output, and model responses as untrusted input.
- Minimize data sent to any model and never send secrets by default.
- Require structured model output, schema validation, deterministic safety checks, and explicit approval before a future repair is applied.
- Constrain file access and commands to an approved workspace; prevent path traversal and arbitrary command execution.
- Produce reviewable diffs, support rollback, and keep evidence provenance without storing credentials.
- Redact tokens, personal data, and sensitive application content from logs and proof artifacts.

## Secret Handling

Use `.env.example` only as a key-name template. Real `.env*` files, keys, certificates, logs, traces, and generated proof runs are ignored. A future curated judge-visible sample proof requires an explicit reviewed tracked location or allowlist. If a secret is exposed, revoke it outside this repository and remove it from all artifacts before continuing.

## Reporting and Open Work

- Vulnerability reporting channel: `OPEN` — no public repository or contact route is configured.
- Threat model: `TODO` after architecture selection.
- Dependency and code scanning: `NOT YET APPLICABLE`; no dependencies or application code exist.
- Authentication, authorization, sandboxing, retention, and deletion behavior: `NOT YET IMPLEMENTED`.
