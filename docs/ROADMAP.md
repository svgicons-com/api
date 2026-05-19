# Roadmap

This roadmap separates live svgicons.com behavior from planned repository work. Live API behavior should always match `openapi/svgicons.openapi.yaml`.

## Live Features

Current Pro REST API:

- `GET /api/pro/scopes`
- `GET /api/pro/me`
- `GET /api/pro/search`
- `GET /api/pro/icons/{icon}`
- `GET /api/pro/icons/{icon}/svg`
- `POST /api/pro/icons/{icon}/png-export`
- Icon Collection CRUD through `/api/pro/project-kits`
- Collection icon add, bulk add, and remove
- Collection export create, status, and download

Current auth/scopes:

- Sanctum bearer tokens created from a Pro account.
- `GET /api/pro/scopes` is metadata/discovery only.
- Icon search, icon metadata, SVG retrieval, PNG export, Project Kits, and Project Kit exports require a Pro API token.
- Public browsing and searching are available on svgicons.com outside this repository's token-authenticated API workflows.

Current MCP endpoint:

- `POST https://svgicons.com/mcp`
- MCP is separate JSON-RPC, not REST/OpenAPI.

Current API repo features:

- OpenAPI YAML and example request/response fixtures.
- Alpha TypeScript SDK source under `packages/js`.
- Core examples for Node search, server-side token proxying, Next.js icon picking, and SVG sprite generation.
- Advanced examples for React command palettes, design-system manifests, CI provenance reports, AI/MCP workflows, and framework export workflows.
- Recipes for search, SVG retrieval, frontend pickers, token proxying, sprites, Project Kits, framework exports, license manifests, MCP workflows, and CI.
- Community use-case templates, sample submissions, issue forms, moderation docs, and link-policy guidance.
- CI workflows and validation scripts.

## Planned Or Not Live

The following should not be documented as live API behavior:

- `GET /api/v1/icons/search`
- `GET /api/v1/icons/{set}/{name}`
- `GET /api/v1/icons/{set}/{name}/svg`
- `GET /api/v1/icon-sets`
- `GET /api/v1/icon-sets/{set}`
- Dedicated `/api/pro/icon-sets` endpoints.
- Public REST token-management endpoints.
- Public REST usage-reporting endpoints.
- Fixed public REST rate-limit numbers.
- Fake MCP npm packages or local MCP tools not confirmed by source docs.

## SDK Roadmap

Implemented in this repo:

- Typed client for live `/api/pro` endpoints.
- Bearer auth handling.
- JSON, SVG-payload JSON, PNG, and ZIP response handling.
- Typed `ApiError`.
- Mocked tests with no real API token.

Planned:

- npm publication after package review and release approval.
- More end-to-end examples that consume the published package after publication.
- Package metadata review before stable release.

## Examples And Recipes Roadmap

Added:

- Node search script.
- Server-side token proxy.
- Next.js icon picker pattern.
- SVG sprite generator.
- React command palette pattern.
- Design-system icon manifest generator.
- CI provenance report workflow.
- AI coding and MCP workflow notes.
- Framework export workflow with CLI companion commands.
- Practical recipes for the main API, SDK, CLI, MCP, and CI workflows.

Planned:

- More curl-only variants.
- More framework-specific companion notes when the CLI or website docs confirm details.
- MCP recipes synchronized with hosted MCP documentation.

## Community Use Cases Roadmap

Added:

- Use-case landing page and Markdown template.
- Sample/example submissions.
- GitHub issue templates for use cases, feedback, and bug reports.
- Pull request checklist.
- Maintainer guidance, moderation rules, and link policy.

Planned:

- GitHub Discussions, only after they are enabled/configured.
- Future website use-case gallery, only after product and moderation workflow decisions are complete.

Use-case links:

- External links are optional.
- User-submitted links should not be used as link spam.
- Links republished on svgicons.com should use `rel="ugc"` unless curated editorially.
