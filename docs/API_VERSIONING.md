# API Versioning

## Current API Surface

The current live official svgicons.com Pro API documented by this repository is:

```text
/api/pro
```

The committed OpenAPI spec documents the real `/api/pro` operations only. These operations require a svgicons.com Pro API token unless the OpenAPI operation explicitly documents otherwise.

`GET /api/pro/scopes` is currently the only `/api/pro` operation documented without bearer authentication. It is metadata/discovery for the Pro API scope catalog only and is not an unauthenticated icon API.

## Planned Or Not Live

The following are not live REST APIs unless a future product decision changes that:

- `/api/v1/*`
- Dedicated `/api/pro/icon-sets` endpoints.
- Public REST token-management endpoints.
- Public REST usage-reporting endpoints.
- MCP as REST.

MCP remains separate JSON-RPC over:

```text
POST /mcp
```

## Breaking Changes

Breaking API changes should be handled with:

1. A product/API decision.
2. Website implementation and tests.
3. Updated website source OpenAPI.
4. Synchronized API repo OpenAPI.
5. SDK changes.
6. Changelog notes.
7. Migration guidance when needed.

Breaking changes include removing fields, changing response shapes, changing auth behavior, removing operations, changing request validation in incompatible ways, or changing binary response semantics.

## OpenAPI Spec Versions

The OpenAPI `info.version` should change when the public API contract changes. The spec should remain tied to real website behavior.

Do not add planned routes to the live OpenAPI document. Planned/beta routes belong in roadmap docs until they exist.

## SDK Versions

SDK versions should track SDK package changes, not necessarily every website deployment.

Use patch/minor pre-1.0 versions for compatible SDK fixes and additions. Treat incompatible SDK changes carefully and document migration notes in `CHANGELOG.md`.

## Planned And Beta Labels

Use these labels consistently:

- Live: implemented in the website repo and documented in OpenAPI.
- Alpha: present locally but not stable or published.
- Planned: intended but not implemented.
- Proposed: under consideration.

Never label `/api/v1`, fake MCP packages, fake token scopes, or fake rate limits as live.
