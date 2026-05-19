# Build A Command Palette

## Status

Live API.

## Problem

Developers and editors often need icon search inside a keyboard-first command palette without leaving an internal tool.

## When To Use This

Use this recipe when a React app or documentation site needs a compact search UI that can select an icon id, copy SVG, or display metadata.

## API Endpoints Used

- `GET /api/pro/search`
- `GET /api/pro/icons/{icon}/svg`

## SDK Methods Used

- `client.search.icons()`
- `client.icons.getSvg()`

## Token Requirements

The search helper needs `SVGICONS_API_TOKEN` on the server. The command palette should call your own backend route.

## Step-By-Step

1. Add a local server route for search.
2. Debounce or submit the query from the command input.
3. Render results in a listbox-style UI.
4. Track active and selected items.
5. Fetch SVG or metadata for the selected item through the server route.
6. Support Escape to close and Enter to select.

## Copy-Paste Code

Server-side helper:

```ts
import { SvgiconsClient } from "@svgicons-com/api-client";

const client = new SvgiconsClient({
  token: process.env.SVGICONS_API_TOKEN,
});

export async function commandPaletteSearch(query: string) {
  const q = query.trim();
  if (q.length < 2) {
    return [];
  }

  const response = await client.search.icons({ q, limit: 10 });
  return response.data.map((icon) => ({
    id: icon.id,
    name: icon.name,
    set: icon.iconSet?.name ?? null,
  }));
}
```

React outline:

```tsx
<div role="dialog" aria-modal="true" aria-label="Search icons">
  <input
    role="combobox"
    aria-expanded="true"
    aria-controls="icon-results"
    value={query}
    onChange={(event) => setQuery(event.target.value)}
  />
  <ul id="icon-results" role="listbox">
    {results.map((icon) => (
      <li role="option" aria-selected={icon.id === selectedId} key={icon.id}>
        {icon.name}
      </li>
    ))}
  </ul>
</div>
```

## Security Notes

Keep token access in server routes and return only the fields your UI needs. Avoid logging search responses if they include internal project choices.

## Runnable Example

- [examples/react-command-palette](../examples/react-command-palette/)

## OpenAPI And Docs

- [OpenAPI spec](../openapi/svgicons.openapi.yaml)
- [Svg/icons API docs](https://svgicons.com/developers/api)
- [API token docs](https://svgicons.com/docs/api-tokens)

## Limitations

The example is a component pattern, not a full application shell. Your app should supply focus trapping, styling, shortcut handling, and any approval workflow.
