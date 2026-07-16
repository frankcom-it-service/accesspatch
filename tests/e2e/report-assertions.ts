import { access } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export async function assertProofBundleReport(
  page: Page,
  bundleDirectory: string,
  resultLabel: string,
): Promise<void> {
  const resolvedBundle = resolve(bundleDirectory);
  await page.goto(pathToFileURL(resolve(resolvedBundle, 'report.html')).href);

  await expect(page).toHaveTitle('AccessPatch Controlled Journey Proof Bundle');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('nav')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('body')).toContainText('CONTROLLED_BARRIER_EMAIL_NAME');
  await expect(page.locator('body')).toContainText('CONTROLLED_BARRIER_FOCUS_VISIBLE');
  await expect(page.locator('[data-wcag-reference]')).toHaveCount(3);
  await expect(page.locator('[data-wcag-reference="1.3.1"]')).toHaveCount(1);
  await expect(page.locator('[data-wcag-reference="4.1.2"]')).toHaveCount(1);
  await expect(page.locator('[data-wcag-reference="2.4.7"]')).toHaveCount(1);
  await expect(page.locator('a[data-external="true"]')).toHaveCount(6);
  await expect(page.getByRole('heading', { name: 'Manual review and claim boundaries' })).toBeVisible();
  await expect(page.getByText('Understanding documents are explanatory and informative.')).toBeVisible();
  await expect(page.getByText(/not a compliance certification/i)).toBeVisible();

  const localLinks = await page.locator('a[href]').evaluateAll((anchors) =>
    anchors
      .map((anchor) => anchor.getAttribute('href'))
      .filter((href): href is string => Boolean(href))
      .filter((href) => !href.startsWith('#') && !href.startsWith('https://')),
  );
  for (const link of localLinks) {
    const target = resolve(resolvedBundle, link);
    const pathFromBundle = relative(resolvedBundle, target);
    expect(isAbsolute(link) || pathFromBundle.startsWith('..')).toBe(false);
    await access(target);
  }

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to proof content' });
  await expect(skipLink).toBeFocused();
  const focus = await skipLink.evaluate((element) => {
    const styles = getComputedStyle(element);
    return { outlineStyle: styles.outlineStyle, outlineWidth: styles.outlineWidth };
  });
  expect(focus.outlineStyle).not.toBe('none');
  expect(focus.outlineWidth).not.toBe('0px');

  const axeResults = await new AxeBuilder({ page }).analyze();
  const violations = axeResults.violations.map((violation) => violation.id);
  console.log(`${resultLabel}=${JSON.stringify(violations)}`);
  expect(violations).toEqual([]);
}
