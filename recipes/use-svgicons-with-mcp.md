# Use Svg/icons With MCP

## Status

Separate MCP workflow.

## Problem

AI coding assistants can benefit from icon search and SVG retrieval, but MCP is a separate JSON-RPC surface and should not be documented as normal REST.

## When To Use This

Use this recipe when an AI coding workflow needs server-side REST helpers, hosted MCP documentation, and clear boundaries between live REST behavior and MCP behavior.

## API Endpoints Used

Live REST helper endpoints:

- `GET /api/pro/search`
- `GET /api/pro/icons/{icon}/svg`
- Project Kit routes under `/api/pro/project-kits` when a workflow prepares collections.

Separate MCP endpoint:

- `POST /mcp` as JSON-RPC, documented outside the OpenAPI REST spec.

## SDK Methods Used

- `client.search.icons()`
- `client.icons.getSvg()`
- Optional Project Kit methods for collection workflows.

## Token Requirements

REST helper scripts use `SVGICONS_API_TOKEN`. MCP clients should follow the hosted MCP documentation for authentication and client setup.

## Step-By-Step

1. Use the REST API or SDK in a trusted helper to search icons for an AI request.
2. Return compact candidates with id, name, set, license value, and SVG when needed.
3. Keep private tokens out of prompts, screenshots, transcripts, and generated code.
4. For MCP-compatible tools, configure the hosted MCP endpoint documented by svgicons.com.
5. Treat client-specific MCP setup as tool-specific unless the website or CLI source confirms it.

## Copy-Paste Code

REST helper:

```js
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

export async function findIconsForAssistant(query) {
  const results = await client.search.icons({ q: query, limit: 5 });

  return Promise.all(
    results.data.map(async (icon) => {
      const svg = await client.icons.getSvg({ icon: icon.id });
      return {
        id: icon.id,
        name: icon.name,
        set: icon.iconSet?.name ?? null,
        license: icon.iconSet?.license ?? null,
        svg: svg.data.svg,
      };
    }),
  );
}
```

Prompt examples:

```text
Find a simple search icon and insert it into this React button.
Replace this emoji with an accessible SVG icon.
Create matching sidebar icons for users, billing, analytics, and settings.
Generate a themeable icon component using currentColor.
Find icons for a dashboard navigation and explain why each one fits.
```

## Security Notes

Do not paste private API tokens into AI prompts or MCP client logs. Keep token exchange, OAuth configuration, and REST helper calls in trusted tooling.

## Runnable Example

- [examples/ai-coding-mcp-workflow](../examples/ai-coding-mcp-workflow/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [Svg/icons MCP docs](https://svgicons.com/developers/mcp)
- [Svg/icons MCP repo](https://github.com/svgicons-com/mcp)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

This recipe does not create a local MCP server, fake MCP tools, or an npm MCP package. MCP remains separate JSON-RPC over `/mcp`.
