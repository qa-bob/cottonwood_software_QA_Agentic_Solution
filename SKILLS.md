# SKILLS.md

This file documents all slash commands (skills) available in this repository for Claude Code sessions. Skills are defined in `.claude/commands/` and invoked with a `/` prefix.

---

## Overview

| Command | File | Agent Used |
|---------|------|-----------|
| `/analyze-site` | `.claude/commands/analyze-site.md` | `site-analyzer` |
| `/generate-full-suite` | (built-in skill) | `test-generator` |
| `/run-smoke` | `.claude/commands/run-smoke.md` | none (runs npm script) |
| `/update-baseline` | `.claude/commands/update-baseline.md` | none (runs npm script) |
| `/generate-report` | `.claude/commands/generate-report.md` | none (reads results file) |

---

## /analyze-site

**File:** `.claude/commands/analyze-site.md`  
**Agent:** `site-analyzer`

Crawls the live site at the URL in `site.config.json` and produces an updated config plus a site-structure report.

**What it reports:**
- All navigation links with their target URLs and HTTP status
- Forms detected (field inventory: name, type, required flag)
- Interactive elements found (accordions, tabs, video embeds, download links)
- Mismatches between current nav and `expectedNavItems`
- SEO signals: meta description presence, `<title>` content, canonical URL
- Any redirect chains encountered

**What it updates:**
- `site.config.json` — `expectedNavItems`, `hasContactForm`, `skipForms`, `description`, `industry`

**When to use:**
- Before running `/generate-full-suite` on a repo that has never been analyzed
- After a confirmed site redesign
- When tests are failing because the nav structure changed

---

## /generate-full-suite

**Built-in skill** (no separate command file — invoke via the `generate-full-suite` skill)  
**Agent:** `test-generator`

Analyzes all pages reachable from the site's navigation and generates a complete test suite from scratch.

**What it creates:**
- One POM class per discovered page in `src/pages/<page-name>.page.ts`
- Smoke, navigation, functional, and visual test files in the appropriate `tests/` subfolder
- Updated `src/fixtures/site.fixture.ts` wiring up new page objects
- A gap report listing pages discovered but not yet covered by tests

**When to use:**
- Initial setup of a new site repo after `/analyze-site` has run
- After a major site redesign that invalidates most existing selectors

---

## /run-smoke

**File:** `.claude/commands/run-smoke.md`

Runs the `@smoke` test suite and returns a structured summary.

**What it runs:** `npm run test:smoke`

**What it reports:**
- Pass / fail / skip counts
- Names and error messages for any failing tests
- Page load time measurements
- Console error summary (with known-benign errors filtered out)

**When to use:**
- Quick health check before starting a longer session
- After a dependency update to confirm nothing is broken
- In CI status checks before merging

---

## /update-baseline

**File:** `.claude/commands/update-baseline.md`

Refreshes visual regression snapshot baselines in `__snapshots__/`.

**What it runs:** `npm run baseline` (Playwright `--update-snapshots` flag)

**Pre-flight checks performed:**
1. Confirms the site is reachable
2. Warns if there are uncommitted changes that would be overwritten
3. Runs with `chromium-desktop` project only (canonical baseline project)

**When to use:**
- After an intentional UI change has been verified as correct in the browser
- When snapshot diffs are failing due to a known, accepted change

**Note:** Always commit updated baselines alongside the code change that caused them. Do not commit baseline updates alone without an accompanying code change.

---

## /generate-report

**File:** `.claude/commands/generate-report.md`

Reads `test-results/results.json` from the most recent test run and generates a human-readable summary.

**What it reports:**
- Total: passed / failed / skipped / flaky
- Failing test names with truncated error messages
- Slowest tests (> 10 seconds)
- Browser project breakdown
- Recommendations for follow-up (e.g., "3 navigation tests failing — check if nav HTML changed")

**When to use:**
- After `npm test` in CI to interpret the raw JSON results
- When sharing a test results summary with a stakeholder

---

## Adding a New Skill

1. Create `.claude/commands/<skill-name>.md` describing what the command does step by step.
2. Add a row to the overview table in this `SKILLS.md` file.
3. Add a full section below documenting inputs, outputs, and when to use it.
4. If the skill delegates to a sub-agent, document the agent in `AGENTS.md` too.
