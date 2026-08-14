## Summary

What does this PR do? (1-3 bullet points)

-
-
-

## Type of Change

- [ ] New test(s)
- [ ] Updated test(s) — selector or assertion fix
- [ ] New page object or page object update
- [ ] Infrastructure / config change
- [ ] Documentation update

## Pages or Features Covered

List the pages or features this PR adds or changes test coverage for.

## Checklist

- [ ] All page interactions go through page object methods (no raw `page.locator()` in spec files)
- [ ] Every new test is tagged (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`, or `@regression`)
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] No form submissions, account creation, or real credentials used
- [ ] No hardcoded URLs — all tests derive URLs from `siteConfig.url`
- [ ] Tests pass locally (`npm test` or targeted suite)
- [ ] Visual baselines updated and committed if screenshot tests changed (`npm run baseline`)

## How to Test This PR

```bash
# Run the affected test file directly
npx playwright test tests/<category>/<file>.spec.ts
```

## Related Issues

Closes #
