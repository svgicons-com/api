# Use Svg/icons In CI

## Status

Live API + CLI workflow.

## Problem

Teams want repeatable CI checks for icon metadata and provenance without committing API tokens or overclaiming legal compliance.

## When To Use This

Use this recipe when CI should generate a report, compare selected icons against team policy, or fail only on explicitly defined project rules.

## API Endpoints Used

- `GET /api/pro/icons/{icon}`

## SDK Methods Used

- `client.icons.get()`

## Token Requirements

Store `SVGICONS_API_TOKEN` as a CI secret. Do not put token values in workflow files.

## Step-By-Step

1. Add selected icon ids to a config file.
2. Store `SVGICONS_API_TOKEN` in CI secrets.
3. Run a script that fetches metadata through the SDK.
4. Write Markdown or JSON output for review.
5. Fail CI only when your own policy code says to fail.
6. Use the CLI for lockfile-based license checks when that matches your repo workflow.

## Copy-Paste Code

GitHub Actions workflow:

```yaml
name: Icon provenance

on:
  pull_request:
  workflow_dispatch:

jobs:
  icon-provenance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run report
        working-directory: examples/ci-license-audit
        env:
          SVGICONS_API_TOKEN: ${{ secrets.SVGICONS_API_TOKEN }}
      - uses: actions/upload-artifact@v4
        with:
          name: icon-provenance
          path: examples/ci-license-audit/output/
```

Minimal policy idea:

```js
const allowedLicenses = new Set(["MIT", "Apache-2.0", "ISC"]);

if (!allowedLicenses.has(icon.iconSet?.spdx ?? "")) {
  process.exitCode = 1;
}
```

## Security Notes

Never print `SVGICONS_API_TOKEN`. Mask CI output, avoid debug logs around headers, and rotate a token immediately if it appears in logs or artifacts.

## Runnable Example

- [examples/ci-license-audit](../examples/ci-license-audit/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [Svg/icons CLI repo](https://github.com/svgicons-com/cli)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

CI reports are not legal advice. They should support team-defined review and provenance policy, not claim automatic legal compliance.
