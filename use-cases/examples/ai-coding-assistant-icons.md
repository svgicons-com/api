---
title: "AI coding assistant icon workflow"
author: "Svg/icons example team"
status: "example"
stack: ["Node.js", "AI coding tools", "MCP"]
api_features: ["search", "icon SVG", "Project Kits"]
sdk_methods: ["client.search.icons", "client.icons.getSvg"]
workflow_type: "Separate MCP workflow"
demo_url:
repo_url:
website_url:
permission_to_feature: false
---

# AI Coding Assistant Icons

This is a sample use case, not a real customer submission.

## Problem

An AI coding assistant needs relevant icon candidates for UI changes without guessing icon names or pasting private tokens into prompts.

## Solution

Use a trusted server-side helper for Pro REST API search and SVG retrieval. Keep MCP separate as JSON-RPC over `/mcp` and follow the hosted MCP docs for client setup.

## Workflow

1. The assistant receives a request such as "add dashboard navigation icons."
2. A server-side helper calls `client.search.icons()`.
3. The helper fetches selected SVG payloads with `client.icons.getSvg()`.
4. The assistant receives compact candidates for review.
5. MCP-compatible workflows use the separate hosted MCP endpoint, not a fake local package.

## API / SDK / CLI Features Used

- `GET /api/pro/search`
- `GET /api/pro/icons/{icon}/svg`
- MCP JSON-RPC over `/mcp`
- `client.search.icons()`
- `client.icons.getSvg()`

## Code Snippet

```js
const results = await client.search.icons({ q: "dashboard navigation", limit: 5 });
const icons = await Promise.all(
  results.data.map((icon) => client.icons.getSvg({ icon: icon.id })),
);
```

## Screenshots Or Demo

No screenshot for this sample.

## Results

The assistant can suggest real icon ids and SVG payloads while tokens stay in trusted tooling.

## Links

- [AI coding MCP workflow example](../../examples/ai-coding-mcp-workflow/)
- [MCP recipe](../../recipes/use-svgicons-with-mcp.md)
- [Svg/icons MCP docs](https://svgicons.com/developers/mcp)

## Permission

This example is maintained by the Svg/icons example team and is safe to feature as a sample.
