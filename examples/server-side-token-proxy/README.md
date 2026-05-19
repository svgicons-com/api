# Server-Side Token Proxy

Minimal Node.js server showing how frontend apps can search icons without exposing a private Svg/icons Pro API token to browser code.

## Use Case

Use this pattern for design-system tools, command palettes, internal dashboards, or any frontend that needs Svg/icons search while keeping Pro API tokens on your server.

The browser calls this local server:

```text
GET /api/icons/search?q=arrow
```

The server reads `SVGICONS_API_TOKEN`, calls the live `/api/pro/search` endpoint through the SDK, and returns only the fields the browser needs.

## Links

- SDK package: [../../packages/js](../../packages/js)
- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- Token docs: https://svgicons.com/docs/api-tokens

## Setup

```bash
npm install
copy .env.example .env
```

Edit `.env`:

```bash
SVGICONS_API_TOKEN=YOUR_API_TOKEN
PORT=3030
```

On macOS/Linux use `cp .env.example .env`.

## Run

```bash
npm start
```

Open:

```text
http://localhost:3030
```

## How The Proxy Works

- Browser code calls the local `/api/icons/search` route.
- The server sanitizes `q` to 100 characters and clamps `limit` to 1-20.
- The server calls `client.search.icons()`.
- The browser receives ids, names, page URLs, and limited icon-set metadata.
- The token never appears in browser JavaScript, HTML, logs, or network requests to the browser.

## Adapting The Pattern

- Next.js: put the server-side call in a route handler such as `app/api/icons/search/route.ts`.
- Laravel: put the server-side call in a controller and read the token from `.env`.
- Express/Fastify/Hono: use the same validation and response shaping in a route handler.

## Security Notes

Do not pass `SVGICONS_API_TOKEN` to client components, public environment variables, or frontend build-time variables. Rotate the token immediately if it appears in a commit, browser bundle, screenshot, or public issue.
