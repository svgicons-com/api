# AI Coding And MCP Workflow

Workflow notes and a small REST helper for AI coding assistants that need Svg/icons search and SVG retrieval.

## Status Labels

- Live: Pro REST API search, SVG retrieval, Project Kits, and exports under `/api/pro`.
- Separate: MCP is JSON-RPC over `POST /mcp`, documented at https://svgicons.com/developers/mcp.
- Planned/Beta: Any client-specific setup not confirmed by the website or CLI source should be treated as planned or tool-specific.

This example does not create an MCP server, does not install a fake MCP package, and does not invent tools. It shows how a server-side helper can give an AI assistant real icon candidates through the REST API.

## Links

- SDK package: [../../packages/js](../../packages/js)
- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- MCP docs: https://svgicons.com/developers/mcp
- Token docs: https://svgicons.com/docs/api-tokens
- CLI repo: https://github.com/svgicons-com/cli

## REST Helper

`api-workflow.mjs` searches icons and returns a compact JSON payload with SVG strings for the first few results.

Setup:

```bash
npm install
copy .env.example .env
```

Edit `.env`:

```bash
SVGICONS_API_TOKEN=YOUR_API_TOKEN
SVGICONS_AI_QUERY=dashboard navigation
```

Run:

```bash
npm run search -- "settings gear"
```

## How AI Tools Can Use This

An AI coding assistant can call a trusted server-side helper that:

1. Receives a UI intent such as "billing sidebar icons".
2. Calls `client.search.icons()`.
3. Calls `client.icons.getSvg()` for selected candidates.
4. Returns id, name, source set, license value, and SVG markup for review or insertion.

For MCP-compatible workflows, use the hosted MCP endpoint documented on svgicons.com. Keep MCP configuration and OAuth/token handling separate from this REST SDK example.

## Prompt Examples

See [prompts.md](prompts.md).

## Security Notes

Keep `SVGICONS_API_TOKEN` server-side. Do not paste private tokens into AI prompts, chat transcripts, public issues, screenshots, or frontend code.
