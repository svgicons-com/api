---
title: "Design-system icon picker"
author: "Svg/icons example team"
status: "example"
stack: ["Next.js", "React", "TypeScript"]
api_features: ["search", "icon SVG"]
sdk_methods: ["client.search.icons", "client.icons.getSvg"]
workflow_type: "Live API"
demo_url:
repo_url:
website_url:
permission_to_feature: false
---

# Design-System Icon Picker

This is a sample use case, not a real customer submission.

## Problem

A design-system team needs an internal picker so product developers can search approved icons, preview SVGs, and copy a stable icon id.

## Solution

Build a Next.js route handler that keeps `SVGICONS_API_TOKEN` server-side, calls the Svg/icons SDK, and returns trimmed result data to a React picker.

## Workflow

1. Search icons with `client.search.icons()`.
2. Fetch the selected SVG with `client.icons.getSvg()`.
3. Store approved ids in a design-system manifest.
4. Review source and license metadata when available from the API.

## API / SDK / CLI Features Used

- `GET /api/pro/search`
- `GET /api/pro/icons/{icon}/svg`
- `client.search.icons()`
- `client.icons.getSvg()`

## Code Snippet

```ts
const results = await client.search.icons({ q: "settings", limit: 20 });
const svg = await client.icons.getSvg({ icon: results.data[0].id });
```

## Screenshots Or Demo

No screenshot for this sample.

## Results

Developers can pick consistent icons without exposing tokens in browser code.

## Links

- [Next.js icon picker example](../../examples/nextjs-icon-picker/)
- [Design-system icons example](../../examples/design-system-icons/)

## Permission

This example is maintained by the Svg/icons example team and is safe to feature as a sample.
