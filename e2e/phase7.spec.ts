import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });

const clipboard = (page: Page) => page.evaluate(() => navigator.clipboard.readText());
const card = (page: Page, title: string) =>
  page.locator('article').filter({ has: page.getByRole('heading', { name: title, exact: true }) });

test('categories switch the cards', async ({ page }) => {
  await page.goto('./#/tweaks');
  await expect(page.getByRole('heading', { name: 'Change accent colour' })).toBeVisible();
  await page.getByRole('button', { name: 'Maps' }).click();
  await expect(page.getByRole('heading', { name: 'Change map type' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Change accent colour' })).toHaveCount(0);
});

test('search finds a tweak across categories', async ({ page }) => {
  await page.goto('./#/tweaks');
  await page.getByRole('searchbox', { name: 'Search tweaks' }).fill('skeleton');
  await expect(page.getByRole('heading', { name: 'Add a loading skeleton' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search tweaks' }).fill('zzzz');
  await expect(page.getByText('Nothing matches that')).toBeVisible();
});

test('the prompt updates live, and inline fields fill the copied prompt', async ({ page }) => {
  await page.goto('./#/tweaks');
  await page.getByRole('button', { name: 'Maps' }).click();
  const map = card(page, 'Change map type');
  await map.getByLabel('To', { exact: true }).selectOption('heatmap');
  await expect(page.getByTestId('prompt-change-map-type')).toContainText('to a heatmap');

  await map.getByLabel('Page name').fill('Explorer');
  await map.getByLabel('Metric').fill('rainfall');
  await map.getByRole('button', { name: 'Copy' }).click();
  const prompt = await clipboard(page);
  expect(prompt).toContain('Change the map on the Explorer page');
  expect(prompt).toContain('density of rainfall');
  expect(prompt).not.toContain('<');
});

test('the global toggles change every prompt', async ({ page }) => {
  await page.goto('./#/tweaks');
  const prompt = page.getByTestId('prompt-fix-contrast');
  await expect(prompt).toContainText('When done, screenshot');
  await expect(prompt).not.toContainText('Follow DESIGN.md');
  await page.getByRole('checkbox', { name: 'I have a DESIGN.md' }).check();
  await page.getByRole('checkbox', { name: 'Ask Claude to screenshot and check' }).uncheck();
  await expect(prompt).toContainText('Follow DESIGN.md');
  await expect(prompt).not.toContainText('When done, screenshot');
});

test('the basket combines tweaks into one numbered prompt', async ({ page }) => {
  await page.goto('./#/tweaks');
  await card(page, 'Fix low contrast').getByRole('button', { name: 'Add to basket' }).click();
  await page.getByRole('button', { name: 'Maps' }).click();
  await card(page, 'Add legend').getByLabel('Page name').fill('Explorer');
  await card(page, 'Add legend').getByRole('button', { name: 'Add to basket' }).click();
  await expect(page.getByRole('heading', { name: 'Basket (2)' })).toBeVisible();

  await page.getByRole('button', { name: 'Copy all' }).click();
  const prompt = await clipboard(page);
  expect(prompt).toContain('Make these 2 changes:');
  expect(prompt).toContain('1. Find every text');
  expect(prompt).toContain('2. Add a legend to the map on the Explorer page');

  await page.getByRole('button', { name: 'Remove Fix low contrast' }).click();
  await expect(page.getByRole('heading', { name: 'Basket (1)' })).toBeVisible();
});

test('a tweak can be found and copied in a few steps', async ({ page }) => {
  await page.goto('./');
  const started = Date.now();
  await page.getByRole('link', { name: /Quick tweaks/ }).click();
  await page.getByRole('searchbox', { name: 'Search tweaks' }).fill('dark');
  await card(page, 'Add dark mode').getByRole('button', { name: 'Copy' }).click();
  expect(await clipboard(page)).toContain('Add dark mode');
  expect(Date.now() - started).toBeLessThan(5000);
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the basket works from a bottom bar', async ({ page }) => {
    await page.goto('./#/tweaks');
    await card(page, 'Fix low contrast').getByRole('button', { name: 'Add to basket' }).click();
    await page.getByRole('button', { name: 'Basket (1)' }).click();
    await expect(page.getByRole('dialog').getByText('Fix low contrast')).toBeVisible();
    await page.getByRole('button', { name: 'Close basket' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
