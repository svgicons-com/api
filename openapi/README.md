# OpenAPI

This directory contains the OpenAPI source for the live official svgicons.com Pro API.

## What This Spec Covers

`openapi/svgicons.openapi.yaml` documents the REST API mounted at:

```text
https://svgicons.com/api/pro
```

It covers:

- Pro API scope metadata discovery and authenticated account inspection.
- Icon search.
- Icon metadata and SVG payload reads.
- Single-icon PNG export.
- Icon Collection workflows under the current `project-kits` route segment.
- Icon Collection export create, status, and ZIP download routes.

## Authentication

The documented `/api/pro` operations require a svgicons.com Pro API token unless an operation explicitly declares otherwise in the OpenAPI `security` field.

At the time of this audit, `GET /api/pro/scopes` is the only `/api/pro` operation with `security: []`. It is metadata/discovery for the Pro API scope catalog only. It is not a free icon search, icon metadata, SVG, PNG export, Project Kit, or export API.

All icon search, icon metadata, SVG retrieval, PNG export, Project Kit, and Project Kit export operations use bearer authentication with a Pro API token.

The server URL in the spec is:

```text
https://svgicons.com
```

## Source Of Truth

The svgicons.com website application owns the source OpenAPI JSON. The public production copy is:

```text
https://svgicons.com/openapi/pro-api.json
```

This API repo keeps a polished YAML copy generated from that source file. Maintainers can re-sync it with:

```bash
npm run sync:openapi
```

The sync script resolves the website source from `SVGICONS_WEBSITE_OPENAPI` or a sibling website checkout (`../svgicons/public/openapi/pro-api.json`). Besides polish (tags, descriptions, examples), `scripts/sync-openapi.mjs` contains a `patchLiveContractDeltas` step that layers documented live contract additions on top of the source file when the source has not been regenerated yet — currently the `all_variants`/`edit_id` parameters on the remove-icon operation, the `entryId`/`customEditId`/`customName` entry fields, `styledWith` on kit summaries, and `hasCustomIcons` on the detail response. Each patch should be deleted once the website regenerates `pro-api.json` with that addition, keeping the generated YAML identical either way.

The full sync procedure for a contract change:

1. Regenerate or patch the website's `public/openapi/pro-api.json` in the website repo (source of truth), or add a temporary patch to `patchLiveContractDeltas` when only the public copy can move.
2. Run `npm run sync:openapi` in this repo.
3. Run `npm run validate` (checks sync freshness and lints with Redocly).
4. Commit the YAML and the script together.

## Validation

Run the repository checks:

```bash
npm run validate
```

Run only the OpenAPI sync and lint checks:

```bash
npm run validate:openapi
```

When the website source file is available locally, validation checks that the YAML is synchronized with it. In public clones or CI where the website repo is not present, validation checks the committed YAML contract and runs OpenAPI linting with Redocly CLI.

## SDK And Examples

SDKs and examples should use `openapi/svgicons.openapi.yaml` as their contract source. Example requests and responses live in [examples/](examples/) and must match live `/api/pro` behavior.

Binary endpoints return bytes. Example files describe their content type and download metadata rather than pretending the API returns JSON.

## Not Included

These are not live REST endpoints and must not be added to this OpenAPI file as stable operations:

- `/api/v1/icons/search`
- `/api/v1/icons/{set}/{name}`
- `/api/v1/icons/{set}/{name}/svg`
- `/api/v1/icon-sets`
- `/api/v1/icon-sets/{set}`
- Dedicated `/api/pro/icon-sets` endpoints.
- Public REST token-management endpoints.
- Public REST usage-reporting endpoints.

MCP is a separate JSON-RPC API surface over:

```text
POST /mcp
```

Document MCP workflows separately and link to https://svgicons.com/developers/mcp when useful.
