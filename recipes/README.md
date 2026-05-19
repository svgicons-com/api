# Recipes

Practical recipes for using the live official svgicons.com Pro API, the local TypeScript SDK, runnable examples, and companion CLI/MCP workflows.

REST recipes use `/api/pro` and require a svgicons.com Pro API token for icon search, icon metadata, SVG retrieval, PNG export, Project Kits, and Project Kit exports. The planned `/api/v1` routes are not live and should not be copied into production code yet. The SDK package source is in this repository until npm publication.

There is currently no official unauthenticated public icon REST API documented in this repository. `GET /api/pro/scopes` is metadata/discovery for the Pro API scope catalog only; it is not a free icon API.

## Start Here

- New to the API: [Search icons](search-icons.md), then [Fetch SVG safely](fetch-svg-safely.md).
- Building frontend tools: [Build a React icon picker](build-a-react-icon-picker.md), [Build a command palette](build-a-command-palette.md).
- Protecting tokens: [Proxy API tokens in Next.js](proxy-api-tokens-in-nextjs.md).
- Design-system teams: [Generate an SVG sprite](generate-svg-sprite.md), [Generate a license manifest](generate-license-manifest.md).
- AI/MCP workflows: [Use Svg/icons with MCP](use-svgicons-with-mcp.md).
- CI/provenance workflows: [Use Svg/icons in CI](use-svgicons-in-ci.md).

## Recipe Catalog

| Recipe | Use case | Status | API features | SDK methods | Example folder |
| --- | --- | --- | --- | --- | --- |
| [Search icons](search-icons.md) | Find icons by query for tools and scripts. | Live API | `GET /api/pro/search` | `client.search.icons()` | [node-search-icons](../examples/node-search-icons/) |
| [Fetch SVG safely](fetch-svg-safely.md) | Retrieve SVG payloads for rendering, copying, or build steps. | Live API | `GET /api/pro/icons/{icon}/svg` | `client.icons.getSvg()` | [svg-sprite-generator](../examples/svg-sprite-generator/) |
| [Build a React icon picker](build-a-react-icon-picker.md) | Internal icon picker for design systems and admin tools. | Live API | Search and SVG retrieval | `client.search.icons()`, `client.icons.getSvg()` | [nextjs-icon-picker](../examples/nextjs-icon-picker/), [design-system-icons](../examples/design-system-icons/) |
| [Build a command palette](build-a-command-palette.md) | Icon search from a keyboard-friendly command UI. | Live API | Search and SVG retrieval | `client.search.icons()`, `client.icons.getSvg()` | [react-command-palette](../examples/react-command-palette/) |
| [Proxy API tokens in Next.js](proxy-api-tokens-in-nextjs.md) | Keep Pro API tokens out of browser bundles. | Live API | Server route calls `/api/pro/search` | `client.search.icons()` | [server-side-token-proxy](../examples/server-side-token-proxy/), [nextjs-icon-picker](../examples/nextjs-icon-picker/) |
| [Generate an SVG sprite](generate-svg-sprite.md) | Build a simple sprite from selected icon ids. | Live API | SVG retrieval | `client.icons.getSvg()` | [svg-sprite-generator](../examples/svg-sprite-generator/) |
| [Manage Project Kits](manage-project-kits.md) | Create collections, add icons, queue exports, and download artifacts. | Live API | `/api/pro/project-kits` | `client.projectKits.*` | [framework-export-workflow](../examples/framework-export-workflow/) |
| [Export icons to frameworks](export-icons-to-frameworks.md) | Move API-selected icons into React/Vue/Svelte output workflows. | Live API + CLI workflow | Project Kits and exports | `client.projectKits.*` | [framework-export-workflow](../examples/framework-export-workflow/) |
| [Generate a license manifest](generate-license-manifest.md) | Produce metadata/provenance reports for selected icons. | Live API + CLI workflow | Icon metadata | `client.icons.get()` | [ci-license-audit](../examples/ci-license-audit/) |
| [Use Svg/icons with MCP](use-svgicons-with-mcp.md) | Support AI coding assistants with REST helpers and hosted MCP. | Separate MCP workflow | REST helper plus separate `/mcp` JSON-RPC | `client.search.icons()`, `client.icons.getSvg()` | [ai-coding-mcp-workflow](../examples/ai-coding-mcp-workflow/) |
| [Use Svg/icons in CI](use-svgicons-in-ci.md) | Run team-defined icon provenance checks in CI. | Live API + CLI workflow | Icon metadata and CLI reports | `client.icons.get()` | [ci-license-audit](../examples/ci-license-audit/) |

## Recipe Rules

- Use live `/api/pro` routes unless a section is explicitly labeled planned.
- Treat `/api/pro` icon workflows as token-authenticated svgicons.com Pro API workflows.
- Keep `SVGICONS_API_TOKEN` server-side.
- Use `SVGICONS_API_TOKEN` and `YOUR_API_TOKEN` placeholders only.
- Treat MCP as separate JSON-RPC over `/mcp`, not as a REST endpoint in the OpenAPI spec.
- Do not require users to link back to svgicons.com.
