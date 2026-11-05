import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });

const TAILWIND = `module.exports = { theme: { extend: {
  colors: { primary: '#7C3AED', slate: { 50: '#F8FAFC', 200: '#E2E8F0', 500: '#64748B', 900: '#0F172A' } },
  fontFamily: { sans: ['Poppins', 'sans-serif'] },
  borderRadius: { xl: '20px' },
  boxShadow: { card: '0 4px 24px rgba(15, 23, 42, 0.08)' },
} } };`;

const PAGE = '[data-testid="preview-page"]';
const cssVar = (page: import('@playwright/test').Page, name: string) =>
  page.locator(PAGE).evaluate((el, key) => (el as HTMLElement).style.getPropertyValue(key), name);

async function pasteStyles(page: import('@playwright/test').Page) {
  await page.goto('./#/restyle/current');
  await page.getByLabel(/Paste your current styles/).fill(TAILWIND);
  await expect(page.getByText('What we found')).toBeVisible();
  await page.waitForTimeout(350);
}

test('pasting a real Tailwind config shows what was found', async ({ page }) => {
  await pasteStyles(page);
  await expect(page.getByText('Your current palette')).toBeVisible();
  await expect(page.getByText('Poppins', { exact: true })).toBeVisible();
  await expect(page.getByText('20px', { exact: true })).toBeVisible();
  await expect(page.getByText(/stays in your browser and is never uploaded/)).toBeVisible();
});

test('a screenshot gives its colours, and text files are refused', async ({ page }) => {
  await page.goto('./#/restyle/current');
  const canvasPng = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const context = canvas.getContext('2d');
    if (!context) return '';
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, 40, 40);
    context.fillStyle = '#7C3AED';
    context.fillRect(0, 0, 40, 12);
    return canvas.toDataURL('image/png').split(',')[1] ?? '';
  });
  const input = page.locator('input[type=file]');
  await input.setInputFiles({ name: 'app.png', mimeType: 'image/png', buffer: Buffer.from(canvasPng, 'base64') });
  await expect(page.getByText(/Read \d colours from app.png/)).toBeVisible();
  await expect(page.getByText('Your current palette')).toBeVisible();
  await input.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
  await expect(page.getByText('That file is not an image')).toBeVisible();
});

test('functionality is always kept, and a brand colour can be chosen', async ({ page }) => {
  await pasteStyles(page);
  await page.getByRole('link', { name: 'Continue' }).click();
  const functionality = page.getByRole('checkbox', { name: /Functionality and behaviour/ });
  await expect(functionality).toBeChecked();
  await expect(functionality).toBeDisabled();
  await expect(page.getByText('We never change what your app does', { exact: true })).toBeVisible();

  await page.getByRole('checkbox', { name: /Brand\/logo colour/ }).check();
  await page.getByRole('button', { name: 'Brand colour #7C3AED' }).click();
  await expect(page.getByRole('button', { name: 'Brand colour #7C3AED' })).toHaveAttribute('aria-pressed', 'true');
});

test('the gradual scope asks where to start', async ({ page }) => {
  await page.goto('./#/restyle/size');
  await expect(page.getByLabel('Which page or component first?')).toHaveCount(0);
  await page.getByRole('radio', { name: /Gradual/ }).click();
  await page.getByLabel('Which page or component first?').fill('The Settings page');
  await expect(page.getByLabel('Which page or component first?')).toHaveValue('The Settings page');
});

test('current and new compare throughout, and the preview toggles', async ({ page }) => {
  await pasteStyles(page);
  await page.goto(page.url().replace('current', 'colour'));
  await expect(page.getByText('Current', { exact: true }).first()).toBeVisible();
  await expect.poll(() => cssVar(page, '--bb-color-accent')).toBe('#1F5C45');

  await page.getByRole('button', { name: 'Current', exact: true }).click();
  await expect.poll(() => cssVar(page, '--bb-color-accent')).toBe('#7C3AED');
  await expect.poll(() => cssVar(page, '--bb-radius-card')).toBe('20px');
  await page.getByRole('button', { name: 'New', exact: true }).click();
  await expect.poll(() => cssVar(page, '--bb-color-accent')).toBe('#1F5C45');

  await page.goto(page.url().replace('colour', 'typography'));
  await expect(page.getByText('Poppins')).toBeVisible();
});

test('Review writes RESTYLE.md with an editable old to new map', async ({ page }) => {
  await pasteStyles(page);
  await page.goto(page.url().replace('current', 'review'));
  await page.getByRole('tab', { name: 'RESTYLE.md' }).click();
  const code = page.getByRole('tabpanel').locator('pre');
  await expect(code).toContainText('#7C3AED → accent');
  await expect(code).toContainText('#F8FAFC → background');
  await expect(code).toContainText('#0F172A → text');
  await expect(code).toContainText('change how this project LOOKS, not what it DOES');

  await page.getByLabel('New role for #7C3AED').selectOption('danger');
  await expect(code).toContainText('#7C3AED → danger');
  await expect(page.getByRole('tab', { name: 'KICKOFF prompt' })).toHaveCount(0);
});

test('the Restyle flow runs end to end with no style pasted', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await page.getByRole('link', { name: /Restyle existing/ }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.waitForURL(/this-or-that/);
  await page.goto(page.url().replace('this-or-that', 'review'));
  await page.getByRole('tab', { name: 'RESTYLE.md' }).click();
  await expect(page.getByRole('tabpanel').locator('pre')).toContainText('Match each old colour');
  expect(errors).toEqual([]);
});

test('a share link keeps the pasted results', async ({ page, browser }) => {
  await pasteStyles(page);
  const link = page.url();
  const stranger = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await stranger.goto(link);
  await expect(stranger.getByText('What we found')).toBeVisible();
  await stranger.close();
});
