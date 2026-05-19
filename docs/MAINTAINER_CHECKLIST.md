# Maintainer Checklist

## Before Accepting Pull Requests

- Confirm the change is scoped to this repo.
- Confirm no real API tokens or private data are included.
- Confirm no live `/api/v1` claims were added.
- Confirm no fake MCP package, fake MCP tool, fake token scope, or fake rate-limit claim was added.
- Confirm link-policy rules are followed.
- Run `npm run validate` or confirm CI passed.

## Before Adding Examples

- Use live `/api/pro` routes only.
- Keep tokens server-side.
- Include `.env.example` with placeholders only when a token is needed.
- Avoid live network calls in validation/tests.
- Link to relevant SDK, OpenAPI, docs, and token-safety pages.
- Mark workflow-only examples clearly when they are not fully runnable.

## Before Adding Recipes

- Include status, problem, API endpoints, SDK methods, token requirements, steps, code, security notes, runnable example link, docs links, and limitations.
- Keep MCP as separate JSON-RPC over `/mcp`.
- Keep CLI-specific workflows tied to real CLI behavior.
- Do not document planned endpoints as live.

## Before Accepting Use Cases

- Confirm the submission describes a real workflow or is clearly marked as sample/example.
- Confirm the submitter has permission to share links, screenshots, and code.
- Remove spam links or unrelated links.
- Avoid fake customer claims.
- Treat unreviewed user-submitted links as user-generated content if they are later shown on svgicons.com.

## Before Publishing The SDK

- Confirm npm publication is approved.
- Review `packages/js/package.json`.
- Confirm package name and version.
- Confirm README wording no longer says the package is unpublished after publication.
- Run `npm run validate`.
- Review generated `dist/` files locally, but do not commit build artifacts unless the release policy requires it.

## Before Repository Releases

- Run the full release checklist.
- Confirm GitHub Actions pass.
- Confirm README and docs use public-facing wording.
- Confirm `CHANGELOG.md` is current.
- Confirm repository description, topics, license, and issue templates are ready.
- Confirm svgicons.com links point to the intended public docs.
