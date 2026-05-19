# Search Icons

## Status

Live API.

## Problem

You need to find candidate icons by keyword from a script, backend service, or internal developer tool.

## When To Use This

Use this recipe when a server-side tool needs searchable icon results before choosing an icon id for rendering, SVG retrieval, or a Project Kit.

## API Endpoints Used

- `GET /api/pro/search`

## SDK Methods Used

- `client.search.icons()`

## Token Requirements

`GET /api/pro/search` requires a Pro API token. Store it in `SVGICONS_API_TOKEN` or a secret manager.

## Step-By-Step

1. Create a Pro API token from the Svg/icons token page.
2. Store the token as `SVGICONS_API_TOKEN`.
3. Call `/api/pro/search` with `q` or `query`.
4. Use `limit`, `offset`, or `page` only as described in the OpenAPI spec.
5. Store selected icon ids, not SVG markup, when you want repeatable downstream workflows.

## Copy-Paste Code

Curl:

```bash
curl "https://svgicons.com/api/pro/search?q=arrow&limit=20&page=1" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

TypeScript SDK:

```ts
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

const results = await client.search.icons({
  q: "arrow",
  limit: 20,
  page: 1,
});

for (const icon of results.data) {
  console.log(`${icon.id}: ${icon.name} (${icon.iconSet?.name ?? "unknown set"})`);
}
```

## Security Notes

Run search from server-side code, internal tools, or CI. Do not ship a private Pro API token in browser JavaScript.

## Runnable Example

- [examples/node-search-icons](../examples/node-search-icons/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

Search returns the metadata exposed by the live API. It does not expose dedicated `/api/pro/icon-sets` REST endpoints, and `/api/v1` search routes are not live.
