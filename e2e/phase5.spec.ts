import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.use({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });

const clipboard = (page: Page) => page.evaluate(() => navigator.clipboard.readText());

async function saveStyle(page: Page, name: string) {
  await page.goto('./#/fresh/review');
  await page.getByLabel('Name your style').fill(name);
  await page.getByRole('button', { name: 'Save this style' }).click();
  await expect(page.getByText('Saved in this browser.')).toBeVisible();
  await page.waitForTimeout(350);
}

test('every export tab shows real content and copies', async ({ page }) => {
  await page.goto('./#/fresh/review');
  for (const tab of ['SKILL.md', 'CLAUDE.md snippet', 'tokens.css', 'tailwind', 'KICKOFF prompt', 'DESIGN.md']) {
    await page.getByRole('tab', { name: tab }).click();
    await expect(page.getByRole('tabpanel').locator('pre')).toContainText(/\S/);
  }
  await page.getByRole('tabpanel').getByRole('button', { name: 'Copy' }).click();
  expect(await clipboard(page)).toContain('# Design Brief:');
});

test('a single file downloads', async ({ page }) => {
  await page.goto('./#/fresh/review');
  const download = page.waitForEvent('download');
  await page.getByRole('tabpanel').getByRole('button', { name: 'Download' }).click();
  expect((await download).suggestedFilename()).toBe('DESIGN.md');
});

test('Download all gives a zip named after the style', async ({ page }) => {
  await page.goto('./#/fresh/review');
  await page.getByLabel('Name your style').fill('Quiet Ledger');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download all (.zip)' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('quiet-ledger-dress-code.zip');
  const bytes = readFileSync(await file.path());
  expect(bytes.subarray(0, 2).toString()).toBe('PK');
  const text = bytes.toString('latin1');
  for (const path of ['DESIGN.md', '.claude/skills/quiet-ledger-design/SKILL.md', 'tokens.css', 'KICKOFF.md']) {
    expect(text).toContain(path);
  }
});

test('a share link restores the exact configuration elsewhere', async ({ page, browser }) => {
  await page.goto('./#/fresh/colour');
  await page.getByRole('radio', { name: 'Oxblood' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.goto(page.url().replace('typography', 'review'));
  await page.getByLabel('Name your style').fill('Oxblood Press');
  await page.getByRole('button', { name: 'Copy share link' }).click();
  const link = await clipboard(page);
  expect(link).toContain('#/review?c=');

  const stranger = await browser.newPage();
  await stranger.goto(link);
  await expect(stranger).toHaveURL(/#\/fresh\/review/);
  await expect(stranger.getByLabel('Name your style')).toHaveValue('Oxblood Press');
  await expect(stranger.getByRole('tabpanel').locator('pre')).toContainText('#7A2230');
  await stranger.close();
});

test('saving needs a name', async ({ page }) => {
  await page.goto('./#/fresh/review');
  await page.getByRole('button', { name: 'Save this style' }).click();
  await expect(page.getByText('Give your style a name')).toBeVisible();
  await expect(page.getByLabel('Name your style')).toBeFocused();
});

test('a saved style survives closing the browser tab', async ({ page, context }) => {
  await saveStyle(page, 'Acme brand');
  await page.close();
  const fresh = await context.newPage();
  await fresh.goto('./#/styles');
  await expect(fresh.getByRole('heading', { name: 'Acme brand' })).toBeVisible();
});

test('My styles gives a prompt for each medium', async ({ page }) => {
  await saveStyle(page, 'Acme brand');
  await page.getByRole('link', { name: 'My styles' }).first().click();

  await page.getByLabel('What are you making?').selectOption('slides');
  await page.getByRole('button', { name: 'Copy prompt' }).click();
  const slides = await clipboard(page);
  expect(slides).toContain('"Acme brand" brand style');
  expect(slides).toContain("We're making a slide deck.");

  await page.getByLabel('What are you making?').selectOption('other');
  await page.getByLabel('Describe it').fill('a trade show banner');
  await page.getByRole('button', { name: 'Copy prompt' }).click();
  expect(await clipboard(page)).toContain("We're making a trade show banner.");

  await page.getByRole('button', { name: 'Copy DESIGN.md' }).click();
  expect(await clipboard(page)).toContain('# Design Brief: Acme brand');
});

test('saving the same name asks first', async ({ page }) => {
  await saveStyle(page, 'Acme brand');
  await page.reload();
  await page.getByRole('button', { name: 'Save this style' }).click();
  await page.getByRole('button', { name: 'Keep both' }).click();
  await page.getByRole('link', { name: 'My styles' }).first().click();
  await expect(page.getByRole('heading', { name: 'Acme brand 2' })).toBeVisible();
});

test('Open and edit returns to the review step with the style loaded', async ({ page }) => {
  await saveStyle(page, 'Acme brand');
  await page.goto('./#/styles');
  await page.getByRole('link', { name: 'Open and edit' }).click();
  await expect(page).toHaveURL(/#\/fresh\/review/);
  await expect(page.getByLabel('Name your style')).toHaveValue('Acme brand');
});

test('deleting asks first', async ({ page }) => {
  await saveStyle(page, 'Acme brand');
  await page.goto('./#/styles');
  await page.getByRole('button', { name: 'Delete Acme brand' }).click();
  await page.getByRole('button', { name: 'Keep it' }).click();
  await expect(page.getByRole('heading', { name: 'Acme brand' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete Acme brand' }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByText('No saved styles yet')).toBeVisible();
});

test('a style moves to another browser by file', async ({ page, browser }) => {
  await saveStyle(page, 'Acme brand');
  await page.goto('./#/styles');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export all' }).click();
  const path = await (await download).path();

  const other = await (await browser.newContext({ baseURL: 'http://localhost:4173/DressCode/' })).newPage();
  await other.goto('./#/styles');
  await expect(other.getByText('No saved styles yet')).toBeVisible();
  await other.getByLabel('Import a styles file').setInputFiles({
    name: 'styles.json',
    mimeType: 'application/json',
    buffer: readFileSync(path),
  });
  await expect(other.getByRole('heading', { name: 'Acme brand' })).toBeVisible();
  await expect(other.getByRole('status')).toHaveText('Added 1 style.');
});

test('a file that is not ours is refused politely', async ({ page }) => {
  await page.goto('./#/styles');
  await page.getByLabel('Import a styles file').setInputFiles({
    name: 'notes.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"hello":"world"}'),
  });
  await expect(page.getByRole('status')).toContainText("doesn't look like a Dress Code export");
});

test('blocked storage explains itself', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('full', 'QuotaExceededError');
    };
  });
  await page.goto('./#/fresh/review');
  await page.getByLabel('Name your style').fill('Acme brand');
  await page.getByRole('button', { name: 'Save this style' }).click();
  await expect(page.getByText(/wouldn't let us save/)).toBeVisible();
});

test('a style saved in another tab is not overwritten', async ({ page, context }) => {
  await page.goto('./#/fresh/review');
  await page.getByLabel('Name your style').fill('Tab one');
  const second = await context.newPage();
  await saveStyle(second, 'Tab two');
  await page.getByRole('button', { name: 'Save this style' }).click();
  await page.goto('./#/styles');
  await expect(page.getByRole('heading', { name: 'Tab one' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tab two' })).toBeVisible();
});
