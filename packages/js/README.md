# `@svgicons-com/api-client`

Typed JavaScript and TypeScript client for the official svgicons.com Pro API.

## What Is svgicons.com?

[svgicons.com](https://svgicons.com) is an icon platform for searching, organizing, exporting, and integrating open-source SVG icons into developer workflows. It provides website search and browsing, Icon Collections, export workflows, MCP/AI coding workflows, and a token-authenticated Pro REST API.

This package is the official SDK for that Pro REST API. It talks to the live `/api/pro` API, uses `fetch`, outputs ESM, and includes TypeScript declarations.

## Authentication Required

The SDK is for svgicons.com Pro API workflows. A svgicons.com Pro API token key is required for icon search, icon metadata, SVG retrieval, PNG export, Icon Collections, and collection export operations.

Use `SVGICONS_API_TOKEN` for environment variables and `YOUR_API_TOKEN` as a placeholder in examples:

```bash
export SVGICONS_API_TOKEN="YOUR_API_TOKEN"
```

Keep Pro API tokens server-side. Do not expose them in public browser JavaScript, client-side environment variables, mobile app bundles, logs, screenshots, or public issues.

`client.scopes.list()` calls `GET /api/pro/scopes`, which is metadata/discovery for the Pro API scope catalog. It does not return icons and is not a free public icon API.

## Install

```bash
npm install @svgicons-com/api-client
```

For local development in the repository, use the workspace package:

```bash
npm install
npm run build
```

## Quick Start

```ts
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

const results = await client.search.icons({
  q: "arrow",
  limit: 20,
});

console.log(results.data[0]?.name);
```

Use a custom base URL only when you are intentionally targeting another compatible deployment:

```ts
const client = new SvgiconsClient({
  token: "YOUR_API_TOKEN",
  baseUrl: "https://svgicons.com",
});
```

## Search Icons

```ts
const response = await client.search.icons({
  q: "settings",
  page: 1,
  limit: 10,
});

for (const icon of response.data) {
  console.log(icon.id, icon.name, icon.iconSet?.license);
}
```

## Get Icon Metadata

```ts
const icon = await client.icons.get({
  icon: 33716,
});

console.log(icon.data.pageUrl);
```

## Get SVG Payload

`GET /api/pro/icons/{icon}/svg` returns JSON with SVG fields, not a raw SVG response.

```ts
const icon = await client.icons.getSvg({
  icon: 33716,
});

console.log(icon.data.svg);
```

## Project Kits

The product name is Icon Collections. The current REST API route uses the historical `project-kits` path segment.

```ts
const created = await client.projectKits.create({
  name: "Dashboard icons",
  framework: "react-ts",
  colorPolicy: "currentColor",
  namingPolicy: "pascal",
});

await client.projectKits.icons.add({
  projectKit: created.data.id,
  icon: 33716,
});
```

## Exports

```ts
const exportJob = await client.projectKits.exports.create({
  projectKit: 123,
  formats: ["react-ts", "vue", "license-manifest"],
  options: {
    typescript: true,
    defaultSize: 24,
  },
});

const status = await client.projectKits.exports.get({
  projectKit: 123,
  export: exportJob.data.id,
});

if (status.data.downloadUrl) {
  const zip = await client.projectKits.exports.download({
    projectKit: 123,
    export: status.data.id,
  });

  console.log(zip.contentType, zip.data.byteLength);
}
```

## Single-Icon PNG Export

```ts
const png = await client.icons.exportPng({
  icon: 33716,
  iconName: "arrow-circle-up-fill",
  sizes: [512],
  densities: [1],
  backgroundType: "transparent",
});

console.log(png.contentType, png.data.byteLength);
```

## Error Handling

```ts
import { ApiError } from "@svgicons-com/api-client";

try {
  await client.search.icons({ q: "arrow", limit: 101 });
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.status, error.message, error.body);
  }
}
```

The SDK does not publish fixed REST rate-limit numbers. Handle any non-2xx response through `ApiError`.

## Covered Methods

- `client.scopes.list()`
- `client.me.get()`
- `client.search.icons()`
- `client.icons.get()`
- `client.icons.getSvg()`
- `client.icons.exportPng()`
- `client.projectKits.list()`
- `client.projectKits.create()`
- `client.projectKits.get()`
- `client.projectKits.update()`
- `client.projectKits.delete()`
- `client.projectKits.icons.add()`
- `client.projectKits.icons.addBulk()`
- `client.projectKits.icons.remove()`
- `client.projectKits.exports.create()`
- `client.projectKits.exports.get()`
- `client.projectKits.exports.download()`

The SDK does not include `/api/v1`, dedicated icon-set REST endpoints, token-management endpoints, usage-reporting endpoints, or MCP JSON-RPC methods.

## Links

- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- Token docs: https://svgicons.com/docs/api-tokens
- API repo: https://github.com/svgicons-com/api
