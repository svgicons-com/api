---
title: "SVG sprite workflow"
author: "Svg/icons example team"
status: "example"
stack: ["Node.js", "SVG"]
api_features: ["icon SVG"]
sdk_methods: ["client.icons.getSvg"]
workflow_type: "Live API"
demo_url:
repo_url:
website_url:
permission_to_feature: false
---

# SVG Sprite Workflow

This is a sample use case, not a real customer submission.

## Problem

A project wants a small static sprite generated from reviewed icon ids.

## Solution

Keep selected ids in a config file, fetch SVG payloads through the SDK, and write a simple `dist/sprite.svg` artifact during a trusted build step.

## Workflow

1. Review and store selected icon ids.
2. Fetch each SVG with `client.icons.getSvg()`.
3. Convert the SVGs into `<symbol>` entries.
4. Write a sprite file.
5. Use `<svg><use href="#icon-name"></use></svg>` in app markup.

## API / SDK / CLI Features Used

- `GET /api/pro/icons/{icon}/svg`
- `client.icons.getSvg()`

## Code Snippet

```js
const svg = await client.icons.getSvg({ icon: 33716 });
const symbol = `<symbol id="arrow-circle-up" viewBox="${svg.data.viewBox}">${svg.data.body}</symbol>`;
```

## Screenshots Or Demo

No screenshot for this sample.

## Results

The app can ship a reviewed sprite artifact without runtime API calls from the browser.

## Links

- [SVG sprite generator example](../../examples/svg-sprite-generator/)
- [SVG sprite recipe](../../recipes/generate-svg-sprite.md)

## Permission

This example is maintained by the Svg/icons example team and is safe to feature as a sample.
