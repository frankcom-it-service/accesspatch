import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('controlled keyboard journey reports both Phase 1 barriers', async ({
  page,
}, testInfo) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Add product to cart' })).toBeFocused();
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Open checkout' })).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(
    page.getByRole('heading', { name: 'Shipping and contact', level: 1 }),
  ).toBeFocused();

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

  await expect(continueButton).toBeFocused();

  await expect
    .soft(
      emailInput,
      'CONTROLLED_BARRIER_EMAIL_NAME: visible email text must provide the input accessible name',
    )
    .toHaveAccessibleName('Email address');

  const focusIndicator = await continueButton.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    const outlineVisible =
      styles.outlineStyle !== 'none' && Number.parseFloat(styles.outlineWidth) > 0;
    const boxShadowVisible = styles.boxShadow !== 'none';

    return {
      visible: outlineVisible || boxShadowVisible,
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
      boxShadow: styles.boxShadow,
    };
  });

  await expect
    .soft(
      focusIndicator.visible,
      `CONTROLLED_BARRIER_FOCUS_VISIBLE: expected outline or box-shadow, received ${JSON.stringify(focusIndicator)}`,
    )
    .toBe(true);

  const axeResults = await new AxeBuilder({ page }).include('main').analyze();
  const structuredFindings = axeResults.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary,
    })),
  }));

  await testInfo.attach('axe-checkout-findings', {
    body: JSON.stringify(structuredFindings, null, 2),
    contentType: 'application/json',
  });

  console.log(`AXE_CHECKOUT_FINDINGS=${JSON.stringify(structuredFindings)}`);
  expect(structuredFindings.map((finding) => finding.id)).toEqual(['label']);
  expect(structuredFindings[0]?.nodes).toHaveLength(1);

  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Order ready for review', level: 1 }),
  ).toBeVisible();
  console.log('KEYBOARD_JOURNEY_CONFIRMATION=REACHED');
});
