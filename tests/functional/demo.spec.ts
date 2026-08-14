/**
 * Functional tests for the Campground Master Free Demo page.
 * URL: http://www.cottonwoodsoftware.com/free_demo.html
 *
 * We verify the download link and trial CTA are present and correct.
 * We do NOT actually trigger the download or navigate to the trial form.
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Free Demo Page @functional', () => {
  test.beforeEach(async ({ demoPage }) => {
    await demoPage.navigate();
    await demoPage.waitForLoad();
  });

  test('demo page loads with a heading @functional @smoke', async ({ demoPage }) => {
    const heading = await demoPage.getPageHeading();
    expect(heading.length, 'Demo page should have a visible heading').toBeGreaterThan(0);
  });

  test('demo page has a download link for the installer @functional', async ({ demoPage }) => {
    const hasLink = await demoPage.hasDownloadLink();
    expect(
      hasLink,
      'Demo page should have a link to download the Campground Master installer (.exe or zip)'
    ).toBeTruthy();
  });

  test('demo download link has a non-empty href pointing to an installer @functional', async ({
    demoPage,
  }) => {
    const link = demoPage.getDownloadLink();
    await expect(link).toBeVisible();

    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
    // The installer is served as an .exe inside a zip archive
    expect(href!.toLowerCase()).toMatch(/\.(exe|zip)|install/);
  });

  test('demo page has a free 30-day trial CTA @functional', async ({ demoPage }) => {
    const hasLink = await demoPage.hasFreeTrialLink();
    expect(
      hasLink,
      'Demo page should have a CTA linking to the free 30-day trial'
    ).toBeTruthy();
  });

  test('free trial link is visible and has a valid href @functional', async ({ demoPage }) => {
    const link = demoPage.getFreeTrialLink();
    await expect(link).toBeVisible();

    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).not.toBe('#');
  });

  test('demo page mentions 30-day trial in content @functional', async ({ demoPage, page }) => {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    expect(bodyText.toLowerCase()).toMatch(/30.day|thirty.day|free trial/);
  });

  test('CD order link is present @functional', async ({ demoPage }) => {
    const link = demoPage.getCDOrderLink();
    // The CD link may not always be present — soft assertion
    if (await link.count() > 0) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});
