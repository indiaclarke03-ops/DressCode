import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('every example opens and can be edited', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./#/examples');
  const names = ['Quiet Ledger', 'Broadsheet', 'Pop Riot', 'Terminal', 'Velvet Room', 'Playground', 'Blueprint', 'Swiss Poster', 'Sunday Supplement', 'Harbour', 'Arcade', 'Field Notes'];
  for (const name of names) {
    await page.goto('./#/examples');
    await page.getByRole('link', { name: new RegExp(name) }).click();
    await expect(page.getByLabel('Name your style')).toHaveValue(name);
    await expect(page.getByRole('tabpanel').locator('pre')).toContainText(`# Design Brief: ${name}`);
  }
});

test('open dialogs pass the accessibility scan', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/fresh/colour');
  await page.getByRole('button', { name: 'Show preview' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.waitForTimeout(400);
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
});

test('reduced motion is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/fresh/colour');
  await expect(page.locator('[data-testid="preview-page"] [data-reveal]').first()).toBeVisible();
  await page.getByRole('button', { name: 'Replay motion' }).click();
  const running = await page
    .locator('[data-testid="preview-page"]')
    .evaluate(
      (el) => el.getAnimations({ subtree: true }).filter((item) => !(item instanceof CSSTransition)).length,
    );
  expect(running).toBe(0);
});

test('nothing is left over from the build', async ({ page }) => {
  for (const path of ['./#/', './#/fresh/review', './#/restyle/current', './#/restyle/keep', './#/tweaks', './#/examples']) {
    await page.goto(path);
    await page.waitForTimeout(150);
    await expect(page.locator('body')).not.toContainText(/Coming in Phase/i);
  }
});

test('the old kit route now shows the not-found page', async ({ page }) => {
  await page.goto('./#/kit');
  await expect(page.getByRole('heading', { name: "This page isn't here" })).toBeVisible();
});

const WIDTHS = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];
const PAGES = [
  ['landing', './'],
  ['direction', './#/fresh/direction'],
  ['this-or-that', './#/fresh/this-or-that'],
  ['colour', './#/fresh/colour'],
  ['typography', './#/fresh/typography'],
  ['details', './#/fresh/details'],
  ['avoid', './#/fresh/avoid'],
  ['review', './#/fresh/review'],
  ['restyle', './#/restyle/current'],
  ['tweaks', './#/tweaks'],
  ['styles', './#/styles'],
  ['examples', './#/examples'],
] as const;

for (const size of WIDTHS) {
  for (const theme of ['light', 'dark'] as const) {
    for (const [name, path] of PAGES) {
      test(`${name} fits and passes at ${size.name} ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(path);
        await expect(page.locator('main h1').first()).toBeVisible();
        await page.waitForTimeout(350);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);

        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);

        await page.screenshot({ path: `e2e/screenshots/final-${name}-${size.name}-${theme}.png`, fullPage: true });
      });
    }
  }
}

test('Continue is never undone by the delayed URL save', async ({ page }) => {
  test.setTimeout(120_000);
  for (let delay = 215; delay <= 285; delay += 5) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await page.goto('./#/fresh/colour');
      await page.getByRole('radio', { name: 'Teal' }).waitFor();
      await page.getByRole('radio', { name: attempt % 2 ? 'Moss' : 'Oxblood' }).click();
      await page.waitForTimeout(delay);
      await page.getByRole('link', { name: 'Continue' }).click();
      await page.waitForTimeout(350);
      expect(page.url(), `after a ${delay}ms pause`).toContain('/fresh/typography');
    }
  }
});

const LOOKS = ['Quiet Ledger', 'Broadsheet', 'Pop Riot', 'Terminal', 'Velvet Room', 'Playground', 'Blueprint', 'Swiss Poster', 'Sunday Supplement', 'Harbour', 'Arcade', 'Field Notes'];

for (const name of LOOKS) {
  test(`the full ${name} scene reads well`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#/examples');
    await page.getByRole('link', { name: new RegExp(name) }).click();
    await expect(page.getByLabel('Name your style')).toHaveValue(name);
    const scene = page.locator('[data-testid="preview-page"]');
    await expect(scene.locator('h1, h2').first()).toBeVisible();
    await page.waitForTimeout(700);
    await scene.evaluate((el) => el.removeAttribute('inert'));
    const { violations } = await new AxeBuilder({ page })
      .include('[data-testid="preview-page"]')
      .withRules(['color-contrast'])
      .analyze();
    expect(violations.flatMap((v) => v.nodes.map((n) => `${n.target}: ${n.any[0]?.message ?? ''}`.slice(0, 170)))).toEqual([]);
    await scene.screenshot({ path: `e2e/screenshots/look-${name.toLowerCase().replaceAll(' ', '-')}.png` });
  });
}
