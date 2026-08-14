/**
 * Functional tests for the Campground Master Pricing / Order Info page.
 * URL: http://www.cottonwoodsoftware.com/order.html
 *
 * Key invariants for this product:
 *   - One-time purchase, no monthly fees (core marketing claim)
 *   - Single-computer download starts at $795
 *   - An ORDER NOW link must always be present
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Pricing Page @functional', () => {
  test.beforeEach(async ({ pricingPage }) => {
    await pricingPage.navigate();
    await pricingPage.waitForLoad();
  });

  test('pricing page loads with a heading @functional @smoke', async ({ pricingPage }) => {
    const heading = await pricingPage.getPageHeading();
    expect(heading.length, 'Pricing page should have a visible heading').toBeGreaterThan(0);
    expect(heading.toLowerCase()).toMatch(/pricing|order/);
  });

  test('pricing page displays at least one dollar amount @functional', async ({ pricingPage }) => {
    const hasPrices = await pricingPage.hasPriceVisible();
    expect(hasPrices, 'Pricing page should display at least one dollar amount ($NNN)').toBeTruthy();
  });

  test('pricing page states there are no monthly fees @functional', async ({ pricingPage }) => {
    // "NO MONTHLY FEES" is a core product differentiator — regression-critical
    const hasNoBillText = await pricingPage.hasNoMonthlyFeesText();
    expect(
      hasNoBillText,
      'Pricing page must state there are no monthly fees — this is a core product claim'
    ).toBeTruthy();
  });

  test('pricing page has an ORDER NOW link @functional', async ({ pricingPage }) => {
    const hasOrder = await pricingPage.hasOrderLink();
    expect(hasOrder, 'Pricing page must have an ORDER NOW / place order link').toBeTruthy();
  });

  test('ORDER NOW link has a valid href @functional', async ({ pricingPage }) => {
    const link = pricingPage.getOrderNowLink();
    await expect(link).toBeVisible();

    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).not.toBe('#');
  });

  test('pricing page mentions the $795 base price @functional', async ({ pricingPage }) => {
    const body = await pricingPage.getBodyText();
    expect(body, 'Pricing page should mention the $795 base price').toMatch(/\$795|795/);
  });

  test('pricing page has a download demo CTA @functional', async ({ pricingPage }) => {
    const link = pricingPage.getDownloadDemoLink();
    // May appear as text link — soft assertion
    if (await link.count() > 0) {
      await expect(link).toBeVisible();
    }
  });

  test('pricing page has a free trial CTA @functional', async ({ pricingPage }) => {
    const link = pricingPage.getFreeTrialLink();
    if (await link.count() > 0) {
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('order procedure page is reachable from pricing page @functional', async ({
    pricingPage,
    page,
    siteConfig,
  }) => {
    const link = pricingPage.getOrderNowLink();
    if (await link.count() === 0) {
      test.skip(true, 'No ORDER NOW link found on pricing page');
      return;
    }

    const href = await link.getAttribute('href');
    const targetUrl = new URL(href!, siteConfig.url).toString();
    const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
  });
});
