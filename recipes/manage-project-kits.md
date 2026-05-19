# Manage Project Kits

## Status

Live API.

## Problem

You need to create an Icon Collection, add selected icons, inspect the collection, queue an export, and download the generated artifact.

## When To Use This

Use this recipe for backend tools, build pipelines, and design-system workflows that need repeatable collection management through the Pro API.

## API Endpoints Used

- `GET /api/pro/project-kits`
- `POST /api/pro/project-kits`
- `GET /api/pro/project-kits/{projectKit}`
- `PATCH /api/pro/project-kits/{projectKit}`
- `DELETE /api/pro/project-kits/{projectKit}`
- `POST /api/pro/project-kits/{projectKit}/icons`
- `POST /api/pro/project-kits/{projectKit}/icons/bulk`
- `DELETE /api/pro/project-kits/{projectKit}/icons/{icon}`
- `POST /api/pro/project-kits/{projectKit}/exports`
- `GET /api/pro/project-kits/{projectKit}/exports/{export}`
- `GET /api/pro/project-kits/{projectKit}/exports/{export}/download`

## SDK Methods Used

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

## Token Requirements

Project Kit reads and writes require a Pro API token with the relevant collection and export access.

## Step-By-Step

1. Create a Project Kit.
2. Add one icon or bulk add icon ids.
3. Fetch the Project Kit to inspect icons and license summary fields.
4. Queue an export with supported formats.
5. Poll export status.
6. Download the export artifact when it is complete.

## Copy-Paste Code

```ts
import { writeFile } from "node:fs/promises";
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

const kit = await client.projectKits.create({
  name: "Dashboard icons",
  framework: "react-ts",
  colorPolicy: "currentColor",
  namingPolicy: "pascal",
});

await client.projectKits.icons.add({
  projectKit: kit.data.id,
  icon: 33716,
});

await client.projectKits.icons.addBulk({
  projectKit: kit.data.id,
  icons: [33716],
});

const detail = await client.projectKits.get({
  projectKit: kit.data.id,
  perPage: 100,
});

console.log(detail.data.name, detail.icons.total);

const queued = await client.projectKits.exports.create({
  projectKit: kit.data.id,
  formats: ["react-ts", "license-manifest"],
  options: {
    typescript: true,
    defaultSize: 24,
  },
});

const latest = await client.projectKits.exports.get({
  projectKit: kit.data.id,
  export: queued.data.id,
});

if (latest.data.status === "completed") {
  const artifact = await client.projectKits.exports.download({
    projectKit: kit.data.id,
    export: latest.data.id,
  });
  await writeFile(artifact.filename ?? "svgicons-export.zip", Buffer.from(artifact.data));
}
```

## Security Notes

Run Project Kit write operations from trusted tooling. Keep token values out of logs and avoid exposing collection mutation routes directly to public users.

## Runnable Example

- [examples/framework-export-workflow](../examples/framework-export-workflow/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

The REST route segment is currently `project-kits` even when the product language says Icon Collections. Dedicated icon-set REST endpoints are not live.
