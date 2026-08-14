# Cottonwood Software — QA Agentic Solution

Playwright + TypeScript regression test suite for [Campground Master](http://www.cottonwoodsoftware.com) by Cottonwood Software. Built with the Page Object Model (POM) architecture and OOP principles. Powered by Claude Code for AI-assisted test generation and maintenance.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Contributor Guidelines](#contributor-guidelines)
- [Claude Code Integration](#claude-code-integration)
- [CI/CD](#cicd)
- [Visual Baselines](#visual-baselines)

---

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Git
- Claude Code CLI (optional — for AI-assisted test generation)

---

## Installation

```bash
# Clone the repo
git clone <repo-url>
cd cottonwood_software_QA_Agentic_Solution

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium
```

---

## Running Tests

### All tests

```bash
npm test
```

### By suite

```bash
npm run test:smoke          # Availability and page-load checks
npm run test:navigation     # Nav links, routing, mobile menu
npm run test:forms          # Form field inspection (no submissions)
npm run test:functional     # Business feature tests
npm run test:regression     # Full cross-page regression suite
npm run test:visual         # Screenshot regression
npm run test:responsive     # Viewport layout checks
```

### Interactive / debug modes

```bash
npx playwright test --ui                    # Playwright UI mode
npx playwright test --headed               # Headed browser
npx playwright test --trace on             # Record traces
npx playwright show-report                  # Open HTML report
```

### Override the target URL without editing config

```bash
SITE_URL=https://staging.example.com npm test
```

---

## Configuration

The target site is configured in `site.config.json` at the project root:

```json
{
  "name": "Cottonwood Software",
  "url": "http://www.cottonwoodsoftware.com",
  "hasContactForm": false,
  "skipForms": true,
  "expectedNavItems": ["Home", "FREE Demo", "Features", "Buy / Renew", "Support", "Contact Us"]
}
```

| Field | Description |
|-------|-------------|
| `url` | Canonical base URL for all tests |
| `hasContactForm` | `true` if the site has an interactive contact form |
| `skipForms` | `true` skips the entire `@forms` suite |
| `expectedNavItems` | Nav link texts used in navigation assertions |
| `skipVisual` | `true` skips `@visual` suite (use for sites with heavy animation) |
| `viewports` | Which viewports to run responsive tests on |
| `auth.required` | `true` if the site is behind a login wall |

---

## Project Structure

```
site.config.json              # Site URL, flags, expected nav items
playwright.config.ts          # Playwright projects (desktop/mobile/tablet)
global-setup.ts               # Pre-run reachability check
package.json

src/
  pages/
    base.page.ts              # BasePage — shared navigation, screenshot, error helpers
    home.page.ts              # HomePage — hero, CTAs, headings
    navigation.page.ts        # NavigationPage — nav links, mobile menu, link checking
    contact.page.ts           # ContactFormPage — form discovery and field inspection
    features.page.ts          # FeaturesPage — feature cards and benefit list
    demo.page.ts              # DemoPage — download links, trial CTA
    pricing.page.ts           # PricingPage — pricing sections and order CTAs
    support.page.ts           # SupportPage — FAQ sections, downloads, testimonials
  fixtures/
    site.fixture.ts           # Custom test fixture exposing all page objects
  utils/
    link-checker.ts           # HTTP link reachability utilities
    visual-helper.ts          # Screenshot/visual regression helpers
  types/
    site-config.types.ts      # TypeScript interfaces for site.config.json

tests/
  smoke/
    site-availability.spec.ts # @smoke — loads, HTTP 200, title, no JS errors
  navigation/
    nav-links.spec.ts         # @navigation — nav links, mobile menu, accessible text
  forms/
    contact-form.spec.ts      # @forms — field presence, labels, validation
  functional/
    features.spec.ts          # @functional — Features & Benefits page
    demo.spec.ts              # @functional — Free Demo / Trial page
    pricing.spec.ts           # @functional — Pricing and ordering information
    support.spec.ts           # @functional — FAQ, Downloads, Testimonials
  visual/
    visual-regression.spec.ts # @visual — screenshot regression
  responsive/
    layout.spec.ts            # @responsive — layout at mobile/tablet/desktop
  regression/
    full-site.spec.ts         # Full cross-page regression sweep

.claude/
  agents/
    site-analyzer.md          # Sub-agent: crawl site and update site.config.json
    test-generator.md         # Sub-agent: generate site-specific tests
  commands/
    analyze-site.md           # /analyze-site slash command
    run-smoke.md              # /run-smoke slash command
    update-baseline.md        # /update-baseline slash command
    generate-report.md        # /generate-report slash command
  hooks/
    pre-test.sh               # Pre-test hook (site reachability check)
  settings.json               # Claude Code project settings

.github/
  workflows/
    playwright.yml            # GitHub Actions CI pipeline
  ISSUE_TEMPLATE/
    bug_report.md             # Bug report template
    feature_request.md        # Test coverage request template
  pull_request_template.md    # PR checklist

AGENTS.md                     # Agent documentation (this-repo guide)
SKILLS.md                     # Slash command / skill reference
CLAUDE.md                     # Claude Code project instructions
```

---

## Architecture

### Page Object Model (POM)

Every page or major section of the site has a dedicated class in `src/pages/` that extends `BasePage`. Page objects encapsulate selectors and user-action methods. Assertions are never placed inside page objects — only in test spec files.

```
BasePage (base.page.ts)
  |-- HomePage
  |-- NavigationPage
  |-- ContactFormPage
  |-- FeaturesPage
  |-- DemoPage
  |-- PricingPage
  |-- SupportPage
```

### OOP Principles Applied

- **Inheritance**: All page classes extend `BasePage`, inheriting `navigate()`, `waitForLoad()`, `takeScreenshot()`, and `isResponsive()`.
- **Encapsulation**: Locators are private to each page class. Tests interact only through public methods.
- **Single Responsibility**: Each page class models exactly one page or feature area.

### Custom Fixtures

Tests import `{ test, expect }` from `src/fixtures/site.fixture.ts`. This automatically constructs all page objects with the loaded `SiteConfig` and the Playwright `Page` instance, so tests never deal with constructor arguments.

```typescript
// Every test file starts with:
import { test, expect } from '@fixtures/site.fixture';

// And has instant access to:
test('example', async ({ featuresPage, pricingPage, siteConfig }) => { ... });
```

---

## Contributor Guidelines

### Adding a New Test

1. Read `site.config.json` to understand the current site context.
2. Fetch the live page (or use `/analyze-site`) to discover real selectors before writing any code.
3. Add locators and methods to the relevant page object in `src/pages/` — never use raw `page.locator()` calls in a spec file body.
4. Write the spec in the correct `tests/<category>/` folder.
5. Tag every `test()` with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`, `@regression`.
6. Run `npx tsc --noEmit` before committing and fix any errors.

### Rules

| Rule | Why |
|------|-----|
| Never submit a form | Avoids spamming real company inboxes |
| Never create accounts or log in | Site is public; no credentials needed |
| Never hardcode URLs | Use `siteConfig.url` so tests work against any environment |
| Never use `page.waitForTimeout()` | Use Playwright's built-in auto-waiting (`waitForSelector`, etc.) |
| Never put `expect()` inside page objects | Keeps objects reusable; assertions belong in tests |
| No `any` type without comment | TypeScript strict mode must pass cleanly |

### Before Opening a PR

- [ ] All page interactions go through page object methods
- [ ] Every test is tagged
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] No form submissions, account creation, or hardcoded URLs
- [ ] Tests are independent (each passes when run alone)
- [ ] Visual baselines updated if UI changes are intentional (`npm run baseline`)

---

## Claude Code Integration

This repo is configured for AI-assisted test authoring and maintenance via [Claude Code](https://code.claude.com). The `CLAUDE.md` file at the root provides persistent instructions that Claude reads at the start of every session.

### Slash Commands (Skills)

Invoke these inside a Claude Code session by typing the command:

| Command | Description |
|---------|-------------|
| `/analyze-site` | Crawl the live site and update `site.config.json` |
| `/generate-full-suite` | Generate POM classes + tests for all discovered pages |
| `/run-smoke` | Run `@smoke` tests and return a formatted summary |
| `/update-baseline` | Refresh visual regression snapshot baselines |
| `/generate-report` | Summarize the latest `test-results/results.json` |

See `SKILLS.md` for full documentation on each command.

### Sub-Agents

| Agent | Purpose |
|-------|---------|
| `site-analyzer` | Crawls the live site; produces an accurate `site.config.json` |
| `test-generator` | Generates site-specific POM classes and spec files |

See `AGENTS.md` for full agent documentation.

---

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions. The workflow is at `.github/workflows/playwright.yml`.

**What the CI pipeline does:**
1. Installs Node.js 20 and dependencies
2. Installs Playwright browsers
3. Runs all tests in headless mode with 2 workers
4. Uploads the Playwright HTML report as an artifact (retained 7 days)
5. Uploads `test-results/` as an artifact (retained 3 days)

To trigger a manual run:
- Go to **Actions** > **Playwright Tests** > **Run workflow** > **Run**.

---

## Visual Baselines

Visual regression tests compare screenshots against baselines stored in `__snapshots__/`. Baselines are committed to the repo and must be updated intentionally.

After a confirmed UI change, update baselines:

```bash
npm run baseline
# or from a Claude Code session:
/update-baseline
```

Then commit the new baseline files alongside the code change that caused them.

---

## About the Site Under Test

**Product:** Campground Master  
**Company:** Cottonwood Software, LLC  
**URL:** http://www.cottonwoodsoftware.com  
**Description:** Reservation management software for campgrounds, RV parks, marinas, and similar venues. One-time purchase, no monthly fees. Windows desktop application.

**Key pages covered by this test suite:**

| Page | Path | Tests |
|------|------|-------|
| Homepage | `/` | smoke, visual, responsive |
| Features | `/features.html` | functional |
| Free Demo | `/free_demo.html` | functional |
| Pricing | `/order.html` | functional |
| Support / FAQ | `/faq.html` | functional |
| Contact | `/contact.html` | navigation |
| Maps | `/maps.html` | regression |
| Online Reservations | `/online.html` | regression |
| Point of Sale | `/pos.html` | regression |
| Networking | `/networking.html` | regression |
| Credit Cards | `/creditcards.html` | regression |
| Testimonials | `/testimonials.html` | regression |
| Downloads | `/downloads.html` | regression |
