# CI

This repo uses GitHub Actions to validate docs, examples, OpenAPI, and the TypeScript SDK before merge.

## Workflows

- `.github/workflows/validate.yml`: documentation, scaffold, OpenAPI, secret, and whitespace checks.
- `.github/workflows/test.yml`: SDK typecheck, build, and tests.

Both workflows run on:

- `pull_request`
- `push` to `main`

## Node Version

CI uses Node 22. This avoids local Redocly engine warnings seen on older Node 20 patch releases.

## Scripts

Run locally:

```bash
npm ci
npm run check:secrets
npm run check:docs
npm run validate:scaffold
npm run validate:openapi
npm run typecheck
npm run build
npm run test
npm run validate
git diff --check
```

## What CI Validates

- Required root files exist.
- OpenAPI file exists and validates.
- SDK package exists and builds.
- SDK tests run with mocked fetch.
- Examples, recipes, and use-case files exist.
- Markdown files are non-empty.
- JSON files parse.
- YAML files pass basic sanity checks.
- `.mjs` example scripts pass syntax checks.
- No real-looking API tokens are committed.
- No fake live `/api/v1` usage is documented.
- No fake MCP npm package install instructions are present.
- No fake rate-limit or token-scope claims are present.
- No forced backlink language is present.

## What CI Does Not Do

- CI does not require `SVGICONS_API_TOKEN`.
- CI does not call the live svgicons.com API.
- CI does not require the private website repo.
- CI does not require the CLI repo.
- CI does not publish npm packages.
- CI does not create or push the GitHub repository.

## OpenAPI Source Sync

When the website repo is available locally, `scripts/sync-openapi.mjs --check` compares the committed YAML to the website source OpenAPI file.

When the website repo is unavailable, CI validates the committed OpenAPI file instead. This keeps public clones self-contained.
