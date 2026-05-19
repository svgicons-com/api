# Export Icons To Frameworks

## Status

Live API + CLI workflow.

## Problem

You can search and organize icons through the Pro API, but application teams often need framework-ready output such as React, Vue, Svelte, Solid, Blade, Storybook, package scaffolds, PNG packs, or Iconify JSON.

## When To Use This

Use this recipe when API-selected icons should move into a framework export workflow without inventing a REST endpoint that does not exist.

## API Endpoints Used

- `GET /api/pro/search`
- `POST /api/pro/project-kits`
- `POST /api/pro/project-kits/{projectKit}/icons`
- `POST /api/pro/project-kits/{projectKit}/icons/bulk`
- `POST /api/pro/project-kits/{projectKit}/exports`
- `GET /api/pro/project-kits/{projectKit}/exports/{export}`
- `GET /api/pro/project-kits/{projectKit}/exports/{export}/download`

## SDK Methods Used

- `client.search.icons()`
- `client.projectKits.create()`
- `client.projectKits.icons.add()`
- `client.projectKits.icons.addBulk()`
- `client.projectKits.exports.create()`
- `client.projectKits.exports.get()`
- `client.projectKits.exports.download()`

## Token Requirements

API selection and Project Kit operations require `SVGICONS_API_TOKEN`. CLI workflows can also use `SVGICONS_API_TOKEN` or the CLI-supported token configuration.

## Step-By-Step

1. Search icons with the API or SDK.
2. Save selected icon ids.
3. Create or update a Project Kit.
4. Add icons to the Project Kit.
5. Queue or download API exports supported by the OpenAPI spec.
6. Use the CLI for framework-oriented export commands confirmed by the CLI repo.

## Copy-Paste Code

API preparation:

```ts
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

const kit = await client.projectKits.create({
  name: "Dashboard icons",
  framework: "react-ts",
  colorPolicy: "currentColor",
});

await client.projectKits.icons.addBulk({
  projectKit: kit.data.id,
  icons: [33716],
});

await client.projectKits.exports.create({
  projectKit: kit.data.id,
  formats: ["react-ts", "vue", "license-manifest"],
  options: {
    typescript: true,
    defaultSize: 24,
  },
});
```

CLI companion commands:

```bash
svgicons collection export "Dashboard icons" --formats react-ts,vue --output ./exports
svgicons collection export "Dashboard icons" --formats svelte --output ./exports
svgicons collection export "Dashboard icons" --formats iconify-json --output ./exports
svgicons license export --format markdown --output THIRD_PARTY_ICONS.md
```

## Security Notes

Run token-backed API and CLI commands in trusted environments. Do not put export tokens or generated token-bearing logs in client-side code.

## Runnable Example

- [examples/framework-export-workflow](../examples/framework-export-workflow/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [Svg/icons CLI repo](https://github.com/svgicons-com/cli)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

Framework-specific export workflows are CLI-driven where the CLI provides the richer command surface. Do not assume a dedicated REST framework-export endpoint beyond the Project Kit export routes documented in OpenAPI.
