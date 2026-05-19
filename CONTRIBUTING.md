# Contributing

Thanks for helping improve the Svg/icons API developer repo. This repository is for API docs, OpenAPI work, SDK code, examples, recipes, and community use cases for https://svgicons.com.

## What To Contribute

Useful contributions include:

- OpenAPI fixes that match the live API.
- SDK fixes and tests.
- Curl, Node, TypeScript, and CLI examples.
- Recipes for real workflows.
- Token safety and security improvements.
- MCP workflow docs that match the hosted endpoint.
- Community use cases that describe a real integration.

## Source Of Truth

Keep docs grounded in the live svgicons.com product behavior, the published OpenAPI source, and the existing Svg/icons CLI behavior.

Do not invent endpoints, token scopes, package names, pricing, rate limits, SDK features, or MCP tools. If something is not implemented, label it planned, alpha, beta, or proposed.

## Secrets

Pull requests must not include real API tokens, bearer tokens, session values, token hashes, private URLs, or customer data.

Use these placeholders in docs and examples:

```text
SVGICONS_API_TOKEN
YOUR_API_TOKEN
```

Before opening a PR:

- Search changed files for secrets.
- Remove local `.env` files from commits.
- Redact tokens from screenshots and logs.
- Rotate any token that was exposed.

## Examples And Recipes

Examples should be:

- Small enough to understand.
- Runnable or clearly marked as a snippet.
- Based on live endpoints from [openapi/svgicons.openapi.yaml](openapi/svgicons.openapi.yaml).
- Safe by default with server-side token handling.
- Free of real tokens and unrelated marketing links.

Recipes should explain a complete workflow, including prerequisites and expected outputs.

## SDK Changes

The JavaScript/TypeScript SDK lives under `packages/js`.

SDK PRs should include:

- Tests for request paths and response handling.
- Error handling for 401, 403, 404, 422, 429, invalid JSON, and network failures where relevant.
- Binary handling tests for PNG or ZIP downloads when those helpers are added.
- Types aligned with the OpenAPI document.

Do not add heavy dependencies without a clear reason.

## Use Cases

Use cases may be submitted with [use-cases/TEMPLATE.md](use-cases/TEMPLATE.md) or a GitHub issue form.

Use cases may be featured in this repo or on svgicons.com after review. Review considers:

- Whether the workflow is real and relevant.
- Whether the description helps other developers.
- Whether external links are safe, relevant, and non-spam.
- Whether the submitter has rights to share the project.

External links are optional. Users are not required to link back to svgicons.com.

## Link Policy

Follow [docs/LINK_POLICY.md](docs/LINK_POLICY.md).

In short:

- Natural links to Svg/icons docs are fine.
- Forced backlinks are not allowed.
- User-submitted links should not become link spam.
- Links republished on svgicons.com should use `rel="ugc"` unless curated editorially.

## Development

This scaffold intentionally uses no external runtime dependencies.

Run the current validation check:

```bash
npm run validate
```

As SDK and OpenAPI tooling are added, keep validation lightweight and reproducible.
