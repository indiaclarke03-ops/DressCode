import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const PAGE = '[data-testid="preview-page"]';
const cssVar = (page: Page, name: string) =>
  page.locator(PAGE).evaluate((el, key) => (el as HTMLElement).style.getPropertyValue(key), name);

async function openScene(page: Page, project: RegExp) {
  await page.goto('./#/fresh/project');
  await page.getByRole('radio', { name: project }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByText('Round 1 of 8').waitFor();
}

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the preview appears from step 2, not step 1', async ({ page }) => {
    await page.goto('./#/fresh/project');
    await expect(page.locator(PAGE)).toHaveCount(0);
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page.locator(PAGE)).toBeVisible();
  });

  test('a colour change updates variables in place, without a re-mount', async ({ page }) => {
    await page.goto('./#/fresh/colour');
    await expect(page.locator(PAGE)).toBeVisible();
    await page.locator(PAGE).evaluate((el) => el.setAttribute('data-same-node', 'yes'));

    const started = await page.evaluate(() => performance.now());
    await page.getByRole('radio', { name: 'Oxblood' }).click();
    await expect.poll(() => cssVar(page, '--bb-color-accent')).toBe('#7A2230');
    expect(await page.evaluate(() => performance.now()) - started).toBeLessThan(500);
    await expect(page.locator(`${PAGE}[data-same-node="yes"]`)).toHaveCount(1);
  });

  test('moving between steps keeps the same preview', async ({ page }) => {
    await page.goto('./#/fresh/colour');
    await expect(page.locator(PAGE)).toBeVisible();
    await page.locator(PAGE).evaluate((el) => el.setAttribute('data-same-node', 'yes'));
    await page.getByRole('link', { name: 'Continue' }).click();
    await page.waitForURL(/typography/);
    await expect(page.locator(`${PAGE}[data-same-node="yes"]`)).toHaveCount(1);
  });

  test('all eight rounds change the preview', async ({ page }) => {
    await page.goto('./#/fresh/this-or-that');
    await expect(page.locator(PAGE)).toBeVisible();
    const snapshot = () =>
      page.locator(PAGE).evaluate((el) => `${el.getAttribute('data-layout')}|${el.getAttribute('style')}`);

    for (let round = 1; round <= 8; round += 1) {
      await page.getByText(`Round ${round} of 8`).waitFor();
      const radios = page.getByRole('radio');
      await radios.nth(0).click();
      const first = await snapshot();
      await radios.nth(1).click();
      await expect.poll(snapshot).not.toBe(first);
      if (round < 8) await page.getByRole('button', { name: 'Next round' }).click();
    }
  });

  test('the desktop and mobile toggle resizes the frame', async ({ page }) => {
    await page.goto('./#/fresh/colour');
    const width = () => page.locator(PAGE).evaluate((el) => (el as HTMLElement).offsetWidth);
    await expect.poll(width).toBe(1200);
    await page.getByRole('button', { name: 'Mobile view' }).click();
    await expect.poll(width).toBe(390);
  });

  test('Replay motion animates the scene', async ({ page }) => {
    await page.goto('./#/fresh/colour');
    await expect(page.locator(`${PAGE} [data-reveal]`).first()).toBeVisible();
    await page.getByRole('button', { name: 'Replay motion' }).click();
    const running = await page
      .locator(PAGE)
      .evaluate((el) => el.getAnimations({ subtree: true }).length);
    expect(running).toBeGreaterThan(0);
  });

  test('Review shows the preview at full width', async ({ page }) => {
    await page.goto('./#/fresh/review');
    await expect(page.locator(PAGE)).toBeVisible();
    const box = await page.locator('[aria-label^="Live preview"]').boundingBox();
    expect(box?.width).toBeGreaterThan(1000);
  });
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the preview opens as a bottom sheet in mobile view and closes with Escape', async ({ page }) => {
    await page.goto('./#/fresh/colour');
    await expect(page.locator(PAGE)).toHaveCount(0);
    await page.getByRole('button', { name: 'Show preview' }).click();
    const width = () => page.locator(PAGE).evaluate((el) => (el as HTMLElement).offsetWidth);
    await expect.poll(width).toBe(390);
    await page.keyboard.press('Escape');
    await expect(page.locator(PAGE)).toHaveCount(0);
  });
});

const SCENES: [string, RegExp][] = [
  ['dashboard', /Data dashboard/],
  ['simulator', /Simulator/],
  ['map', /Map-based/],
  ['app', /Web app/],
  ['chat', /AI chat/],
  ['marketing', /Marketing/],
  ['editorial', /Blog/],
  ['docs', /Docs/],
  ['calculator', /Calculator/],
  ['form', /Form/],
  ['event', /Event/],
  ['ecommerce', /E-commerce/],
  ['game', /Game/],
  ['explainer', /Educational/],
];

for (const theme of ['light', 'dark'] as const) {
  for (const [name, project] of SCENES) {
    test(`scene ${name} renders and reads well in ${theme}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width: 1440, height: 900 });
      await openScene(page, project);
      await page.getByRole('radio', { name: theme === 'dark' ? 'Dark' : 'Light' }).click();
      if (theme === 'dark') {
        await page.waitForTimeout(400);
        await page.goto(page.url().replace('this-or-that', 'colour'));
        await page.getByRole('button', { name: /Fix contrast/ }).click();
      }
      await page.waitForTimeout(500);
      await page.goto(page.url().replace(/this-or-that|colour/, 'review'));
      await expect(page.locator(`${PAGE} h1, ${PAGE} h2`).first()).toBeVisible();
      await page.waitForTimeout(500);

      // axe skips inert content, so lift it for the scan or nothing gets checked.
      await page.locator(PAGE).evaluate((el) => el.removeAttribute('inert'));
      const { violations } = await new AxeBuilder({ page })
        .include(PAGE)
        .withRules(['color-contrast'])
        .analyze();
      expect(
        violations.flatMap((v) => v.nodes.map((n) => `${n.target}: ${n.any[0]?.message ?? ''}`)),
      ).toEqual([]);

      await page.locator(PAGE).screenshot({ path: `e2e/screenshots/scene-${name}-${theme}.png` });
      expect(errors).toEqual([]);
    });
  }
}
