# Design-System Icons

Build an approved icon manifest for a design system from Svg/icons Pro API metadata and SVG payloads.

## Use Case

Design-system teams often need a reviewed icon set with stable names, usage notes, and provenance. This example reads an approved icon config, fetches real metadata and SVG strings through the SDK, and writes a manifest that a component library can review or consume.

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

## Configure Approved Icons

Edit `approved-icons.config.json`:

```json
{
  "output": "output/icons.manifest.json",
  "icons": [
    {
      "id": 33716,
      "usage": "Primary upward navigation action",
      "approvedName": "ArrowCircleUp"
    }
  ]
}
```

## Run

```bash
npm run build:manifest
```

The script uses `client.icons.getSvg()` and writes:

```text
output/icons.manifest.json
```

## Review Guidance

The manifest includes only fields returned by the real Pro API: icon id, name, dimensions, page/SVG URLs, SVG payload, and icon-set metadata such as license, license URL, SPDX identifier, author, and source page when present.

If license or provenance fields are missing for a source set, the manifest preserves that uncertainty. Treat this as a developer workflow for review and governance, not a replacement for legal review.

## Security Notes

Run this script in Node.js, CI, or another trusted server-side environment. Do not expose `SVGICONS_API_TOKEN` to browser code.
