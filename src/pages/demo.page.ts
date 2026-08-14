import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class DemoPage extends BasePage {
  readonly path = '/free_demo.html';

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
   * Returns the primary demo download link (the .exe installer).
   * href points to zip/campground_master_install.exe.
   */
  getDownloadLink(): Locator {
    return this.page.locator('a[href*="campground_master_install"], a[href*=".exe"]').first();
  }

  /**
   * Returns the "Order a Demo on CD" link that points to an external order form.
   */
  getCDOrderLink(): Locator {
    return this.page.locator('a').filter({ hasText: /order.*cd|cd.*order/i }).first();
  }

  /**
   * Returns the Free 30-day Trial CTA link.
   */
  getFreeTrialLink(): Locator {
    return this.page.locator('a').filter({ hasText: /trial|free.*trial/i }).first();
  }

  getNewsletterLink(): Locator {
    return this.page.locator('a[href*="newsletter"], a').filter({ hasText: /newsletter/i }).first();
  }

  async hasDownloadLink(): Promise<boolean> {
    const link = this.getDownloadLink();
    return (await link.count()) > 0;
  }

  async hasFreeTrialLink(): Promise<boolean> {
    const link = this.getFreeTrialLink();
    return (await link.count()) > 0;
  }
}
