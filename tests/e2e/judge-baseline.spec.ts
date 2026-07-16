import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import {
  CONTROLLED_FINDING_IDS,
  type JudgeBaselineObservation,
  validateJudgeBaselineObservation,
} from './judge-baseline-contract.ts';

test('judge proof confirms the exact controlled broken checkout baseline', async ({
  page,
}) => {
  await page.goto('/');
  const productHeading = page.getByRole('heading', {
    name: 'Insulated sample mug',
    level: 1,
  });
  await expect(productHeading).toBeVisible();
  const productPageReached = await productHeading.isVisible();

  await page.keyboard.press('Tab');
  const addButton = page.getByRole('button', { name: 'Add product to cart' });
  await expect(addButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Cart: 1 item')).toBeVisible();
  const productAddedToCart = await page.getByText('Cart: 1 item').isVisible();

  await page.keyboard.press('Tab');
  const checkoutButton = page.getByRole('button', { name: 'Open checkout' });
  await expect(checkoutButton).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/checkout$/);
  const checkoutOpened = new URL(page.url()).pathname === '/checkout';
  const checkoutHeading = page.getByRole('heading', {
    name: 'Shipping and contact',
    level: 1,
  });
  await expect(checkoutHeading).toBeFocused();
  await expect(page.getByRole('form', { name: 'Shipping and contact form' })).toBeVisible();
  const checkoutFormReached = await page
    .getByRole('form', { name: 'Shipping and contact form' })
    .isVisible();

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

  const emailInput = page.locator('#email');
  const continueButton = page.getByRole('button', {
    name: 'Continue to confirmation',
  });
  await expect(emailInput).toHaveAccessibleName('');
  await expect(continueButton).toBeFocused();
  const primaryActionFocused = await continueButton.evaluate(
    (element) => element === document.activeElement,
  );

  const emailAssociation = await emailInput.evaluate((element) => {
    const input = element as HTMLInputElement;
    return {
      labelsCount: input.labels?.length ?? 0,
      ariaLabel: input.getAttribute('aria-label'),
      ariaLabelledby: input.getAttribute('aria-labelledby'),
    };
  });
  const focus = await continueButton.evaluate((element) => {
    const styles = getComputedStyle(element);
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

  const axeResults = await new AxeBuilder({ page }).include('main').analyze();
  const axeViolations = axeResults.violations.map((violation) => ({
    id: violation.id,
    targets: violation.nodes.flatMap((node) => node.target.map(String)),
  }));

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/confirmation$/);
  await expect(
    page.getByRole('heading', { name: 'Order ready for review', level: 1 }),
  ).toBeVisible();
  const confirmationReached =
    new URL(page.url()).pathname === '/confirmation' &&
    (await page
      .getByRole('heading', { name: 'Order ready for review', level: 1 })
      .isVisible());

  const observation: JudgeBaselineObservation = {
    productPageReached,
    productAddedToCart,
    checkoutOpened,
    checkoutFormReached,
    emailAccessibleName: '',
    emailLabelsCount: emailAssociation.labelsCount,
    emailAriaLabel: emailAssociation.ariaLabel,
    emailAriaLabelledby: emailAssociation.ariaLabelledby,
    primaryActionFocused,
    focus,
    axeViolations,
    confirmationReached,
    findingIds: [...CONTROLLED_FINDING_IDS],
  };
  validateJudgeBaselineObservation(observation);

  console.log('JUDGE_BASELINE_PRODUCT=REACHED');
  console.log('JUDGE_BASELINE_CART=PRODUCT_ADDED');
  console.log('JUDGE_BASELINE_CHECKOUT=FORM_REACHED');
  console.log(`JUDGE_BASELINE_FINDINGS=${JSON.stringify(observation.findingIds)}`);
  console.log(`JUDGE_BASELINE_FOCUS=${JSON.stringify(focus)}`);
  console.log(`JUDGE_BASELINE_AXE_VIOLATIONS=${JSON.stringify(axeViolations)}`);
  console.log('JUDGE_BASELINE_CONFIRMATION=REACHED');
  console.log('JUDGE_BASELINE_VALID');
});
