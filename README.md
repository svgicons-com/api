# Svg/icons API

OpenAPI spec, SDK, examples, recipes, and developer use cases for the [svgicons.com](https://svgicons.com) Pro API.

This repository is the developer home for the official svgicons.com Pro API, the programmatic gateway to 320K+ open-source SVG icons. It documents the current Pro REST API, the hosted MCP endpoint as a related workflow, companion CLI workflows, and the alpha SDK package for teams that want to search, export, audit, and integrate open-source SVG icons in developer workflows.

- API docs: https://svgicons.com/developers/api
- MCP docs: https://svgicons.com/developers/mcp
- MCP repo: https://github.com/svgicons-com/mcp
- CLI repo: https://github.com/svgicons-com/cli
- API repo: https://github.com/svgicons-com/api

## Current Status

The live REST API is mounted at `https://svgicons.com/api/pro`. It uses scoped Pro API tokens created from a Svg/icons account. The current website OpenAPI document is published at:

```text
https://svgicons.com/openapi/pro-api.json
```

This repo keeps the API-repo OpenAPI source at [openapi/svgicons.openapi.yaml](openapi/svgicons.openapi.yaml). The TypeScript SDK package source lives in [packages/js](packages/js/) and should be treated as alpha until it is published to npm.

Recent contract additions documented by the spec:

- `DELETE /api/pro/project-kits/{projectKit}/icons/{icon}` accepts `all_variants` (boolean, defaults to `true` for backward compatibility — removes the plain entry plus any custom-icon variants; pass `false` to keep custom variants) and `edit_id` (integer — remove exactly one custom-icon variant, entry-precise). The MCP `remove_icon_from_collection` tool deliberately defaults the other way (entry-precise).
- Collection reads surface custom-icon entries created with the website's Icon Studio: every entry includes `entryId` (the entry row id), and custom-icon entries include `customEditId`, `customName`, and their customized SVG snapshot as the `body`.
- Kit summaries include `styledWith` (the style name when a collection was built by applying a style), and the collection detail response includes `hasCustomIcons`.

## Authentication Required

This repository documents the official svgicons.com Pro API. The documented `/api/pro` endpoints require a svgicons.com Pro API token unless an endpoint is explicitly documented otherwise by the OpenAPI source.

Pro API tokens are part of the [Pro Plan](https://svgicons.com/pricing) (€6/$7 per month or €69/$79 lifetime), and API usage is unlimited on Pro. On the website, Icon Collections are also available to free Member accounts through a one-time trial allowance of 15 Pro credits — that credit system applies to website actions only, never to API calls, because the API always requires a Pro token.

Examples use `SVGICONS_API_TOKEN` as the environment variable and `YOUR_API_TOKEN` as the placeholder token value. Do not expose Pro API tokens in public frontend JavaScript. Use server-side routes, backend proxies, server actions, secure workers, or CI jobs for token-authenticated API calls.

There is currently no official unauthenticated public icon REST API documented in this repository. Public browsing and searching are available on [svgicons.com](https://svgicons.com), but this repo's API workflows are token-authenticated Pro API workflows.

The only currently unauthenticated `/api/pro` endpoint in the OpenAPI source is `GET /api/pro/scopes`. It is API metadata/discovery for the Pro API scope catalog, not a free icon search or icon download API.

## Release Status

This repository documents the live svgicons.com Pro API. The SDK source is available in this repo, but the npm package has not been published yet.

- SDK npm publication: pending package review and release approval.
- Live REST API: `/api/pro`.
- Planned REST API: `/api/v1`, not live.
- MCP: separate JSON-RPC over `/mcp`.

See [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md), [docs/PUBLISHING.md](docs/PUBLISHING.md), and [docs/API_VERSIONING.md](docs/API_VERSIONING.md).

## What You Can Build

- Design-system icon picker backed by Svg/icons search.
- Command palette icon search for internal tools.
- SVG sprite generator for selected Icon Collections.
- React, Vue, and Svelte icon exports from Icon Collections.
- AI coding assistant and MCP workflows for icon search and collection generation.
- CI license/provenance audit using the companion CLI.

## Quick Start

List the current Pro API scopes. This API metadata endpoint does not require a token, but it does not search or return icons.

```bash
curl https://svgicons.com/api/pro/scopes
```

Search icons with a Pro API token.

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" "https://svgicons.com/api/pro/search?q=arrow"
```

Or keep the token in an environment variable:

```bash
export SVGICONS_API_TOKEN="YOUR_API_TOKEN"

curl "https://svgicons.com/api/pro/search?q=settings&limit=5" \
  -H "Authorization: Bearer $SVGICONS_API_TOKEN" \
  -H "Accept: application/json"
```

Fetch an icon SVG payload by id.

```bash
curl "https://svgicons.com/api/pro/icons/33716/svg" \
  -H "Authorization: Bearer $SVGICONS_API_TOKEN" \
  -H "Accept: application/json"
```

Create an Icon Collection. The current REST route still uses the historical `project-kits` path segment.

```bash
curl "https://svgicons.com/api/pro/project-kits" \
  -X POST \
  -H "Authorization: Bearer $SVGICONS_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Dashboard icons","framework":"react-ts","colorPolicy":"currentColor","namingPolicy":"pascal"}'
```

Queue a collection export after adding icons to the collection.

```bash
curl "https://svgicons.com/api/pro/project-kits/123/exports" \
  -X POST \
  -H "Authorization: Bearer $SVGICONS_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"formats":["react-ts","vue","license-manifest"],"options":{"typescript":true,"defaultSize":24}}'
```

## TypeScript SDK

The local workspace package is [packages/js](packages/js/) and is named `@svgicons-com/api-client`. It covers the live `/api/pro` REST operations only.

Install from npm after the package is published:

```bash
npm install @svgicons-com/api-client
```

For local development in this repository:

```bash
npm install
npm run build
```

Use it from server-side code, backend services, CI jobs, or internal tools so Pro API tokens stay out of public browser bundles.

```ts
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

const results = await client.search.icons({
  q: "arrow",
  limit: 20,
});

const svg = await client.icons.getSvg({
  icon: results.data[0]?.id ?? 33716,
});

console.log(svg.data.svg);
```

## Core Examples

- [Node search icons](examples/node-search-icons/) - server-side script using `client.search.icons()`.
- [Server-side token proxy](examples/server-side-token-proxy/) - local browser UI backed by a Node server that keeps the token private.
- [Next.js icon picker](examples/nextjs-icon-picker/) - App Router pattern with server-side route handlers and a client picker.
- [SVG sprite generator](examples/svg-sprite-generator/) - reads configured icon ids and writes a simple sprite using `client.icons.getSvg()`.

All core examples use live svgicons.com Pro API behavior under `/api/pro`. They require `SVGICONS_API_TOKEN` to run, and validation does not make real network calls.

## Advanced Examples

- [React command palette](examples/react-command-palette/) - command/search UI pattern backed by server-side API routes.
- [Design-system icons](examples/design-system-icons/) - approved icon manifest generation with source and license metadata.
- [CI license audit](examples/ci-license-audit/) - provenance report generation and a GitHub Actions workflow template.
- [AI coding MCP workflow](examples/ai-coding-mcp-workflow/) - REST helper plus MCP workflow notes; MCP remains separate JSON-RPC over `/mcp`.
- [Framework export workflow](examples/framework-export-workflow/) - create a Project Kit through the API and use the existing CLI for framework-oriented export workflows.

The advanced examples are templates and scripts. They do not imply the SDK is published to npm.

## Recipes

Start with the [recipes index](recipes/) for task-focused guides. Current recipes:

- [Search icons](recipes/search-icons.md) - query the live `/api/pro/search` endpoint with curl or the SDK.
- [Fetch SVG safely](recipes/fetch-svg-safely.md) - retrieve SVG payloads and handle rendering responsibilities in your app.
- [Build a React icon picker](recipes/build-a-react-icon-picker.md) - internal picker pattern with server-side token handling.
- [Build a command palette](recipes/build-a-command-palette.md) - keyboard-friendly icon search workflow.
- [Proxy API tokens in Next.js](recipes/proxy-api-tokens-in-nextjs.md) - App Router route handler pattern for keeping tokens private.
- [Generate an SVG sprite](recipes/generate-svg-sprite.md) - build a simple sprite from selected icon ids.
- [Manage Project Kits](recipes/manage-project-kits.md) - create collections, add icons, queue exports, and download artifacts.
- [Export icons to frameworks](recipes/export-icons-to-frameworks.md) - combine API Project Kits with CLI framework export workflows.
- [Generate a license manifest](recipes/generate-license-manifest.md) - produce provenance reports from live metadata.
- [Use Svg/icons with MCP](recipes/use-svgicons-with-mcp.md) - keep REST helpers and hosted MCP JSON-RPC workflows separate; use the MCP repo for setup guides, prompts, examples, and client configs.
- [Use Svg/icons in CI](recipes/use-svgicons-in-ci.md) - run team-defined provenance checks in CI.

Recipes use live `/api/pro` behavior unless they explicitly describe a separate MCP or CLI workflow. They do not imply npm publication.

Use the CLI for local lockfiles, license checks, scanner workflows, and collection exports:

```bash
npm install -g @svgicons-com/cli
export SVGICONS_API_TOKEN="YOUR_API_TOKEN"

svgicons auth status
svgicons search "settings gear" --limit 5
svgicons collection export "Dashboard icons" --formats react-ts,license-manifest
svgicons license check --allow MIT,Apache-2.0 --fail
```

## Token Safety

Treat Svg/icons API tokens like passwords.

- Do not commit tokens to Git.
- Use `SVGICONS_API_TOKEN` or a secret manager.
- Keep tokens on the server side.
- Do not put Pro API tokens in browser JavaScript.
- Rotate a token immediately if it appears in a commit, log, screenshot, support request, or public issue.

See [docs/TOKEN_SECURITY.md](docs/TOKEN_SECURITY.md) for safer environment variable and frontend proxy patterns.

## Validation And CI

CI is configured for GitHub Actions with Node 22. It does not require `SVGICONS_API_TOKEN`, does not call the live API, and does not depend on the website or CLI repos being present.

Run the full local validation stack:

```bash
npm ci
npm run validate
git diff --check
```

Useful focused checks:

```bash
npm run check:secrets
npm run check:docs
npm run validate:openapi
npm run typecheck
npm run build
npm run test
```

See [docs/CI.md](docs/CI.md) and [docs/MAINTAINER_CHECKLIST.md](docs/MAINTAINER_CHECKLIST.md).

## Repository Map

- [openapi/](openapi/) - OpenAPI source and examples.
- [packages/js/](packages/js/) - alpha JavaScript/TypeScript SDK package source.
- [examples/](examples/) - minimal working examples.
- [recipes/](recipes/) - task-focused guides.
- [use-cases/](use-cases/) - community use-case submissions.
- [docs/](docs/) - roadmap, token security, API versioning, CI, release, moderation, and link policy.

## Live, Planned, And Beta Labels

This repo uses explicit status labels:

- Live: implemented in the current website repo and safe to document.
- Alpha: implemented or scaffolded, but not ready for stable public use.
- Planned: intended repo work, not available yet.
- Proposed: under consideration, not committed.

Do not treat future SDK methods, future examples, or future MCP tools as live until the source repo confirms them.

## Community Use Cases

Share what you built with the Svg/icons API, SDK, examples, CLI workflows, or MCP-style workflows.

- Start at [use-cases/README.md](use-cases/README.md).
- Use [use-cases/TEMPLATE.md](use-cases/TEMPLATE.md) for pull requests.
- Review sample submissions in [use-cases/examples/](use-cases/examples/).
- Use the GitHub issue form at `.github/ISSUE_TEMPLATE/use-case.yml` after issues are enabled for the repository.

Good submissions explain the problem solved, stack, API/SDK/CLI/MCP workflow used, token-handling approach, and a short code snippet. Optional project, demo, or repo links are allowed when they help developers understand the workflow.

Selected use cases may be featured in this repo or on svgicons.com with permission. Do not include real API tokens, private data, spam links, or fake claims.

External links are optional. Developers are not required to link back to svgicons.com.

## License

MIT. See [LICENSE](LICENSE).
