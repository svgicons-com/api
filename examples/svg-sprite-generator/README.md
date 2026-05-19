# SVG Sprite Generator

Generate a simple SVG sprite from icon ids using the live Svg/icons Pro API and the local TypeScript SDK package.

## Use Case

Use this pattern when an app or design system needs a small checked-in sprite built from a known list of icon ids.

The script reads `icons.config.json`, calls `client.icons.getSvg()` for each icon, wraps SVG bodies as `<symbol>` elements, and writes `dist/sprite.svg`.

## Links

- SDK package: [../../packages/js](../../packages/js)
- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- Token docs: https://svgicons.com/docs/api-tokens

## Setup

```bash
npm install
copy .env.example .env
```

Edit `.env`:

```bash
SVGICONS_API_TOKEN=YOUR_API_TOKEN
```

On macOS/Linux use `cp .env.example .env`.

## Configure Icons

Edit `icons.config.json`:

```json
{
  "output": "dist/sprite.svg",
  "icons": [
    {
      "id": 33716,
      "symbol": "icon-arrow-circle-up-fill"
    }
  ]
}
```

## Run

```bash
npm run generate
```

Use the generated sprite:

```html
<svg aria-hidden="true">
  <use href="#icon-arrow-circle-up-fill"></use>
</svg>
```

## Limitations

This example intentionally performs simple SVG handling only:

- It does not optimize paths.
- It does not rewrite ids inside SVG bodies.
- It does not normalize fills, strokes, masks, gradients, or clip paths.
- It assumes the returned `body` can be placed inside a `<symbol>` for your chosen icon set.

For production build systems, review generated output, run your own SVG optimizer if needed, and keep license/provenance review in your release process.

## Security Notes

Run this script in Node.js, CI, or another trusted server-side environment. Do not expose `SVGICONS_API_TOKEN` to browser code.
