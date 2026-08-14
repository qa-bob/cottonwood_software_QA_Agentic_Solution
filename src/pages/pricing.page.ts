import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class PricingPage extends BasePage {
  readonly path = '/order.html';

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
   * Returns true if at least one price (dollar amount) is visible on the page.
   * Looks for text matching $NNN patterns.
   */
  async hasPriceVisible(): Promise<boolean> {
    const body = await this.page.locator('body').textContent() ?? '';
    return /\$\d{3,}/.test(body);
  }

  /**
   * Returns true if the page contains the "no monthly fees" claim.
   * This is a key product differentiator and a regression-critical assertion.
   */
  async hasNoMonthlyFeesText(): Promise<boolean> {
    const body = await this.page.locator('body').textContent() ?? '';
    return /no monthly fee/i.test(body);
  }

  getOrderNowLink(): Locator {
    return this.page.locator('a[href*="order_procedure"], a').filter({
      hasText: /order now|place order/i,
    }).first();
  }

  getDownloadDemoLink(): Locator {
    return this.page.locator('a[href*="free_demo"], a').filter({ hasText: /demo/i }).first();
  }

  getFreeTrialLink(): Locator {
    return this.page.locator('a[href*="free_trial"], a').filter({ hasText: /trial/i }).first();
  }

  async hasOrderLink(): Promise<boolean> {
    return (await this.getOrderNowLink().count()) > 0;
  }

  /**
   * Returns the page body text for content assertions.
   * Used to verify specific pricing figures without brittle selectors.
   */
  async getBodyText(): Promise<string> {
    return (await this.page.locator('body').textContent()) ?? '';
  }
}
