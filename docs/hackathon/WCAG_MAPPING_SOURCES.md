# WCAG 2.2 Mapping Sources

Checked: 2026-07-15

Status: Phase 2B COMPLETE in implementation commit `e3811c8bf968dc78701f8d264dc1377543059d64`; independent source, mapping, report, manifest, security, and all-15-artifact review passed.

This record supports only the two controlled `demo-checkout` findings. WCAG 2.2 is the normative standard; W3C Understanding documents are explanatory and informative. These evidence-oriented mappings are not a conformance determination or certification and do not establish complete WCAG coverage.

| Controlled finding | Criterion | Label | Level | Normative WCAG 2.2 source | Informative Understanding source | Mapping rationale |
| --- | --- | --- | --- | --- | --- | --- |
| `CONTROLLED_BARRIER_EMAIL_NAME` | `1.3.1` | Info and Relationships | A | https://www.w3.org/TR/WCAG22/#info-and-relationships | https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html | The visible “Email address” relationship is not programmatically associated with `#email`. |
| `CONTROLLED_BARRIER_EMAIL_NAME` | `4.1.2` | Name, Role, Value | A | https://www.w3.org/TR/WCAG22/#name-role-value | https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html | The `#email` form control has no programmatically determinable accessible name. |
| `CONTROLLED_BARRIER_FOCUS_VISIBLE` | `2.4.7` | Focus Visible | AA | https://www.w3.org/TR/WCAG22/#focus-visible | https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html | The keyboard-focused primary action has no visible focus indicator because the controlled CSS suppresses outline and box shadow. |

## Explicit 3.3.2 Exclusion

The email finding is not mapped to `3.3.2 Labels or Instructions`. Visible identifying text is already present. W3C’s informative [Understanding 3.3.2](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) document distinguishes label presence from programmatic association under `1.3.1` and accessible-name handling under `4.1.2`.

No additional success criterion may be added to this controlled mapping without a separate source-backed decision and review.
