import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

const mockGamesList = Array.from({ length: 16 }).map((_, i) => ({
  id: `game-${i + 1}`,
  slug: i === 0 ? 'mobile-legends' : `game-${i + 1}`,
  name: i === 0 ? 'Mobile Legends' : `Game ${i + 1}`,
  category: i < 10 ? 'Mobile Games' : 'PC & Gift Cards',
  startingPriceCents: 99 + i * 10,
  products: [
    {
      id: `prod-${i}-1`,
      name: '86 Diamonds',
      sellPriceCents: 99,
      packageType: 'currency',
      sortOrder: 1,
    },
  ],
}));

test.describe('SN Top-Up Golden Path E2E (EN & Khmer)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/config', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ paymentMode: 'mock', supplierMode: 'mock' }),
      });
    });

    await page.route('**/api/v1/games/mobile-legends', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          game: {
            id: 'game-1',
            slug: 'mobile-legends',
            name: 'Mobile Legends',
            category: 'Mobile Games',
            inputFields: [
              {
                key: 'playerId',
                label: { en: 'Player ID', km: 'អត្តសញ្ញាណអ្នកលេង' },
                type: 'text',
                required: true,
                placeholder: 'e.g. 12345678',
              },
              {
                key: 'serverId',
                label: { en: 'Server ID', km: 'លេខ Server ID' },
                type: 'text',
                required: true,
                placeholder: 'e.g. 2101',
              },
            ],
            products: [
              {
                id: 'p1',
                name: '86 Diamonds',
                sellPriceCents: 99,
                packageType: 'currency',
                sortOrder: 1,
              },
              {
                id: 'p2',
                name: '172 Diamonds',
                sellPriceCents: 199,
                packageType: 'currency',
                sortOrder: 2,
              },
            ],
            groupedProducts: {
              currency: [
                {
                  id: 'p1',
                  name: '86 Diamonds',
                  sellPriceCents: 99,
                  packageType: 'currency',
                  sortOrder: 1,
                },
                {
                  id: 'p2',
                  name: '172 Diamonds',
                  sellPriceCents: 199,
                  packageType: 'currency',
                  sortOrder: 2,
                },
              ],
              pass: [],
              bundle: [],
            },
          },
        }),
      });
    });

    await page.route('**/api/v1/orders', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          order: {
            code: 'ORD-TEST123',
            amountCents: 990,
            status: 'pending',
            product: { name: '86 Diamonds - Mobile Legends' },
            game: { slug: 'mobile-legends' },
            payments: [
              {
                providerRef: 'KHQR_REF_999',
                expiresAt: new Date(Date.now() + 300000).toISOString(),
                checkoutUrl: 'http://localhost:4000/api/v1/dev/checkout/MOCK',
              },
            ],
          },
        }),
      });
    });

    await page.route('**/api/v1/orders/ORD-TEST123', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          order: {
            code: 'ORD-TEST123',
            amountCents: 990,
            status: 'pending',
            product: { name: '86 Diamonds - Mobile Legends' },
            game: { slug: 'mobile-legends' },
            payments: [
              {
                providerRef: 'KHQR_REF_999',
                expiresAt: new Date(Date.now() + 300000).toISOString(),
                checkoutUrl: 'http://localhost:4000/api/v1/dev/checkout/MOCK',
              },
            ],
          },
        }),
      });
    });
  });

  test('Complete top-up flow in English with 360x800 screenshot, game count, demo banner & SEO assertions', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.route('**/api/v1/games', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ games: mockGamesList }),
      });
    });

    const screenshotsDir = path.resolve(process.cwd(), 'test-results');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('http://localhost:5173/');

    await page.screenshot({ path: path.join(screenshotsDir, 'mobile-en.png') });

    // Demo banner visible when mock config
    await expect(page.locator('[data-testid="demo-banner"]')).toBeVisible();

    // SEO assertions
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://sntopup.com/');
    const metaRobots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(metaRobots).toBe('index, follow');

    // Assert >= 15 game cards render and counts match API data (10 mobile, 6 pc)
    const cardCount = await page.locator('[data-testid="game-card"]').count();
    expect(cardCount).toBeGreaterThanOrEqual(15);
    await expect(page.locator('button:has-text("All Games (16)")')).toBeVisible();
    await expect(page.locator('button:has-text("Mobile (10)")')).toBeVisible();
    await expect(page.locator('button:has-text("PC & Gift Cards (6)")')).toBeVisible();

    // Click category tabs and verify card counts
    await page.click('button:has-text("Mobile (10)")');
    expect(await page.locator('[data-testid="game-card"]').count()).toBe(10);
    await page.click('button:has-text("PC & Gift Cards (6)")');
    expect(await page.locator('[data-testid="game-card"]').count()).toBe(6);
    await page.click('button:has-text("All Games (16)")');

    await page.click('a[href="/games/mobile-legends"]');
    await page.waitForSelector('input[placeholder="e.g. 12345678"]');

    // Per-game title assertion
    await expect(page).toHaveTitle(/Mobile Legends Top-Up - SN Top-Up/);

    await page.fill('input[placeholder="e.g. 12345678"]', '12345678');
    await page.fill('input[placeholder="e.g. 2101"]', '2101');
    await page.fill('input[placeholder="+855 12 345 678"]', '+85512345678');

    await page.click('text=86 Diamonds');
    await page.click('button:has-text("Proceed to Checkout")');

    await expect(page).toHaveURL(/\/checkout\/ORD-/);

    expect(consoleErrors).toEqual([]);
  });

  test('Demo banner hidden when config says live', async ({ page }) => {
    await page.route('**/api/v1/config', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ paymentMode: 'live', supplierMode: 'live' }),
      });
    });
    await page.route('**/api/v1/games', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ games: mockGamesList }),
      });
    });

    await page.goto('http://localhost:5173/');
    await expect(page.locator('[data-testid="demo-banner"]')).not.toBeVisible();
  });

  test('Home page API failure state shows error and zero cards', async ({ page }) => {
    await page.route('**/api/v1/games', (route) => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    });

    await page.goto('http://localhost:5173/');
    await expect(page.locator('[data-testid="error-state"]')).toBeVisible({ timeout: 10000 });
    const cardCount = await page.locator('[data-testid="game-card"]').count();
    expect(cardCount).toBe(0);

    await page.route('**/api/v1/games', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ games: mockGamesList }),
      });
    });
    await page.click('[data-testid="retry-btn"]');
    await expect(page.locator('[data-testid="game-grid"]')).toBeVisible({ timeout: 5000 });
  });

  test('Complete top-up flow in Khmer', async ({ page }) => {
    await page.route('**/api/v1/games', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ games: mockGamesList }),
      });
    });

    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('http://localhost:5173/');

    await page.click('text=🇰🇭 ភាសាខ្មែរ');
    await page.click('a[href="/games/mobile-legends"]');
    await page.waitForSelector('input[placeholder="e.g. 12345678"]');

    await page.fill('input[placeholder="e.g. 12345678"]', '87654321');
    await page.fill('input[placeholder="e.g. 2101"]', '2101');
    await page.fill('input[placeholder="+855 12 345 678"]', '+85512345678');

    await page.click('text=172 Diamonds');
    await page.click('button:has-text("Proceed to Checkout")');

    await expect(page).toHaveURL(/\/checkout\/ORD-/);
  });

  test('respects prefers-reduced-motion (no tilt transform)', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.route('**/api/v1/games', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ games: mockGamesList }),
      });
    });
    await page.goto('http://localhost:5173/');
    const card = page.locator('a[href="/games/mobile-legends"]').first();
    await card.hover();
    const transformStyle = await card.evaluate((el) => window.getComputedStyle(el).transform);
    expect(transformStyle).toBe('none');
    await context.close();
  });

  test('confetti chunk is NOT requested before success state (network assertion)', async ({
    page,
  }) => {
    await page.route('**/api/v1/games', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ games: mockGamesList }),
      });
    });

    const requestedUrls: string[] = [];
    page.on('request', (req) => {
      requestedUrls.push(req.url());
    });

    await page.goto('http://localhost:5173/');
    await page.click('a[href="/games/mobile-legends"]');
    await page.waitForSelector('input[placeholder="e.g. 12345678"]');
    await page.fill('input[placeholder="e.g. 12345678"]', '12345678');
    await page.fill('input[placeholder="e.g. 2101"]', '2101');
    await page.fill('input[placeholder="+855 12 345 678"]', '+85512345678');
    await page.click('text=86 Diamonds');
    await page.click('button:has-text("Proceed to Checkout")');
    await expect(page).toHaveURL(/\/checkout\/ORD-/);

    const confettiRequested = requestedUrls.some((url) => url.includes('confetti'));
    expect(confettiRequested).toBeFalsy();
  });

  test('axe accessibility: Home, Game, and Checkout at 360x800, dark and light, EN and Khmer', async ({
    page,
  }) => {
    await page.route('**/api/v1/games', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ games: mockGamesList }),
      });
    });

    await page.setViewportSize({ width: 360, height: 800 });

    await page.goto('http://localhost:5173/');
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.waitForTimeout(1000);
    let results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(1000);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.click('text=🇰🇭 ភាសាខ្មែរ');
    await page.waitForTimeout(1000);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.click('a[href="/games/mobile-legends"]');
    await page.waitForSelector('input[placeholder="e.g. 12345678"]');
    await page.waitForTimeout(1000);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.click('text=🇬🇧 English');
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.waitForTimeout(1000);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.fill('input[placeholder="e.g. 12345678"]', '12345678');
    await page.fill('input[placeholder="e.g. 2101"]', '2101');
    await page.fill('input[placeholder="+855 12 345 678"]', '+85512345678');
    await page.click('text=86 Diamonds');
    await page.click('button:has-text("Proceed to Checkout")');
    await expect(page).toHaveURL(/\/checkout\/ORD-/);

    await expect(page.locator('[data-testid="order-code"]')).toBeVisible();
    await page.click('[data-testid="copy-btn"]');
    await expect(page.locator('[data-testid="toast"]')).toContainText('copied');

    await page.waitForTimeout(1000);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(1000);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('expired checkout state and retry', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('http://localhost:5173/checkout/ORD-EXPIRED');
    await expect(page.locator('[data-testid="expired-state"]')).toBeVisible();
    await page.click('[data-testid="retry-btn"]');
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});
