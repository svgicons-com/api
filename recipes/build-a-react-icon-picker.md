# Build A React Icon Picker

## Status

Live API.

## Problem

Design-system and admin tools often need a searchable icon picker that can preview icons, copy ids, or copy SVG while keeping Pro API tokens private.

## When To Use This

Use this recipe for internal React or Next.js tools where authenticated server routes can call Svg/icons and client components can render sanitized results.

## API Endpoints Used

- `GET /api/pro/search`
- `GET /api/pro/icons/{icon}/svg`

## SDK Methods Used

- `client.search.icons()`
- `client.icons.getSvg()`

## Token Requirements

The server route needs `SVGICONS_API_TOKEN`. The browser should call your local route, not svgicons.com directly with a private token.

## Step-By-Step

1. Create a server route such as `/api/icons/search`.
2. Validate and trim the incoming query.
3. Call `client.search.icons()` on the server.
4. Return only the fields the picker needs.
5. Fetch SVG for the selected icon through a second server route.
6. Let the user copy the icon id or SVG markup according to your team policy.

## Copy-Paste Code

Server helper:

```ts
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

export async function searchPickerIcons(query: string) {
  const q = query.trim().slice(0, 80);
  if (!q) {
    return [];
  }

  const response = await client.search.icons({ q, limit: 24 });

  return response.data.map((icon) => ({
    id: icon.id,
    name: icon.name,
    set: icon.iconSet?.name ?? null,
    license: icon.iconSet?.license ?? null,
  }));
}
```

Client outline:

```tsx
function IconPicker() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function runSearch() {
    const response = await fetch(`/api/icons/search?q=${encodeURIComponent(query)}`);
    setResults(await response.json());
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); void runSearch(); }}>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <button type="submit">Search</button>
      <ul>
        {results.map((icon) => (
          <li key={icon.id}>{icon.name}</li>
        ))}
      </ul>
    </form>
  );
}
```

## Security Notes

Do not expose `SVGICONS_API_TOKEN` through `NEXT_PUBLIC_` variables, browser bundles, logs, or client-side error messages.

## Runnable Example

- [examples/nextjs-icon-picker](../examples/nextjs-icon-picker/)
- [examples/design-system-icons](../examples/design-system-icons/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

This pattern does not implement a full design-system approval workflow by itself. Use a reviewed config or manifest when icon selection needs governance.
