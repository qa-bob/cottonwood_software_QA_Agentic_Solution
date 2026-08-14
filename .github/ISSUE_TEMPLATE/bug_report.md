---
name: Bug Report
about: Report a failing or flaky test
title: '[BUG] '
labels: bug
assignees: ''
---

## Test That Is Failing

Provide the full test name from the Playwright output, e.g.:
`Navigation @navigation > all nav links are reachable (no 404s)`

## How to Reproduce

```bash
# Command used to run the test
npx playwright test tests/navigation/nav-links.spec.ts
```

## Expected Behavior

What should the test do?

## Actual Behavior

What does it do instead? Paste the relevant error output below.

```
[paste error here]
```

## Environment

- OS:
- Node.js version (`node -v`):
- Playwright version (`npx playwright --version`):
- Browser project (chromium-desktop / mobile-chrome / tablet):
- CI or local?

## Possible Cause

Is this a test bug (wrong selector, wrong assertion) or a site change (the page HTML changed)?

- [ ] Test bug — the selector or assertion is wrong
- [ ] Site changed — the page HTML or behavior changed
- [ ] Flaky — passes sometimes, fails sometimes
- [ ] Unknown

## Additional Context

Add screenshots, traces, or links to CI run artifacts here.
