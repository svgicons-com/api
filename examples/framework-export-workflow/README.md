# Framework Export Workflow

Prepare icons for React, Vue, Svelte, and other framework export workflows using the live Pro API and the existing Svg/icons CLI.

## Use Case

Frontend teams often discover icons through an API workflow, then need framework-specific output for application code. This example shows how to create an Icon Collection through `/api/pro`, add selected icons, queue an export, and then use the CLI for framework-oriented export/download commands.

## Links

- SDK package: [../../packages/js](../../packages/js)
- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- Token docs: https://svgicons.com/docs/api-tokens
- CLI repo: https://github.com/svgicons-com/cli

## What Is Live

The Pro REST API supports:

- Search and icon reads.
- Project Kit/Icon Collection create, update, delete, add icons, and bulk add icons.
- Collection export create, status, and download.

The CLI supports framework-ready export workflows such as:

```bash
svgicons collection export "Dashboard icons" --formats react-ts,vue --output ./exports
svgicons collection export "Dashboard icons" --formats svelte --output ./exports
svgicons collection export "Dashboard icons" --formats solid --output ./exports
svgicons collection export "Dashboard icons" --formats blade --output ./exports
svgicons collection export "Dashboard icons" --formats storybook --output ./exports
svgicons collection export "Dashboard icons" --formats npm-package --package-name svgicons-dashboard-icons --output ./exports
svgicons collection export "Dashboard icons" --formats iconify-json --output ./exports
```

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

## Configure

Edit `selected-icons.json` with a Project Kit name, selected icon ids, and export options supported by the OpenAPI spec.

## Run

```bash
npm run prepare:export
```

The script uses:

- `client.projectKits.create()`
- `client.projectKits.icons.add()`
- `client.projectKits.exports.create()`

It prints CLI companion commands for polling and downloading framework exports.

## Suggested Workflow

1. Search icons with the API or SDK.
2. Add approved ids to `selected-icons.json`.
3. Create or update an Icon Collection with the API.
4. Queue/download exports with the API or use `svgicons collection export` for framework output.
5. Review generated `license-manifest.json` and framework files before shipping.

## Security Notes

Run API and CLI commands in trusted environments. Keep `SVGICONS_API_TOKEN` in server-side environment variables or CI secrets, not frontend code.
