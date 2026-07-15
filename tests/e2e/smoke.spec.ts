import { expect, test } from '@playwright/test';

test('demo-checkout renders and opens checkout', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Insulated sample mug', level: 1 }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Add product to cart' }).click();
  await page.getByRole('button', { name: 'Open checkout' }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(
    page.getByRole('heading', { name: 'Shipping and contact', level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole('form')).toBeVisible();
});
