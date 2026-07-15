import {
  FINDING_IDS,
  JOURNEY_ID,
  PROMPT_VERSION,
  REQUIRED_FORBIDDEN_CHANGES,
  type JourneyEvidence,
} from '@accesspatch/shared-types';

export function buildRepairPrompt(evidence: JourneyEvidence): {
  instructions: string;
  input: string;
} {
  const instructions = [
    `Prompt version: ${PROMPT_VERSION}.`,
    'Act only as the bounded AccessPatch Evidence-Based Repair Reasoner.',
    `Return a repair plan for journey ${JOURNEY_ID} using only the supplied normalized evidence.`,
    `Return exactly one repair for each finding: ${FINDING_IDS.join(', ')}.`,
    'Map CONTROLLED_BARRIER_EMAIL_NAME to associate_explicit_label, apps/demo-checkout/src/App.tsx, and #email.',
    'Map CONTROLLED_BARRIER_FOCUS_VISIBLE to restore_focus_visible, apps/demo-checkout/src/styles.css, and .controlled-focus-defect.',
    'Describe only low-risk, narrowly permitted changes in prose.',
    `Each repair must include every forbidden-change statement exactly once: ${REQUIRED_FORBIDDEN_CHANGES.join(' ')}`,
    'Verification steps must be prose descriptions, not shell commands.',
    'Do not output source code, markup, CSS, a patch, shell commands, dependency changes, legal claims, WCAG references, or unrelated redesign suggestions.',
    'Preserve the original demo repository for a later controlled patch step.',
    'State residual risks honestly and do not imply certification or complete accessibility.',
  ].join('\n');

  const input = JSON.stringify({
    promptVersion: PROMPT_VERSION,
    normalizedEvidence: evidence,
  });

  return { instructions, input };
}
