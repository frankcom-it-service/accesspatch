# Final Video Script

## Status and Timing

**FINAL PRODUCTION SCRIPT / RECORDING PENDING.**

- Target narration and edited duration: `2:46`.
- Acceptable narration range: `2:40–2:48`.
- Hard planning maximum: `2:50`.
- Official video maximum: under three minutes.
- Language: English.
- Delivery: calm, clear, and conversational; pause briefly between sections.
- Live GPT-5.6 call: prohibited for the recording plan. Use the tracked reviewed repair plan and model audit.

## Pronunciation Guide

- **AccessPatch:** “ACCESS patch”
- **accessibility:** “uhk-SESS-uh-BIL-uh-tee”
- **deterministic:** “dee-TUR-muh-NISS-tik”
- **Chromium:** “KROH-mee-um”
- **Codex:** “KOH-deks”
- **GPT-5.6:** “G P T five point six”

## Final Narration

### 00:00–00:12 — Problem and Promise

**Narration:** Accessibility barriers can break a user journey even when a page still looks finished. AccessPatch finds a controlled problem, repairs it, and proves the result.

### 00:12–00:38 — Controlled Broken Journey

**Narration:** Here is one React checkout journey. I use only the keyboard to add the sample product, open checkout, enter synthetic data, and move to the primary action. The email field shows visible text, but it has no programmatically associated accessible name. The primary action receives keyboard focus, but no visible focus cue appears.

### 00:38–00:48 — Journey Completion

**Narration:** The form still reaches confirmation. AccessPatch records barriers in the real journey state, not only in isolated components.

### 00:48–01:02 — Evidence

**Narration:** The evidence contains exactly two findings. Axe reports one label violation on the email field. Browser evidence records no visible outline or box shadow on the focused button.

### 01:02–01:17 — Bounded GPT-5.6 Plan

**Narration:** One bounded GPT-5.6 call reviewed this evidence with store false. It used 2,444 recorded tokens and selected two allowlisted repair strategies. It did not write or directly apply source code.

### 01:17–01:34 — Deterministic Repair

**Narration:** Deterministic templates perform the repair in a disposable copy. One associates the visible email label with the input. The other removes only the controlled rule that suppresses the focus indicator.

### 01:34–01:50 — Repaired Replay

**Narration:** The same journey is replayed after repair. It reaches confirmation, axe reports zero violations, and keyboard focus has a visible solid three-pixel outline. The original fixture remains unchanged.

### 01:50–02:12 — Proof Bundle

**Narration:** The fifteen-file Proof Bundle connects the findings, repair plan, exact diff, replay, audit records, and human-review boundaries. Its report shows the before and after states and three source-backed WCAG mappings, without claiming certification.

### 02:12–02:28 — Mutation Guard Bonus

**Narration:** As a prevention bonus, Mutation Guard injects one controlled aria-hidden regression into another disposable copy. AccessPatch detects it once, preserves the original fixture, and cleans the temporary runtime.

### 02:28–02:42 — Codex Contribution

**Narration:** Codex was the primary engineering environment. Under human coordination, it implemented most code, tests, security hardening, review, and reproducibility work. The final suite has 178 API-free tests, an eight-stage Judge Workflow, and a successful seventeen-stage clean-clone verification.

### 02:42–02:46 — Limit and Close

**Narration:** AccessPatch remains a controlled demonstration. Human accessibility review is still required.

## Claim Boundaries

The narration must not be expanded to claim complete accessibility testing, universal repair, arbitrary-repository support, production patch deployment, broad mutation testing, complete regression prevention, WCAG certification, BFSG or EAA assurance, legal compliance, or replacement of disabled-user testing and qualified human review.
