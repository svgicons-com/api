# Release Checklist

Use this checklist before repository releases, SDK publication, or major documentation updates.

## Required Checks

- [ ] `npm ci` completes.
- [ ] `npm run validate:openapi` passes.
- [ ] `npm run check:secrets` passes.
- [ ] `npm run check:docs` passes.
- [ ] `npm run validate:scaffold` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test` passes.
- [ ] `npm run validate` passes.
- [ ] `git diff --check` passes.

## Repository State

- [ ] Working tree is clean after intended changes are committed.
- [ ] No untracked files remain.
- [ ] `git branch` shows the expected release branch.
- [ ] `origin` remote points to the expected repository.
- [ ] GitHub Actions pass.

## Content Review

- [ ] OpenAPI validates.
- [ ] SDK typechecks.
- [ ] SDK builds.
- [ ] SDK tests pass.
- [ ] Examples are validated.
- [ ] Recipes are validated.
- [ ] Use cases and templates are validated.
- [ ] No secrets or real API tokens are committed.
- [ ] No fake `/api/v1` live claims exist.
- [ ] No fake MCP package or tool claims exist.
- [ ] No forced backlink language exists.
- [ ] Token-required wording is clear.
- [ ] `GET /api/pro/scopes` is described as metadata/discovery only.
- [ ] README is reviewed.
- [ ] CHANGELOG is updated.
- [ ] License is reviewed.

## SDK Release Readiness

- [ ] npm publication is approved.
- [ ] Package name and version are reviewed.
- [ ] Package exports are reviewed.
- [ ] README no longer says the package is unpublished after publication.
- [ ] Release notes mention supported `/api/pro` operations.

## API Contract Review

- [ ] Live REST API is documented as `/api/pro`.
- [ ] `/api/v1` remains planned/not live unless a product decision changes.
- [ ] MCP remains separate JSON-RPC over `/mcp`.
- [ ] Dedicated REST icon-set endpoints are not documented as live.
- [ ] Public REST token-management endpoints are not documented as live.
- [ ] Public REST usage-reporting endpoints are not documented as live.
