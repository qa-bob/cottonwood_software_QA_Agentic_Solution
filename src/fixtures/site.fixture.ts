/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@app-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { FeaturesPage } from '@pages/features.page';
import { DemoPage } from '@pages/demo.page';
import { PricingPage } from '@pages/pricing.page';
import { SupportPage } from '@pages/support.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  siteConfig: SiteConfig;
  homePage: HomePage;
  navigationPage: NavigationPage;
  contactPage: ContactFormPage;
  featuresPage: FeaturesPage;
  demoPage: DemoPage;
  pricingPage: PricingPage;
  supportPage: SupportPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  featuresPage: async ({ page, siteConfig }, use) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    await use(featuresPage);
  },

  demoPage: async ({ page, siteConfig }, use) => {
    const demoPage = new DemoPage(page, siteConfig);
    await use(demoPage);
  },

  pricingPage: async ({ page, siteConfig }, use) => {
    const pricingPage = new PricingPage(page, siteConfig);
    await use(pricingPage);
  },

  supportPage: async ({ page, siteConfig }, use) => {
    const supportPage = new SupportPage(page, siteConfig);
    await use(supportPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };
