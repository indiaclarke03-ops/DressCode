import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const ROUTES = [
  { name: 'landing', path: './' },
  { name: 'step-project', path: './#/fresh/project' },
  { name: 'step-this-or-that', path: './#/fresh/this-or-that' },
  { name: 'step-colour', path: './#/fresh/colour' },
  { name: 'step-typography', path: './#/fresh/typography' },
  { name: 'step-details', path: './#/fresh/details' },
  { name: 'step-avoid', path: './#/fresh/avoid' },
  { name: 'restyle-step', path: './#/restyle/current' },
  { name: 'tweaks', path: './#/tweaks' },
  { name: 'kit', path: './#/kit' },
];

async function open(page: Page, path: string, theme: 'light' | 'dark') {
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(path);
  await expect(page.locator('main h1').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  // Let the 200ms step fade finish, so contrast is measured at full opacity.
  await page.waitForTimeout(300);
}

for (const width of [1440, 390]) {
  for (const theme of ['light', 'dark'] as const) {
    for (const route of ROUTES) {
      test(`${route.name} @${width} ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: width > 500 ? 900 : 844 });
        await open(page, route.path, theme);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);

        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);

        await page.screenshot({
          path: `e2e/screenshots/${route.name}-${width}-${theme}.png`,
          fullPage: true,
        });
      });
    }
  }
}

test('the theme toggle overrides the system and survives a reload', async ({ page }) => {
  await open(page, './', 'light');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('a mode card opens the first step, and deep links survive refresh', async ({ page }) => {
  await open(page, './', 'light');
  await page.getByRole('link', { name: /Restyle existing/ }).click();
  await expect(page).toHaveURL(/#\/restyle\/current$/);
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/#\/restyle\/keep$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What should stay the same?' })).toBeVisible();
});

test('choice cards are a keyboard radio group', async ({ page }) => {
  await open(page, './#/kit', 'light');
  await page.getByRole('radio', { name: /Airy/ }).focus();
  await page.keyboard.down('ArrowRight');
  await expect(page.getByRole('radio', { name: /Compact/ })).toBeFocused();
  await page.keyboard.up('ArrowRight');
  await expect(page.getByRole('radio', { name: /Compact/ })).toBeChecked();
});
