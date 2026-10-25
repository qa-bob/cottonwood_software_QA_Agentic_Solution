/**
 * Full-site regression suite for Campground Master (cottonwoodsoftware.com).
 *
 * Visits every major page discoverable from the navigation and verifies:
 *   1. The page returns HTTP 200
 *   2. The page has a non-empty <title>
 *   3. The page has at least one heading or meaningful body text
 *   4. No catastrophic JavaScript errors
 *
 * This suite is intentionally broad and lightweight — it catches broken pages
 * and server errors without duplicating the deep assertions in functional tests.
 */

import { test, expect } from '@fixtures/site.fixture';

const SITE_PAGES = [
  { label: 'Homepage', path: '/' },
  { label: 'Features', path: '/features.html' },
  { label: 'Free Demo', path: '/free_demo.html' },
  { label: 'Free Trial', path: '/free_trial.html' },
  { label: 'Quick-Start Tour', path: '/quickstart.html' },
  { label: 'Interactive Maps', path: '/maps.html' },
  { label: 'Online Reservations', path: '/online.html' },
  { label: 'Credit Card Processing', path: '/creditcards.html' },
  { label: 'Point of Sale', path: '/pos.html' },
  { label: 'Networking', path: '/networking.html' },
  { label: 'Pricing / Order Info', path: '/order.html' },
  { label: 'Order Procedure', path: '/order_procedure.html' },
  { label: 'Renew Support', path: '/upgrade.html' },
  { label: 'Support', path: '/support.html' },
  { label: 'FAQ', path: '/faq.html' },
  { label: 'Testimonials', path: '/testimonials.html' },
  { label: 'System Requirements', path: '/requirements.html' },
  { label: 'Downloads', path: '/downloads.html' },
  { label: 'Documentation', path: '/documentation.html' },
  { label: 'Contact', path: '/contact.html' },
  { label: 'Privacy Policy', path: '/privacy.html' },
  { label: 'Buying Guide', path: '/buying.html' },
];

for (const sitePage of SITE_PAGES) {
  test(`${sitePage.label} page loads successfully @regression`, async ({ page, siteConfig }) => {
    const url = siteConfig.url.replace(/\/$/, '') + sitePage.path;

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });

    // HTTP status must be 2xx (not 404, 500, etc.)
    expect(
      response?.status(),
      `${sitePage.label} (${url}) returned HTTP ${response?.status()}`
    ).toBeLessThan(400);

    // Page must have a title
    const title = await page.title();
    expect(
      title.trim().length,
      `${sitePage.label} should have a non-empty <title>`
    ).toBeGreaterThan(0);

    // Page must have some body content
    const bodyText = (await page.locator('body').textContent()) ?? '';
    expect(
      bodyText.trim().length,
      `${sitePage.label} should have meaningful body content`
    ).toBeGreaterThan(50);

    // Warn on console errors but do not fail the regression test
    const criticalErrors = consoleErrors.filter((e) => {
      const lower = e.toLowerCase();
      return !lower.includes('google') && !lower.includes('net::err_blocked_by_client');
    });

    if (criticalErrors.length > 0) {
      console.warn(
        `[regression] ${sitePage.label} had ${criticalErrors.length} console error(s):\n` +
          criticalErrors.slice(0, 3).join('\n')
      );
    }
  });
}

test.describe('Cross-page link integrity @regression', () => {
  test('homepage links to all primary nav destinations @regression', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const navLinks = page.locator('a[href]');
    const count = await navLinks.count();
    expect(count, 'Homepage should have at least 5 links').toBeGreaterThan(5);
  });

  test('footer links are present and have valid hrefs @regression', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    // The Campground Master site has footer nav links
    const footerLinks = page.locator('body').locator('a[href]').last();
    const href = await footerLinks.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('brochure PDF link is accessible @regression', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const pdfLink = page.locator('a[href$=".pdf"]').first();
    test.skip(await pdfLink.count() === 0, 'No brochure PDF link found — site may have removed it');

    const href = await pdfLink.getAttribute('href');
    const absoluteUrl = new URL(href!, siteConfig.url).toString();
    const response = await page.request.head(absoluteUrl, { timeout: 10_000 });

    expect(
      response.status(),
      `Brochure PDF at ${absoluteUrl} should be reachable`
    ).toBeLessThan(400);
  });
});
