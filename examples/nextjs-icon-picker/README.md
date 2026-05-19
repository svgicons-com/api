# Next.js Icon Picker

Minimal App Router example for an internal design-system icon picker. The browser talks to local Next.js route handlers, and the route handlers call the live Svg/icons Pro API with a server-side token.

## Use Case

Use this pattern when designers or engineers need a searchable icon picker in an internal design-system site, admin tool, or component gallery.

The example demonstrates:

- Search box and results grid.
- Server-side route handler for icon search.
- Server-side route handler for SVG payload lookup.
- Selected icon state.
- Copy SVG action.
- Token kept out of client components.

## Links

- SDK package: [../../packages/js](../../packages/js)
- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- Token docs: https://svgicons.com/docs/api-tokens

## Setup

Build the local SDK package, install this example's dependencies, then add a token:

```bash
npm --prefix ../../packages/js run build
npm install
copy .env.example .env.local
```

Edit `.env.local`:

```bash
SVGICONS_API_TOKEN=YOUR_API_TOKEN
```

On macOS/Linux use `cp .env.example .env.local`.

## Run

```bash
npm run dev
```

Open the local Next.js URL printed by the dev server.

## How Token Protection Works

Client components call local routes:

- `GET /api/icons/search?q=arrow`
- `GET /api/icons/{icon}/svg`

Only those route handlers read `SVGICONS_API_TOKEN` and call Svg/icons. The browser never receives the token.

## Customization

- Change returned fields in `app/api/icons/search/route.ts`.
- Render custom previews in `app/components/IconPicker.tsx`.
- Add project-specific filters before returning results to the browser.
- Use `client.projectKits.*` methods on the server side if your design system saves selected icons to Icon Collections.

## Limitations

This is a compact pattern example, not a full production app. It does not include persistence, debounced search, virtualization, or production auth around the local route handlers.

The SDK package is local in this repository. After npm publication, install it with:

```bash
npm install @svgicons-com/api-client
```
