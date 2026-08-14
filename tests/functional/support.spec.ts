/**
 * Functional tests for the Campground Master Support section:
 *   - FAQ page (/faq.html)
 *   - Downloads page (/downloads.html)
 *   - Testimonials page (/testimonials.html)
 *   - System Requirements page (/requirements.html)
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('FAQ Page @functional', () => {
  test.beforeEach(async ({ supportPage }) => {
    await supportPage.navigateToFaq();
    await supportPage.waitForLoad();
  });

  test('FAQ page loads with a heading @functional @smoke', async ({ supportPage }) => {
    const heading = await supportPage.getFaqHeading();
    expect(heading.length, 'FAQ page should have a visible heading').toBeGreaterThan(0);
    expect(heading.toLowerCase()).toMatch(/faq|frequently|question/);
  });

  test('FAQ page contains multiple section categories @functional', async ({ supportPage }) => {
    const headings = await supportPage.getFaqSectionHeadings();
    expect(
      headings.length,
      'FAQ page should have at least 4 section headings (General, Computer, Pricing, Functionality, etc.)'
    ).toBeGreaterThanOrEqual(4);
  });

  test('FAQ page has sufficient question content @functional', async ({ supportPage }) => {
    const hasContent = await supportPage.hasSufficientFaqContent(10);
    expect(
      hasContent,
      'FAQ page should have at least 10 question marks (signifying 10+ Q&A entries)'
    ).toBeTruthy();
  });

  test('FAQ page body mentions Campground Master @functional', async ({ supportPage }) => {
    const body = await supportPage.getBodyText();
    expect(body.toLowerCase()).toMatch(/campground master|cottonwood/);
  });

  test('FAQ sections include pricing-related content @functional', async ({ supportPage }) => {
    const body = await supportPage.getBodyText();
    expect(body.toLowerCase()).toMatch(/pric|order|cost|\$795/);
  });
});

test.describe('Downloads Page @functional', () => {
  test.beforeEach(async ({ supportPage }) => {
    await supportPage.navigateToDownloads();
    await supportPage.waitForLoad();
  });

  test('downloads page loads successfully @functional @smoke', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('downloads page has at least one download link @functional', async ({ supportPage }) => {
    const hasLinks = await supportPage.hasDownloadLinks();
    expect(
      hasLinks,
      'Downloads page should have at least one file download link (.exe, .zip, or download href)'
    ).toBeTruthy();
  });
});

test.describe('Testimonials Page @functional', () => {
  test.beforeEach(async ({ supportPage }) => {
    await supportPage.navigateToTestimonials();
    await supportPage.waitForLoad();
  });

  test('testimonials page loads successfully @functional @smoke', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('testimonials page contains customer quotes @functional', async ({ supportPage }) => {
    const count = await supportPage.getTestimonialCount();
    expect(
      count,
      'Testimonials page should have at least 3 customer quotes or testimonial blocks'
    ).toBeGreaterThanOrEqual(3);
  });
});

test.describe('System Requirements Page @functional', () => {
  test.beforeEach(async ({ supportPage }) => {
    await supportPage.navigateToRequirements();
    await supportPage.waitForLoad();
  });

  test('requirements page loads successfully @functional @smoke', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('requirements page mentions Windows compatibility @functional', async ({ supportPage }) => {
    const body = await supportPage.getBodyText();
    expect(body.toLowerCase()).toMatch(/windows/);
  });
});
