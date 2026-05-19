---
title: "Command palette icon search"
author: "Svg/icons example team"
status: "example"
stack: ["React", "TypeScript"]
api_features: ["search", "icon SVG"]
sdk_methods: ["client.search.icons", "client.icons.getSvg"]
workflow_type: "Live API"
demo_url:
repo_url:
website_url:
permission_to_feature: false
---

# Command Palette Icon Search

This is a sample use case, not a real customer submission.

## Problem

An internal tool needs keyboard-friendly icon search so developers can quickly find and copy icon ids or SVG payloads.

## Solution

Use a React command palette that calls local server routes. The server route calls the Svg/icons SDK with `SVGICONS_API_TOKEN`.

## Workflow

1. User opens a command palette.
2. The UI sends the query to a local route.
3. The route calls `client.search.icons()`.
4. The selected icon can be fetched with `client.icons.getSvg()`.
5. The UI copies the selected id or SVG.

## API / SDK / CLI Features Used

- `GET /api/pro/search`
- `GET /api/pro/icons/{icon}/svg`
- `client.search.icons()`
- `client.icons.getSvg()`

## Code Snippet

```ts
const response = await client.search.icons({ q: query, limit: 10 });
return response.data.map((icon) => ({ id: icon.id, name: icon.name }));
```

## Screenshots Or Demo

No screenshot for this sample.

## Results

Teams can add fast icon search without exposing tokens in frontend code.

## Links

- [React command palette example](../../examples/react-command-palette/)
- [Command palette recipe](../../recipes/build-a-command-palette.md)

## Permission

This example is maintained by the Svg/icons example team and is safe to feature as a sample.
