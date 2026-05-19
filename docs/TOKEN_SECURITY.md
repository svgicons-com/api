# Token Security

Svg/icons Pro API tokens are bearer credentials. Anyone with a valid token can call API endpoints allowed by that token's scopes.

This repository documents token-authenticated svgicons.com Pro API workflows. The documented `/api/pro` endpoints require a Pro API token unless the OpenAPI source explicitly declares otherwise. `GET /api/pro/scopes` is metadata/discovery for the Pro API scope catalog only and is not an unauthenticated icon API.

Use placeholders in examples:

```text
SVGICONS_API_TOKEN
YOUR_API_TOKEN
```

Never paste a real token into this repository, GitHub issues, screenshots, logs, or public support threads.

## Environment Variables

Use an environment variable for local development and CI:

```bash
export SVGICONS_API_TOKEN="YOUR_API_TOKEN"
```

The companion CLI accepts `SVGICONS_API_TOKEN` and also supports its existing `SVGICONS_TOKEN` variable. New API repo examples should prefer `SVGICONS_API_TOKEN`.

## Server-Side Usage

Keep API calls that use Pro tokens on the server:

```js
const response = await fetch("https://svgicons.com/api/pro/search?q=settings&limit=5", {
  headers: {
    Authorization: `Bearer ${process.env.SVGICONS_API_TOKEN}`,
    Accept: "application/json",
  },
});
```

Good places to use a token:

- Backend route handlers.
- Serverless functions.
- CI jobs.
- Internal scripts.
- Secure workers.

Avoid using a token in:

- Browser JavaScript.
- Public mobile app bundles.
- Client-side environment variables.
- Analytics payloads.
- Logs or error reports.

## Frontend Proxy Pattern

For frontend apps, route requests through your backend. Keep the token on the server and expose only the behavior your UI needs.

Example proxy shape:

```js
export async function searchIcons(request, response) {
  const query = String(request.query.q || "").slice(0, 100);

  const upstream = await fetch(
    `https://svgicons.com/api/pro/search?q=${encodeURIComponent(query)}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SVGICONS_API_TOKEN}`,
        Accept: "application/json",
      },
    },
  );

  response.status(upstream.status).json(await upstream.json());
}
```

Proxy guidance:

- Validate and bound user input.
- Do not forward arbitrary URLs.
- Do not expose the token in response payloads.
- Apply your own user/session authorization if the data is not public in your product.
- Add caching where appropriate.

## Token Rotation

Rotate a token when:

- It was committed to Git.
- It appeared in logs, screenshots, terminal recordings, or support messages.
- A developer leaves the project.
- A machine or CI environment was compromised.
- You no longer need the token's current scopes.

After rotating:

- Update secret stores and deployments.
- Delete old local config entries.
- Review recent API usage.
- Create replacement tokens with only the required scopes.

## Avoid Committing Secrets

Use `.env` locally and keep it ignored.

Before committing:

```bash
git diff --check
git diff
```

Search for common secret patterns:

```bash
git grep -n "SVGICONS_API_TOKEN\\|Authorization: Bearer\\|YOUR_API_TOKEN"
```

The placeholder `YOUR_API_TOKEN` is safe. Real token values are not.

## Example `.env`

```dotenv
SVGICONS_API_TOKEN=YOUR_API_TOKEN
```

Do not commit `.env`. If you want to share required variable names, commit `.env.example` with placeholders only.
