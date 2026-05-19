# Examples

Examples in this directory are small, practical, and based on live svgicons.com Pro API behavior. REST examples use `/api/pro` only, require a Pro API token for icon workflows, and use `SVGICONS_API_TOKEN` as the environment variable. MCP appears only as a separate workflow note where relevant.

There is currently no official unauthenticated public icon REST API documented in this repository. Public browsing and searching are available on svgicons.com, but these examples are token-authenticated Pro API workflows unless an example explicitly says it is only reading API metadata.

## Example Catalog

| Example | Use case | Stack | API features used | SDK used? | Token required? | Runnable status | Live/Beta/Planned status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [node-search-icons](node-search-icons/) | Search icons from a server-side script and print useful metadata. | Node.js | `GET /api/pro/search` | Yes | Yes | Fully runnable with `SVGICONS_API_TOKEN` | Live API example |
| [server-side-token-proxy](server-side-token-proxy/) | Keep Pro API tokens private while a browser searches through a local server. | Node.js HTTP server plus static HTML | `GET /api/pro/search` | Yes | Yes | Fully runnable with `SVGICONS_API_TOKEN` | Live API example |
| [nextjs-icon-picker](nextjs-icon-picker/) | Internal design-system icon picker with server-side route handlers. | Next.js App Router | `GET /api/pro/search`, `GET /api/pro/icons/{icon}/svg` | Yes | Yes | Runnable app template with local SDK package | Live API example |
| [svg-sprite-generator](svg-sprite-generator/) | Build a simple SVG sprite from configured icon ids. | Node.js | `GET /api/pro/icons/{icon}/svg` | Yes | Yes | Fully runnable with `SVGICONS_API_TOKEN` | Live API example |
| [react-command-palette](react-command-palette/) | Command-palette UI pattern for icon search and copy workflows. | React component template | `GET /api/pro/search`, `GET /api/pro/icons/{icon}/svg` through server routes | Yes | Yes | Component template; typecheck after installing local deps | Live API pattern |
| [design-system-icons](design-system-icons/) | Build an approved icon manifest for design-system governance. | Node.js | `GET /api/pro/icons/{icon}/svg` | Yes | Yes | Fully runnable with `SVGICONS_API_TOKEN` | Live API example |
| [ci-license-audit](ci-license-audit/) | Generate CI provenance reports from icon metadata. | Node.js plus GitHub Actions example | `GET /api/pro/icons/{icon}` | Yes | Yes | Fully runnable with `SVGICONS_API_TOKEN`; workflow template included | Live API example |
| [ai-coding-mcp-workflow](ai-coding-mcp-workflow/) | Use REST helpers and MCP workflow notes for AI coding tools. | Node.js plus prompt docs | `GET /api/pro/search`, `GET /api/pro/icons/{icon}/svg`; MCP is separate JSON-RPC | Yes | Yes for REST helper | Runnable REST helper; MCP notes are documentation | Live REST plus separate MCP workflow |
| [framework-export-workflow](framework-export-workflow/) | Move API-selected icons into framework export workflows. | Node.js plus CLI companion workflow | Project Kit create/add/export under `/api/pro/project-kits` | Yes | Yes | Fully runnable with `SVGICONS_API_TOKEN`; CLI commands documented | Live API plus CLI workflow |

## Token Placeholder

Use a svgicons.com Pro API token through:

```bash
export SVGICONS_API_TOKEN="YOUR_API_TOKEN"
```

Do not include real tokens in examples or commit `.env` files.

## SDK Package

The SDK package is local in this repository:

```text
../packages/js
```

Examples either import the built local SDK directly or use a local file dependency. They do not assume `@svgicons-com/api-client` has been published to npm.

After npm publication, examples can be adapted to:

```bash
npm install @svgicons-com/api-client
```

## Current Live REST Base

```text
https://svgicons.com/api/pro
```

Current examples should use endpoints listed in [openapi/svgicons.openapi.yaml](../openapi/svgicons.openapi.yaml) and documented in [openapi/README.md](../openapi/README.md).

`GET /api/pro/scopes` is metadata/discovery for the Pro API scope catalog and does not require a token. It is not an icon search or icon download endpoint. Example workflows that search, fetch SVG, export PNG, manage Project Kits, or generate exports require `SVGICONS_API_TOKEN`.

## Validation Notes

Repository validation checks example files, JSON syntax, and `.mjs` syntax. It does not run scripts that call svgicons.com. Running the examples requires a real `SVGICONS_API_TOKEN`.
