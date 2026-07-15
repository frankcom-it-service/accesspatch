import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('canonical static report passes structural and automated axe smoke checks', async ({
  page,
}) => {
  const reportUrl = pathToFileURL(
    resolve('.accesspatch/runs/phase2/proof-bundle/report.html'),
  ).href;
  await page.goto(reportUrl);

  await expect(page).toHaveTitle('AccessPatch Controlled Journey Proof Bundle');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('nav')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('[data-wcag-reference]')).toHaveCount(3);
  await expect(page.locator('[data-wcag-reference="1.3.1"]')).toHaveCount(1);
  await expect(page.locator('[data-wcag-reference="4.1.2"]')).toHaveCount(1);
  await expect(page.locator('[data-wcag-reference="2.4.7"]')).toHaveCount(1);
  await expect(page.locator('a[data-external="true"]')).toHaveCount(6);
  await expect(page.getByText('Understanding documents are explanatory and informative.')).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to proof content' })).toBeFocused();

  const axeResults = await new AxeBuilder({ page }).analyze();
  const violations = axeResults.violations.map((violation) => violation.id);
  console.log(`PHASE2_REPORT_AXE_VIOLATIONS=${JSON.stringify(violations)}`);
  expect(violations).toEqual([]);
});
