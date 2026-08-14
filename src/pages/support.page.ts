import { BasePage } from '@pages/base.page';

export interface FaqSection {
  heading: string;
  questionCount: number;
}

export class SupportPage extends BasePage {
  readonly faqPath = '/faq.html';
  readonly downloadsPath = '/downloads.html';
  readonly testimonialsPath = '/testimonials.html';
  readonly requirementsPath = '/requirements.html';

  async navigateToFaq(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.faqPath, {
      waitUntil: 'domcontentloaded',
    });
  }

  async navigateToDownloads(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.downloadsPath, {
      waitUntil: 'domcontentloaded',
    });
  }

  async navigateToTestimonials(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.testimonialsPath, {
      waitUntil: 'domcontentloaded',
    });
  }

  async navigateToRequirements(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.requirementsPath, {
      waitUntil: 'domcontentloaded',
    });
  }

  async getFaqHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) return (await h1.textContent())?.trim() ?? '';
    return (await this.page.locator('h2').first().textContent())?.trim() ?? '';
  }

  /**
   * Returns all section headings on the FAQ page.
   * The FAQ is organized under h2/h3 category headings.
   */
  async getFaqSectionHeadings(): Promise<string[]> {
    const headings = this.page.locator('h2, h3');
    const count = await headings.count();
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = (await headings.nth(i).textContent())?.trim() ?? '';
      if (text.length > 0) results.push(text);
    }

    return results;
  }

  /**
   * Returns true if the FAQ page has a meaningful number of questions.
   * The Campground Master FAQ has 44 questions across 6 categories.
   */
  async hasSufficientFaqContent(minQuestions = 10): Promise<boolean> {
    const body = (await this.page.locator('body').textContent()) ?? '';
    const questionMatches = body.match(/\?/g);
    return (questionMatches?.length ?? 0) >= minQuestions;
  }

  async hasDownloadLinks(): Promise<boolean> {
    const links = this.page.locator('a[href*=".exe"], a[href*=".zip"], a[href*="download" i]');
    return (await links.count()) > 0;
  }

  async getTestimonialCount(): Promise<number> {
    const quoteElements = this.page.locator('blockquote, [class*="testimonial"], [class*="quote"]');
    const count = await quoteElements.count();

    if (count > 0) return count;

    // Fallback: count paragraphs containing quotation marks (plain HTML site)
    const paragraphs = this.page.locator('p');
    const pCount = await paragraphs.count();
    let testimonials = 0;
    for (let i = 0; i < pCount; i++) {
      const text = (await paragraphs.nth(i).textContent()) ?? '';
      if (text.includes('"') || text.includes('“')) testimonials++;
    }

    return testimonials;
  }

  async getBodyText(): Promise<string> {
    return (await this.page.locator('body').textContent()) ?? '';
  }
}
