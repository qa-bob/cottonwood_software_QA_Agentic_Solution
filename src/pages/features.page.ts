import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface FeatureCard {
  title: string;
  linkHref: string;
}

export class FeaturesPage extends BasePage {
  readonly path = '/features.html';

  async navigate(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.path, {
      waitUntil: 'domcontentloaded',
    });
  }

  async getPageHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) return (await h1.textContent())?.trim() ?? '';

    const h2 = this.page.locator('h2').first();
    return (await h2.textContent())?.trim() ?? '';
  }

  /**
   * Returns the benefit list items from the "Key Benefits" section.
   * The site renders these as <li> elements under the benefits heading.
   */
  async getBenefitItems(): Promise<string[]> {
    const items = this.page.locator('li');
    const count = await items.count();
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = (await items.nth(i).textContent())?.trim() ?? '';
      if (text.length > 0) results.push(text);
    }

    return results;
  }

  /**
   * Returns links to feature detail pages (maps, pos, networking, etc.).
   * These appear as image+link cards under "Advanced Features".
   */
  async getFeatureDetailLinks(): Promise<FeatureCard[]> {
    const knownFeaturePaths = [
      'maps.html',
      'pos.html',
      'networking.html',
      'creditcards.html',
      'online.html',
    ];

    const cards: FeatureCard[] = [];
    for (const path of knownFeaturePaths) {
      const link = this.page.locator(`a[href*="${path}"]`).first();
      if (await link.count() > 0) {
        const text = (await link.textContent())?.trim() ?? path;
        const href = (await link.getAttribute('href')) ?? path;
        cards.push({ title: text, linkHref: href });
      }
    }

    return cards;
  }

  async getDownloadDemoLink(): Promise<Locator | null> {
    const link = this.page.locator('a[href*="free_demo"], a[href*="demo"]').filter({
      hasText: /demo/i,
    }).first();
    return (await link.count() > 0) ? link : null;
  }

  async getFreTrialLink(): Promise<Locator | null> {
    const link = this.page.locator('a').filter({ hasText: /trial/i }).first();
    return (await link.count() > 0) ? link : null;
  }

  async getProductImages(): Promise<number> {
    const images = this.page.locator('img[src*="campground"], img[src*="master"], img[src*="thumb"]');
    return images.count();
  }
}
