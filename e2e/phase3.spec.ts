import { expect, test, type Page } from '@playwright/test';

const SETTLE_MS = 400;

async function configFromUrl(page: Page) {
  await page.waitForTimeout(SETTLE_MS);
  const encoded = new URL(page.url().replace('#', '')).searchParams.get('c') ?? '';
  const json = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(json, (c) => c.charCodeAt(0))));
}

const round = (page: Page, n: number) => expect(page.getByText(`Round ${n} of 8`)).toBeVisible();

const nextRound = (page: Page) => page.getByRole('button', { name: 'Next round' }).click();

test('a full Start fresh run-through reaches Review with every choice saved', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('./');
  await page.getByRole('link', { name: /Start fresh/ }).click();

  await page.getByRole('radio', { name: /Data dashboard/ }).click();
  await page.getByRole('link', { name: 'Continue' }).click();

  await round(page, 1);
  await page.getByRole('radio', { name: 'Dark' }).click();
  await nextRound(page);
  await round(page, 2);
  await page.getByRole('radio', { name: 'Airy' }).click();
  await nextRound(page);
  await round(page, 3);
  await page.getByRole('radio', { name: 'Soft' }).click();
  await nextRound(page);
  await round(page, 4);
  await page.getByRole('radio', { name: 'Layered' }).click();
  await nextRound(page);
  await round(page, 5);
  await page.getByRole('radio', { name: 'Multi-colour' }).click();
  await nextRound(page);
  await round(page, 6);
  await page.getByRole('radio', { name: 'Serif', exact: true }).click();
  await nextRound(page);
  await round(page, 7);
  await page.getByRole('radio', { name: 'Expressive' }).click();
  await nextRound(page);
  await round(page, 8);
  await page.getByRole('radio', { name: 'Editorial' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/#\/fresh\/colour/);
  await page.getByRole('radio', { name: 'Teal' }).click();
  await page.getByRole('radio', { name: 'Cool' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/#\/fresh\/typography/);
  await page.getByRole('radio', { name: 'Fraunces + Inter' }).click();
  await page.getByRole('radio', { name: /Dramatic/ }).click();
  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/#\/fresh\/details/);
  await page.getByRole('radio', { name: 'Top bar' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/#\/fresh\/avoid/);
  await page.getByRole('checkbox', { name: 'Emoji used as icons' }).uncheck();
  await page.getByLabel('Add your own').fill('Stock photos');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/#\/fresh\/review/);
  const config = await configFromUrl(page);
  expect(config).toMatchObject({
    projectType: 'dashboard',
    theme: 'dark',
    density: 'airy',
    radius: 'soft',
    depth: 'layered',
    colorStrategy: 'expressive',
    headingStyle: 'serif',
    motion: 'expressive',
    layout: 'editorial',
    accent: '#0F6E6E',
    neutral: 'cool',
    fontPairingId: 'fraunces',
    typeScale: 'dramatic',
    projectOptions: { nav: 'top-bar' },
  });
  expect(config.avoid).not.toContain('emoji-icons');
  expect(config.avoid).toContain('Stock photos');
  expect(errors).toEqual([]);
});

test('This or That works from the keyboard alone', async ({ page }) => {
  await page.goto('./#/fresh/this-or-that');
  await round(page, 1);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await round(page, 2);
  await page.keyboard.press('n');
  await page.keyboard.press('Enter');
  await round(page, 3);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await round(page, 4);
  const config = await configFromUrl(page);
  expect(config.theme).toBe('dark');
  expect(config.radius).toBe('sharp');
});

test('choosing never moves on by itself, and a choice can be changed', async ({ page }) => {
  await page.goto('./#/fresh/this-or-that');
  const next = page.getByRole('button', { name: 'Next round' });
  await expect(next).toBeDisabled();

  await page.getByRole('radio', { name: 'Light' }).click();
  await page.getByRole('radio', { name: 'Dark' }).click();
  await page.waitForTimeout(600);
  await round(page, 1);
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  await expect(page.getByRole('link', { name: 'Continue' })).toHaveCount(0);

  await next.click();
  await round(page, 2);
  await expect(next).toBeDisabled();
  await page.getByRole('button', { name: 'Previous round' }).click();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  expect((await configFromUrl(page)).theme).toBe('dark');
});

test('No preference waits for Next too, and can be replaced by a pick', async ({ page }) => {
  await page.goto('./#/fresh/this-or-that');
  const skip = page.getByRole('button', { name: 'No preference' });
  await skip.click();
  await round(page, 1);
  await expect(skip).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('radio', { name: 'Dark' }).click();
  await expect(skip).toHaveAttribute('aria-pressed', 'false');
});

test('keys typed in a text field are not treated as round choices', async ({ page }) => {
  await page.goto('./#/fresh/avoid');
  await page.getByLabel('Add your own').fill('nnnn');
  await expect(page.getByLabel('Add your own')).toHaveValue('nnnn');
});

test('the demo matches the project type', async ({ page }) => {
  await page.goto('./#/fresh/project');
  await page.getByRole('radio', { name: /Simulator/ }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText('Carbon price, per tonne').first()).toBeVisible();
});

test('questions change with the project type', async ({ page }) => {
  await page.goto('./#/fresh/project');
  await page.getByRole('radio', { name: /Map-based/ }).click();
  await page.goto('./#/fresh/project');
  await page.getByRole('radio', { name: /AI chat/ }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.locator('nav[aria-label="Progress"]').waitFor();
  await page.goto(`./#/fresh/details?c=${(await configParam(page))}`);
  await expect(page.getByText('How should messages look?')).toBeVisible();
});

async function configParam(page: Page) {
  await page.waitForTimeout(SETTLE_MS);
  return new URL(page.url().replace('#', '')).searchParams.get('c');
}

test('"Something else" asks what it is, and the text is kept', async ({ page }) => {
  await page.goto('./#/fresh/project');
  await page.getByRole('radio', { name: 'Something else' }).click();
  await page.getByRole('textbox').fill('Allotment planner');
  const config = await configFromUrl(page);
  expect(config.projectTypeOther).toBe('Allotment planner');
});

test('a custom hex is applied, and a bad one is explained', async ({ page }) => {
  await page.goto('./#/fresh/colour');
  const hex = page.getByLabel(/Or enter a colour code/);
  await hex.fill('#12');
  await expect(page.getByText('Use a format like #1F5C45.')).toBeVisible();
  await hex.fill('#7A2230');
  await expect(page.getByText('Use a format like #1F5C45.')).toHaveCount(0);
  expect((await configFromUrl(page)).accent).toBe('#7A2230');
});

test('Restyle reuses the shared steps', async ({ page }) => {
  await page.goto('./#/restyle/colour');
  await expect(page.getByRole('heading', { name: 'Choose your colour' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Teal' })).toBeVisible();
});
