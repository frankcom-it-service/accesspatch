const EMAIL_DEFECT = `                {/* Controlled Phase 1 fixture: visible text intentionally is not programmatically associated with this input. Do not copy this defect into production code. */}
                <span className="field-label">Email address</span>`;

const EMAIL_REPAIR = `                {/* Controlled Phase 1 repair: associate the existing visible text with the existing email input. */}
                <label className="field-label" htmlFor="email">
                  Email address
                </label>`;

const FOCUS_DEFECT = `/* Controlled Phase 1 fixture: remove every relevant outline and box-shadow focus cue from the primary action. Do not copy this defect into production code. */
.controlled-focus-defect:focus,
.controlled-focus-defect:focus-visible {
  outline: none;
  box-shadow: none;
}
`;

export class PatchTemplateError extends Error {}

function occurrenceCount(content: string, expected: string): number {
  return content.split(expected).length - 1;
}

function requireSinglePrecondition(
  content: string,
  expected: string,
  name: string,
): void {
  const count = occurrenceCount(content, expected);
  if (count !== 1) {
    throw new PatchTemplateError(`${name}_precondition_count:${count}`);
  }
}

export function applyExplicitLabelTemplate(content: string): string {
  requireSinglePrecondition(content, EMAIL_DEFECT, 'email');
  if (content.includes('htmlFor="email"')) {
    throw new PatchTemplateError('email_already_repaired');
  }
  return content.replace(EMAIL_DEFECT, EMAIL_REPAIR);
}

export function applyFocusVisibleTemplate(content: string): string {
  requireSinglePrecondition(content, FOCUS_DEFECT, 'focus');
  return content.replace(FOCUS_DEFECT, '');
}

export const controlledTemplateFixtures = {
  emailDefect: EMAIL_DEFECT,
  emailRepair: EMAIL_REPAIR,
  focusDefect: FOCUS_DEFECT,
} as const;
