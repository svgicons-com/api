# `@svgicons-com/api-client`

Status: alpha package source. It is implemented in this repository, but it has not been published to npm yet.

This package is a typed TypeScript client for the live official svgicons.com Pro API under `/api/pro`. It uses `fetch`, outputs ESM, and keeps Pro API tokens in caller-controlled code.

## Install

Install from npm after the package is published:

```bash
npm install @svgicons-com/api-client
```

For local development in this repository, use the workspace package:

```bash
npm install
npm run build
```

## Token Setup

Create a svgicons.com Pro API token from your Svg/icons account and keep it server-side.

```bash
export SVGICONS_API_TOKEN="YOUR_API_TOKEN"
```

The SDK methods for icon search, icon metadata, SVG retrieval, PNG export, Project Kits, and Project Kit exports require a Pro API token. `client.scopes.list()` calls `GET /api/pro/scopes`, which is metadata/discovery for the Pro API scope catalog and does not return icons.

Do not expose Pro API tokens in public browser bundles. For frontend apps, call this SDK from a server route, backend service, CI job, or internal server-side tool.

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
