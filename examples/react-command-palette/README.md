# React Command Palette

Command-palette pattern for searching Svg/icons from React while keeping Pro API tokens on the server.

## Use Case

Use this pattern in internal tools, component libraries, CMS editors, or design-system documentation sites where developers need to search icons quickly and copy SVG or metadata.

## Links

- SDK package: [../../packages/js](../../packages/js)
- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- Token docs: https://svgicons.com/docs/api-tokens

## Files

- `src/CommandPalette.tsx`: client-side React component.
- `src/searchIcons.ts`: server-side helper for local API routes.
- `src/types.ts`: small UI response types.

## Server-Side Token Pattern

The React component calls local endpoints:

```text
GET /api/icons/search?q=search
GET /api/icons/{icon}/svg
```

Those routes should call `searchIconsForPalette()` and `getPaletteIconSvg()` on the server with `SVGICONS_API_TOKEN`. Do not call svgicons.com directly from the browser with a Pro API token.

## Local Setup

This is a component template, not a full app. To typecheck the files:

```bash
npm --prefix ../../packages/js run build
npm install
npm run typecheck
```

This example keeps its repository-local SDK setup. The SDK is also published on npm (version 0.1.0 checked on 17 October 2026). For a separate application, install it as shown below; review imports and dependency declarations before adapting this example. No migration to the npm dependency is made here:

```bash
npm install @svgicons-com/api-client
```

## Security Notes

Keep `SVGICONS_API_TOKEN` in server-side routes, server components, backend services, or CI secrets. Never expose it in public React bundles or public environment variables.
