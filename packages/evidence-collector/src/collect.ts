import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import {
  ALLOWED_TARGET_FILES,
  EVIDENCE_SCHEMA_VERSION,
  JOURNEY_ID,
  JourneyEvidenceSchema,
  type JourneyEvidence,
} from '@accesspatch/shared-types';
import { readBoundedSourceContext } from './source-context.ts';

export const PHASE1_EVIDENCE_PATH = '.accesspatch/runs/phase1/evidence.json';

export async function collectJourneyEvidence(
  page: Page,
  repositoryRoot: string,
): Promise<JourneyEvidence> {
  await page.goto('/');

  await page.keyboard.press('Tab');
  assert.equal(
    await page.getByRole('button', { name: 'Add product to cart' }).evaluate(
      (element) => element === document.activeElement,
    ),
    true,
  );
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');
  assert.equal(
    await page.getByRole('button', { name: 'Open checkout' }).evaluate(
      (element) => element === document.activeElement,
    ),
    true,
  );
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).pathname, '/checkout');

  await page.keyboard.press('Tab');
  await page.keyboard.type('Ada Lovelace');
  await page.keyboard.press('Tab');
  await page.keyboard.type('12 Analytical Engine Way');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Berlin');
  await page.keyboard.press('Tab');
  await page.keyboard.type('10115');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.type('ada@example.test');
  await page.keyboard.press('Tab');

  const emailInput = page.getByTestId('checkout-email');
  const continueButton = page.getByRole('button', {
    name: 'Continue to confirmation',
  });

  const emailAssociation = await emailInput.evaluate((element) => {
    const input = element as HTMLInputElement;
    return {
      labelsCount: input.labels?.length ?? 0,
      ariaLabel: input.getAttribute('aria-label'),
      ariaLabelledby: input.getAttribute('aria-labelledby'),
    };
  });

  const focusMetadata = await continueButton.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    const outlineVisible =
      styles.outlineStyle !== 'none' && Number.parseFloat(styles.outlineWidth) > 0;
    const boxShadowVisible = styles.boxShadow !== 'none';
    return {
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
      boxShadow: styles.boxShadow,
      visibleIndicatorDetected: outlineVisible || boxShadowVisible,
    };
  });

  assert.deepEqual(emailAssociation, {
    labelsCount: 0,
    ariaLabel: null,
    ariaLabelledby: null,
  });
  assert.equal(focusMetadata.visibleIndicatorDetected, false);

  const axeResults = await new AxeBuilder({ page }).include('main').analyze();
  assert.equal(axeResults.violations.length, 1);
  const labelViolation = axeResults.violations[0];
  assert.equal(labelViolation?.id, 'label');
  assert.equal(labelViolation?.nodes.length, 1);
  assert.deepEqual(labelViolation?.nodes[0]?.target, ['#email']);

  const emailSourceContext = await readBoundedSourceContext(repositoryRoot, {
    file: 'apps/demo-checkout/src/App.tsx',
    startMarker: '{/* Controlled Phase 1 fixture: visible text',
    endMarker: '</div>',
    selectionBasis: 'Allowlisted excerpt containing only the controlled email field.',
  });
  const focusSourceContext = await readBoundedSourceContext(repositoryRoot, {
    file: 'apps/demo-checkout/src/styles.css',
    startMarker: '/* Controlled Phase 1 fixture: remove every relevant outline',
    endMarker: '}',
    selectionBasis:
      'Allowlisted excerpt containing only the controlled focus-style rule.',
  });

  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).pathname, '/confirmation');
  assert.equal(
    await page
      .getByRole('heading', { name: 'Order ready for review', level: 1 })
      .isVisible(),
    true,
  );

  const evidence: JourneyEvidence = {
    schemaVersion: EVIDENCE_SCHEMA_VERSION,
    capturedAtUtc: new Date().toISOString(),
    journey: {
      journeyId: JOURNEY_ID,
      name: 'Controlled demo checkout keyboard journey',
      steps: [
        'Open the product screen.',
        'Focus and activate Add product to cart with the keyboard.',
        'Focus and activate Open checkout with the keyboard.',
        'Enter shipping and contact sample data with the keyboard.',
        'Inspect the focused primary action and checkout accessibility state.',
        'Activate Continue to confirmation with the keyboard.',
      ],
      confirmationReached: true,
    },
    sourceContextPolicy: {
      allowedFiles: [...ALLOWED_TARGET_FILES],
      maximumCharactersPerFinding: 1200,
      completeFilesIncluded: false,
    },
    axeSummary: {
      violationCount: 1,
      ruleIds: ['label'],
      targets: ['#email'],
    },
    findings: [
      {
        schemaVersion: EVIDENCE_SCHEMA_VERSION,
        findingId: 'CONTROLLED_BARRIER_EMAIL_NAME',
        journeyId: JOURNEY_ID,
        stepId: 'checkout-contact-email',
        routeOrState: '/checkout with the shipping and contact form visible',
        affectedSelector: '#email',
        userFacingImpact:
          'A screen-reader user may encounter the required email field without its visible purpose being announced.',
        observedCondition:
          'The input has zero associated labels and no aria-label or aria-labelledby value; axe reports the label rule for #email.',
        expectedCondition:
          'The visible Email address text is programmatically associated with the email input and supplies its accessible name.',
        safeFixClass: 'associate_explicit_label',
        sourceFileHint: 'apps/demo-checkout/src/App.tsx',
        sourceContext: emailSourceContext,
        axeMetadata: {
          ruleId: 'label',
          impact: labelViolation?.impact ?? 'critical',
          target: '#email',
          help: labelViolation?.help ?? 'Form elements must have labels',
        },
        focusMetadata: null,
        confidenceBasis: [
          'DOM inspection found no programmatic label association.',
          'The checkout axe scan returned only the label violation targeting #email.',
        ],
        requiredAutomatedVerification: [
          'Verify the email input has the accessible name Email address.',
          'Verify the checkout axe scan no longer reports the label rule for #email.',
        ],
        requiredHumanReview: [
          'Confirm the visible label remains clear and adjacent to the email field.',
          'Review the field announcement with a screen reader; automated evidence is not a substitute for disabled-user testing.',
        ],
      },
      {
        schemaVersion: EVIDENCE_SCHEMA_VERSION,
        findingId: 'CONTROLLED_BARRIER_FOCUS_VISIBLE',
        journeyId: JOURNEY_ID,
        stepId: 'checkout-continue-focus',
        routeOrState: '/checkout with Continue to confirmation keyboard-focused',
        affectedSelector: '.controlled-focus-defect',
        userFacingImpact:
          'A keyboard user may be unable to visually locate the primary action before continuing.',
        observedCondition: `The focused control computed outlineStyle=${focusMetadata.outlineStyle}, outlineWidth=${focusMetadata.outlineWidth}, and boxShadow=${focusMetadata.boxShadow}; no visible outline or box-shadow indicator was detected.`,
        expectedCondition:
          'The keyboard-focused primary action has a clearly visible focus indicator without changing unrelated controls.',
        safeFixClass: 'restore_focus_visible',
        sourceFileHint: 'apps/demo-checkout/src/styles.css',
        sourceContext: focusSourceContext,
        axeMetadata: null,
        focusMetadata,
        confidenceBasis: [
          'The keyboard journey confirmed the primary action held focus.',
          'Computed styles showed no visible outline or box-shadow focus indicator.',
        ],
        requiredAutomatedVerification: [
          'Verify keyboard focus on Continue to confirmation has a visible outline or box-shadow.',
          'Rerun the predefined checkout keyboard journey through confirmation.',
        ],
        requiredHumanReview: [
          'Confirm the focus indicator is visually clear against the primary button in relevant states.',
          'Review keyboard usability with qualified human judgment; automation alone is incomplete.',
        ],
      },
    ],
  };

  return JourneyEvidenceSchema.parse(evidence);
}

export async function writeJourneyEvidence(
  evidence: JourneyEvidence,
  outputPath: string,
): Promise<void> {
  const validatedEvidence = JourneyEvidenceSchema.parse(evidence);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(validatedEvidence, null, 2)}\n`, 'utf8');
}
