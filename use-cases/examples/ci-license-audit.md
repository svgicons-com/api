---
title: "CI provenance report"
author: "Svg/icons example team"
status: "example"
stack: ["Node.js", "GitHub Actions"]
api_features: ["icon metadata"]
sdk_methods: ["client.icons.get"]
workflow_type: "Live API + CLI workflow"
demo_url:
repo_url:
website_url:
permission_to_feature: false
---

# CI Provenance Report

This is a sample use case, not a real customer submission.

## Problem

An engineering team wants a repeatable report of selected icon metadata during pull requests.

## Solution

Run a CI job that reads approved icon ids, calls `client.icons.get()`, and writes Markdown or JSON provenance output. Treat the report as developer metadata, not legal advice.

## Workflow

1. Store selected icon ids in a repo config.
2. Store `SVGICONS_API_TOKEN` as a CI secret.
3. Fetch metadata with `client.icons.get()`.
4. Write `THIRD_PARTY_ICONS.md` or JSON.
5. Fail CI only on team-defined policy checks.

## API / SDK / CLI Features Used

- `GET /api/pro/icons/{icon}`
- `client.icons.get()`
- Optional CLI license export workflow

## Code Snippet

```js
const icon = await client.icons.get({ icon: 33716 });
console.log(icon.data.iconSet?.license ?? "License not provided by API");
```

## Screenshots Or Demo

No screenshot for this sample.

## Results

Pull requests can include a reviewable icon provenance artifact.

## Links

- [CI license audit example](../../examples/ci-license-audit/)
- [License manifest recipe](../../recipes/generate-license-manifest.md)
- [Svg/icons CLI repo](https://github.com/svgicons-com/cli)

## Permission

This example is maintained by the Svg/icons example team and is safe to feature as a sample.
