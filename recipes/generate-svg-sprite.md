# Generate An SVG Sprite

## Status

Live API.

## Problem

You have selected icon ids and want a simple sprite file for static sites, design-system demos, or internal assets.

## When To Use This

Use this recipe when a build step can fetch SVG payloads from trusted icon ids and write a local `sprite.svg` artifact.

## API Endpoints Used

- `GET /api/pro/icons/{icon}/svg`

## SDK Methods Used

- `client.icons.getSvg()`

## Token Requirements

The build script needs `SVGICONS_API_TOKEN`.

## Step-By-Step

1. Keep selected icon ids in a JSON config.
2. Fetch each SVG with `client.icons.getSvg()`.
3. Extract the inner SVG content with a simple transform.
4. Wrap each entry in a `<symbol>`.
5. Write `dist/sprite.svg`.
6. Reference symbols with `<svg><use href="#icon-name" /></svg>`.

## Copy-Paste Code

Config:

```json
{
  "icons": [
    { "id": 33716, "symbol": "arrow-circle-up" }
  ]
}
```

Script outline:

```ts
import { writeFile } from "node:fs/promises";
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

const icon = await client.icons.getSvg({ icon: 33716 });
const svg = icon.data.svg;
const body = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="arrow-circle-up" viewBox="${icon.data.viewBox}">
    ${body}
  </symbol>
</svg>`;

await writeFile("dist/sprite.svg", sprite);
```

Usage:

```html
<svg aria-hidden="true"><use href="#arrow-circle-up"></use></svg>
```

## Security Notes

Generate sprites from reviewed icon ids. If users can choose arbitrary icons or upload SVG, add your own review and sanitization layer.

## Runnable Example

- [examples/svg-sprite-generator](../examples/svg-sprite-generator/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

The simple string transform is intentionally limited. Production optimizers may need stronger SVG parsing, duplicate id handling, title removal, and attribute normalization.
