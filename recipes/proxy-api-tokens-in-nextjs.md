# Proxy API Tokens In Next.js

## Status

Live API.

## Problem

Next.js client components need icon data, but Pro API tokens must not be exposed in browser JavaScript.

## When To Use This

Use this recipe for App Router projects where browser UI should call a local route handler that forwards safe requests to Svg/icons.

## API Endpoints Used

- `GET /api/pro/search`
- Optional follow-up: `GET /api/pro/icons/{icon}/svg`

## SDK Methods Used

- `client.search.icons()`
- Optional follow-up: `client.icons.getSvg()`

## Token Requirements

Store the token in `.env.local` as `SVGICONS_API_TOKEN=YOUR_API_TOKEN`. Do not prefix it with `NEXT_PUBLIC_`.

## Step-By-Step

1. Add `SVGICONS_API_TOKEN` to `.env.local`.
2. Create an App Router route handler.
3. Validate query input before calling Svg/icons.
4. Return only the fields needed by your client component.
5. Fetch the local route from the browser.

## Copy-Paste Code

`.env.local`:

```bash
SVGICONS_API_TOKEN=YOUR_API_TOKEN
```

`app/api/icons/search/route.ts`:

```ts
import { SvgiconsClient } from "@svgicons-com/api-client";
import { NextResponse } from "next/server";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);

  if (!q) {
    return NextResponse.json({ data: [] });
  }

  const results = await client.search.icons({ q, limit: 20 });

  return NextResponse.json({
    data: results.data.map((icon) => ({
      id: icon.id,
      name: icon.name,
      set: icon.iconSet?.name ?? null,
    })),
  });
}
```

Client component:

```tsx
const response = await fetch(`/api/icons/search?q=${encodeURIComponent(query)}`);
const payload = await response.json();
```

## Security Notes

Never use `NEXT_PUBLIC_SVGICONS_API_TOKEN`. Do not return the token from route handlers, serialize it into React props, or log it in errors.

## Runnable Example

- [examples/server-side-token-proxy](../examples/server-side-token-proxy/)
- [examples/nextjs-icon-picker](../examples/nextjs-icon-picker/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

This pattern protects the token, but your app still needs normal request validation, error handling, and authorization if the route is not public.
