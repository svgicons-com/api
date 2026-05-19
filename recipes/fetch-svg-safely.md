# Fetch SVG Safely

## Status

Live API.

## Problem

You need SVG markup for a selected icon without exposing your Pro API token or assuming the API performs every rendering, accessibility, or theming transformation for you.

## When To Use This

Use this recipe for build scripts, internal design tools, server-rendered previews, and sprite generation.

## API Endpoints Used

- `GET /api/pro/icons/{icon}/svg`

## SDK Methods Used

- `client.icons.getSvg()`

## Token Requirements

SVG retrieval requires `SVGICONS_API_TOKEN`. Keep the token on the server or in trusted CI.

## Step-By-Step

1. Search or store an icon id.
2. Fetch the SVG payload from the server side.
3. Treat returned SVG as markup from a third-party source and inject it only in trusted contexts.
4. Add accessibility labels, titles, or `aria-hidden` behavior in the consuming app.
5. Apply `currentColor` theming only when the icon markup and your rendering context support it.

## Copy-Paste Code

REST:

```bash
curl "https://svgicons.com/api/pro/icons/33716/svg" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

TypeScript SDK:

```ts
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

const response = await client.icons.getSvg({
  icon: 33716,
});

const svgMarkup = response.data.svg;
console.log(svgMarkup);
```

## Security Notes

Do not proxy arbitrary SVG injection to untrusted users without your own review or sanitization layer. The consuming app is responsible for context-appropriate escaping, accessibility labels, and display rules.

## Runnable Example

- [examples/svg-sprite-generator](../examples/svg-sprite-generator/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

The endpoint returns the SVG payload described by the OpenAPI spec. It does not guarantee that every icon is already optimized for your component API, accessibility policy, or color system.
