import { expect, test } from '@playwright/test';

const accent = (page: import('@playwright/test').Page) => page.getByTestId('accent');
const configInUrl = (page: import('@playwright/test').Page) =>
  new URL(page.url().replace('#', '')).searchParams.get('c');

test('a choice reaches the URL and survives a refresh', async ({ page }) => {
  await page.goto('./#/kit');
  await page.getByRole('radio', { name: 'Dark' }).click();
  await page.getByRole('radio', { name: 'Oxblood' }).click();
  await expect.poll(() => configInUrl(page)).toBeTruthy();
  await expect.poll(() => page.url()).toMatch(/c=/);
  await page.waitForTimeout(400);

  await page.reload();
  await expect(accent(page)).toHaveText('#7A2230');
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
});

test('a share link opens in a fresh browser with the exact config', async ({ page, browser }) => {
  await page.goto('./#/kit');
  await page.getByRole('radio', { name: 'Cool' }).click();
  await page.getByRole('radio', { name: 'Teal' }).click();
  await page.waitForTimeout(400);
  const encoded = configInUrl(page);

  const stranger = await browser.newPage({ baseURL: 'http://localhost:4173/DressCode/' });
  await stranger.goto(`./#/kit?c=${encoded}`);
  await expect(accent(stranger)).toHaveText('#0F6E6E');
  await expect(stranger.getByRole('radio', { name: 'Cool' })).toBeChecked();
  await stranger.close();
});

test('#/review share links land on the review step of the saved mode', async ({ page }) => {
  await page.goto('./#/restyle/keep');
  await page.waitForTimeout(400);
  const encoded = configInUrl(page);
  await page.goto('about:blank');
  await page.goto(`./#/review?c=${encoded}`);
  await expect(page).toHaveURL(/#\/restyle\/review/);
  await expect(page.getByRole('heading', { name: 'Review and export' })).toBeVisible();
});

test('the config survives moving between steps', async ({ page }) => {
  await page.goto('./#/kit');
  await page.getByRole('radio', { name: 'Moss' }).click();
  await page.locator('header').getByRole('link', { name: 'Dress Code' }).click();
  await page.getByRole('link', { name: /Start fresh/ }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.waitForTimeout(400);
  await page.goto(`./#/kit?c=${configInUrl(page)}`);
  await expect(accent(page)).toHaveText('#5B6B2E');
});

test('a corrupt share link falls back to defaults instead of crashing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./#/kit?c=not-a-real-config');
  await expect(accent(page)).toHaveText('#1F5C45');
  expect(errors).toEqual([]);
});

test('Fix contrast clears every failing pair', async ({ page }) => {
  await page.goto('./#/kit');
  await page.getByRole('radio', { name: 'Dark' }).click();
  await page.getByRole('radio', { name: 'Ink blue' }).click();
  await page.getByRole('button', { name: /Fix contrast/ }).click();
  await expect(page.getByRole('button', { name: 'All pairs pass' })).toBeDisabled();
  await expect(page.getByText(/ fail$/)).toHaveCount(0);
});

test('the landing page URL stays clean', async ({ page }) => {
  await page.goto('./');
  await page.waitForTimeout(400);
  expect(page.url()).not.toContain('c=');
});
