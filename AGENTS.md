# AGENTS.md

This file documents the Claude Code sub-agents configured for this repository. Agents are defined in `.claude/agents/` and invoked by Claude Code during a session — either automatically when appropriate or explicitly via slash commands.

---

## Overview

| Agent | File | Trigger |
|-------|------|---------|
| `site-analyzer` | `.claude/agents/site-analyzer.md` | `/analyze-site` or onboarding |
| `test-generator` | `.claude/agents/test-generator.md` | `/generate-full-suite` or on request |

---

## site-analyzer

**File:** `.claude/agents/site-analyzer.md`

### Purpose

Crawls the live website defined in `site.config.json`, inspects its DOM, and produces an updated `site.config.json` with all fields populated from real page content. This ensures selectors, nav item expectations, and feature flags reflect the actual current site rather than stale assumptions.

### When to Invoke

- First-time setup of a new company repo
- After a confirmed site redesign to re-validate selectors and nav structure
- When `/analyze-site` is run from a Claude Code session
- When `expectedNavItems` in `site.config.json` appears stale or empty

### Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `url` | Yes | The site URL to analyze (read from `site.config.json`) |
| `companyName` | No | Override for the company name (else inferred from `<title>`) |

### Outputs

1. Updated `site.config.json` with all fields populated
2. An issues checklist (e.g., missing meta description, auth-gating detected, dead links)
3. A confidence assessment: **High** / **Medium** / **Low** with reasoning

### Behavior Rules

- Never authenticates unless credentials are in `site.config.json auth` fields
- Dismisses cookie consent banners before inspecting structure
- Resolves redirect chains and uses the final canonical URL
- Waits for `networkidle` before DOM inspection (handles SPAs)
- Sets `skipForms: true` when no form with an email field is found
- Sets `hasContactForm: false` when contact page contains only text/links

---

## test-generator

**File:** `.claude/agents/test-generator.md`

### Purpose

Reads the populated `site.config.json` and generates site-specific Playwright test files for functionality that the generic shared framework does not cover. Output lands in `tests/custom/` by default, or in the appropriate category folder when the feature maps cleanly to an existing suite.

### When to Invoke

- `/generate-full-suite` is run from a Claude Code session
- A site has unique functionality (pricing calculators, live chat, video embeds, accordion FAQs)
- Generic selectors fail because the site uses unusual HTML structure
- Writing regression tests for a recently discovered bug

### Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `siteConfig` | Yes | The populated `site.config.json` |
| `testScenarios` | No | Plain-language descriptions of scenarios to cover |
| `pagesToTest` | No | Specific page paths to target (e.g., `/pricing.html`) |

### Outputs

TypeScript spec files written to `tests/custom/<kebab-case-scenario>.spec.ts` (or the appropriate suite folder).

Each generated file must:
1. Start with a comment block explaining what is tested and why it is site-specific
2. Import from `@fixtures/site.fixture`
3. Tag all tests appropriately
4. Compile under TypeScript strict mode
5. Not submit any forms or create accounts

---

## Shared Agent Rules

All agents in this repository must follow these rules, which mirror the CLAUDE.md project instructions:

1. **Read `site.config.json` first** before writing any selectors or test code.
2. **Fetch the live page** using `WebFetch` or a browser tool before generating selectors — never guess at HTML structure.
3. **Follow POM architecture** — selectors go in `src/pages/`, assertions go in `tests/`.
4. **Verify TypeScript** — all generated code must compile cleanly with `npx tsc --noEmit`.
5. **Tag every test** with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`, `@regression`.
6. **Never submit forms**, create accounts, or use `page.waitForTimeout()`.

---

## Adding a New Agent

1. Create `.claude/agents/<agent-name>.md` following the existing format.
2. Document the agent in this `AGENTS.md` file (add a row to the overview table and a full section).
3. Optionally wire the agent to a slash command by creating `.claude/commands/<command-name>.md`.
4. Reference the new command in `SKILLS.md`.
