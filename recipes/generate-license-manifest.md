# Generate A License Manifest

## Status

Live API + CLI workflow.

## Problem

Teams need a repeatable way to review which icon sets appear in a project and what metadata Svg/icons exposes for those icons.

## When To Use This

Use this recipe for design-system governance, release review, and CI-generated third-party icon reports.

## API Endpoints Used

- `GET /api/pro/icons/{icon}`

## SDK Methods Used

- `client.icons.get()`

## Token Requirements

Icon metadata reads require `SVGICONS_API_TOKEN`.

## Step-By-Step

1. Keep selected icon ids in a JSON config.
2. Fetch metadata with `client.icons.get()`.
3. Read only fields returned by the live API, such as icon name, dimensions, page URL, SVG URL, and icon-set license/source metadata when present.
4. Write `THIRD_PARTY_ICONS.md` or a JSON report.
5. Review missing or uncertain metadata instead of treating it as automatically approved.

## Copy-Paste Code

```ts
import { writeFile } from "node:fs/promises";
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

const selectedIconIds = [33716];
const rows = ["# Third-Party Icons", ""];

for (const id of selectedIconIds) {
  const response = await client.icons.get({ icon: id });
  const icon = response.data;
  const set = icon.iconSet;

  rows.push(`## ${icon.name}`);
  rows.push("");
  rows.push(`- Icon id: ${icon.id}`);
  rows.push(`- Page: ${icon.pageUrl}`);
  rows.push(`- Icon set: ${set?.name ?? "Unknown"}`);
  rows.push(`- License: ${set?.license ?? "Not provided by API"}`);
  rows.push(`- SPDX: ${set?.spdx ?? "Not provided by API"}`);
  rows.push(`- Source: ${set?.pageUrl ?? "Not provided by API"}`);
  rows.push("");
}

await writeFile("THIRD_PARTY_ICONS.md", rows.join("\n"));
```

CLI companion:

```bash
svgicons license check --allow MIT,Apache-2.0,ISC --fail
svgicons license export --format markdown --output THIRD_PARTY_ICONS.md
svgicons license export --format json --output third-party-icons.json
```

## Security Notes

Keep tokens in CI secrets or local environment variables. Do not commit `.env` files or generated logs that include token values.

## Runnable Example

- [examples/ci-license-audit](../examples/ci-license-audit/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [Svg/icons CLI repo](https://github.com/svgicons-com/cli)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

This is a developer-friendly provenance/reporting workflow, not legal advice and not legal compliance automation. Use only metadata returned by the API or CLI workflow and have your team review policy decisions.
