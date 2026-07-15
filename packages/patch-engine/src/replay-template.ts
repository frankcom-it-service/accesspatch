export function createReplaySpec(): string {
  return `import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('repaired checkout keyboard journey passes', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Insulated sample mug', level: 1 }),
  ).toBeVisible();

  await page.keyboard.press('Tab');
  const addButton = page.getByRole('button', { name: 'Add product to cart' });
  await expect(addButton).toBeFocused();
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');
  const checkoutButton = page.getByRole('button', { name: 'Open checkout' });
  await expect(checkoutButton).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\\/checkout$/);
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

  const emailInput = page.getByTestId('checkout-email');
  await expect(emailInput).toBeFocused();
  await expect(emailInput).toHaveAccessibleName('Email address');
  await page.keyboard.type('ada@example.test');
  await page.keyboard.press('Tab');

  const continueButton = page.getByRole('button', {
    name: 'Continue to confirmation',
  });
  await expect(continueButton).toBeFocused();
  const focusValues = await continueButton.evaluate((element) => {
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
  expect(focusValues.visibleIndicatorDetected).toBe(true);

  const axeResults = await new AxeBuilder({ page }).include('main').analyze();
  const ruleIds = axeResults.violations.map((violation) => violation.id);
  expect(ruleIds).toEqual([]);
  expect(
    axeResults.violations.some((violation) =>
      violation.id === 'label' &&
      violation.nodes.some((node) => node.target.includes('#email')),
    ),
  ).toBe(false);

  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Order ready for review', level: 1 }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\\/confirmation$/);

  console.log(\`PHASE1C_REPLAY_RESULT=\${JSON.stringify({
    focusValues,
    axeViolationCount: axeResults.violations.length,
    axeRuleIds: ruleIds,
    confirmationReached: true,
  })}\`);
});
`;
}
