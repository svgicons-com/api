# Node Search Icons

Simple Node.js script that searches the live Svg/icons Pro API and prints icon metadata that is useful in design-system and internal-tool workflows.

## Use Case

Use this pattern when you need a small server-side script for finding icons by name, checking source set metadata, or collecting ids before adding icons to an Icon Collection.

## Links

- SDK package: [../../packages/js](../../packages/js)
- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- Token docs: https://svgicons.com/docs/api-tokens

## Setup

From this example directory:

```bash
npm install
copy .env.example .env
```

Edit `.env` and set:

```bash
SVGICONS_API_TOKEN=YOUR_API_TOKEN
```

On macOS/Linux use `cp .env.example .env`.

## Run

```bash
npm run search -- arrow
```

The script builds the local SDK workspace package first, then calls:

```ts
client.search.icons({ q: "arrow", limit: 10 })
```

Expected output shape:

```text
Search: arrow
Results: 10
- arrow-circle-up-fill [33716]
  set: Pro REST Icons (pro-rest-icons), license: MIT
  page: https://svgicons.com/icon/33716/arrow-circle-up-fill
```

## Security Notes

Keep `SVGICONS_API_TOKEN` server-side. This example is for Node.js scripts, CI jobs, and backend tooling. Do not copy this token into browser JavaScript.

The SDK is local in this repository. After the package is published, install with:

```bash
npm install @svgicons-com/api-client
```
