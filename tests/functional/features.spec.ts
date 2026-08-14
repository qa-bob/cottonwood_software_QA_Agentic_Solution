/**
 * Functional tests for the Campground Master Features & Benefits page.
 * URL: http://www.cottonwoodsoftware.com/features.html
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Features Page @functional', () => {
  test.beforeEach(async ({ featuresPage }) => {
    await featuresPage.navigate();
    await featuresPage.waitForLoad();
  });

  test('features page loads with a heading @functional @smoke', async ({ featuresPage }) => {
    const heading = await featuresPage.getPageHeading();
    expect(heading.length, 'Features page should have a visible heading').toBeGreaterThan(0);
    expect(heading.toLowerCase()).toMatch(/feature|campground|benefit/);
  });

  test('features page lists product benefits @functional', async ({ featuresPage }) => {
    const benefits = await featuresPage.getBenefitItems();
    expect(
      benefits.length,
      'Features page should list at least 5 benefit items'
    ).toBeGreaterThanOrEqual(5);
  });

  test('features page links to feature detail pages @functional', async ({ featuresPage }) => {
    const cards = await featuresPage.getFeatureDetailLinks();
    expect(
      cards.length,
      'Features page should link to at least 3 feature detail pages (maps, pos, networking, etc.)'
    ).toBeGreaterThanOrEqual(3);
  });

  test('feature detail links are valid hrefs @functional', async ({ featuresPage }) => {
    const cards = await featuresPage.getFeatureDetailLinks();
    for (const card of cards) {
      expect(card.linkHref, `Feature card "${card.title}" should have a non-empty href`).toBeTruthy();
      expect(card.linkHref).not.toBe('#');
    }
  });

  test('features page has a demo download CTA @functional', async ({ featuresPage }) => {
    const demoLink = await featuresPage.getDownloadDemoLink();
    expect(demoLink, 'Features page should have a link to download the demo').not.toBeNull();
    if (demoLink) {
      await expect(demoLink).toBeVisible();
    }
  });

  test('features page has a free trial CTA @functional', async ({ featuresPage }) => {
    const trialLink = await featuresPage.getFreTrialLink();
    expect(trialLink, 'Features page should have a free trial CTA link').not.toBeNull();
    if (trialLink) {
      await expect(trialLink).toBeVisible();
    }
  });

  test('maps feature link navigates to maps page @functional', async ({ featuresPage, page, siteConfig }) => {
    const cards = await featuresPage.getFeatureDetailLinks();
    const mapsCard = cards.find((c) => c.linkHref.includes('maps'));

    if (!mapsCard) {
      test.skip(true, 'Maps feature link not found on features page');
      return;
    }

    const targetUrl = new URL(mapsCard.linkHref, siteConfig.url).toString();
    const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    expect(response?.status(), `maps.html should return HTTP 200`).toBe(200);

    const heading = await featuresPage.getPageHeading();
    expect(heading.length).toBeGreaterThan(0);
  });

  test('online reservations feature link is present and reachable @functional', async ({
    featuresPage,
    page,
    siteConfig,
  }) => {
    const cards = await featuresPage.getFeatureDetailLinks();
    const onlineCard = cards.find((c) => c.linkHref.includes('online'));

    if (!onlineCard) {
      test.skip(true, 'Online reservations feature link not found');
      return;
    }

    const targetUrl = new URL(onlineCard.linkHref, siteConfig.url).toString();
    const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
  });
});
