import { test, expect } from '@playwright/test';
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
    await page.fill('input[placeholder="e.g. 2101"]', '2102');
    await page.fill('input[placeholder="+855 12 345 678"]', '+85512345678');

    await page.click('text=172 Diamonds');
    await page.click('text=Proceed to Checkout');

    await expect(page).toHaveURL(/\/checkout\/ORD-/);
  });
});
