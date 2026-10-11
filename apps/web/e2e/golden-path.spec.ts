import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

test.describe('SN Top-Up Golden Path E2E (EN & Khmer)', () => {
  test('Complete top-up flow in English with 360x800 screenshot', async ({ page }) => {
    const screenshotsDir = path.resolve(process.cwd(), 'docs/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('http://localhost:5173/');

    await page.screenshot({ path: path.join(screenshotsDir, 'mobile-en.png') });

    await page.click('a[href="/games/mobile-legends"]');
    await page.waitForSelector('input[placeholder="e.g. 12345678"]');

    await page.fill('input[placeholder="e.g. 12345678"]', '12345678');
    await page.fill('input[placeholder="e.g. 2101"]', '2101');
    await page.fill('input[placeholder="+855 12 345 678"]', '+85512345678');

    await page.click('text=86 Diamonds');
    await page.click('text=Proceed to Checkout');

    await expect(page).toHaveURL(/\/checkout\/ORD-/);
  });

  test('Complete top-up flow in Khmer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');

    await page.click('text=🇰🇭 ភាសាខ្មែរ');
    await page.click('a[href="/games/mobile-legends"]');
    await page.waitForSelector('input[placeholder="e.g. 12345678"]');

    await page.fill('input[placeholder="e.g. 12345678"]', '87654321');
    await page.fill('input[placeholder="e.g. 2101"]', '2101');
    await page.fill('input[placeholder="+855 12 345 678"]', '+85512345678');

    await page.click('text=172 Diamonds');
    await page.click('text=Proceed to Checkout');

    await expect(page).toHaveURL(/\/checkout\/ORD-/);
  });

  test('respects prefers-reduced-motion (no tilt transform)', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/');
    const card = page.locator('a[href="/games/mobile-legends"]').first();
    await card.hover();
    const transformStyle = await card.evaluate((el) => window.getComputedStyle(el).transform);
    expect(transformStyle).toBe('none');
    await context.close();
  });

  test('axe accessibility: Home (light & dark)', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Light theme
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    let results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    // Dark theme
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('axe accessibility: Game Page (light & dark)', async ({ page }) => {
    await page.goto('http://localhost:5173/games/mobile-legends');
    await page.waitForSelector('input[placeholder="e.g. 12345678"]');

    // Light theme
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    let results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    // Dark theme
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('checkout features: stepper, countdown, copy, and axe accessibility (light & dark)', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/');
    await page.click('a[href="/games/mobile-legends"]');
    await page.waitForSelector('input[placeholder="e.g. 12345678"]');
    await page.fill('input[placeholder="e.g. 12345678"]', '12345678');
    await page.fill('input[placeholder="e.g. 2101"]', '2101');
    await page.fill('input[placeholder="+855 12 345 678"]', '+85512345678');
    await page.click('text=86 Diamonds');
    await page.click('text=Proceed to Checkout');
    await expect(page).toHaveURL(/\/checkout\/ORD-/);

    // Assert stepper and countdown visible
    await expect(page.locator('[data-testid="stepper"]')).toBeVisible();
    await expect(page.locator('[data-testid="countdown-timer"]')).toBeVisible();

    // Check order code and copy button
    await expect(page.locator('[data-testid="order-code"]')).toBeVisible();
    await page.click('[data-testid="copy-btn"]');
    await expect(page.locator('[data-testid="toast"]')).toContainText('copied');

    // Run axe on checkout page in light and dark themes
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    let results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.evaluate(() => document.documentElement.classList.add('dark'));
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('expired checkout state and retry', async ({ page }) => {
    await page.goto('http://localhost:5173/checkout/ORD-EXPIRED');
    await expect(page.locator('[data-testid="expired-state"]')).toBeVisible();
    await page.click('[data-testid="retry-btn"]');
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});
