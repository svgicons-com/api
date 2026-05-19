# CI License And Provenance Report

Generate a third-party icon provenance report from live Svg/icons Pro API metadata.

## Use Case

Engineering teams often need a repeatable way to review which icon sets are used in a repository. This example reads a list of approved icon ids, fetches metadata through the SDK, and writes Markdown/JSON reports that can be uploaded from CI.

This is not legal advice and does not claim legal compliance automation. It is a developer-friendly reporting workflow that surfaces source, license, and provenance metadata when the API has it.

## Links

- SDK package: [../../packages/js](../../packages/js)
- OpenAPI spec: [../../openapi/svgicons.openapi.yaml](../../openapi/svgicons.openapi.yaml)
- API docs: https://svgicons.com/developers/api
- Token docs: https://svgicons.com/docs/api-tokens
- CLI repo: https://github.com/svgicons-com/cli

## Setup

```bash
npm install
copy .env.example .env
```

Edit `.env`:

```bash
SVGICONS_API_TOKEN=YOUR_API_TOKEN
```

On macOS/Linux use `cp .env.example .env`.

## Run Locally

```bash
npm run report
```

Outputs:

- `output/THIRD_PARTY_ICONS.md`
- `output/third-party-icons.json`

## GitHub Actions

Copy `.github/workflows/icon-license-audit.example.yml` into your repository's workflow directory and store the token as a GitHub Actions secret named `SVGICONS_API_TOKEN`.

The workflow does not include a token value and should not print secrets.

## CLI Companion Workflow

The existing Svg/icons CLI also supports local lockfile-based license workflows:

```bash
svgicons license check --allow MIT,Apache-2.0,ISC --fail
svgicons license export --format markdown --output THIRD_PARTY_ICONS.md
```

Use the CLI when you already maintain `svgicons.lock`. Use this API example when you want to fetch current metadata for a small reviewed list of ids.

## Security Notes

Keep `SVGICONS_API_TOKEN` in CI secrets or server-side environment variables. Do not commit `.env`, workflow secrets, or generated logs containing token values.
