# Publishing

This guide is for maintainers who publish repository releases, update the OpenAPI spec, or publish the TypeScript SDK.

## Repository Releases

Before tagging a repository release:

1. Review [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).
2. Confirm `README.md`, `CHANGELOG.md`, OpenAPI docs, SDK docs, examples, recipes, and use-case templates are current.
3. Run the validation stack:

```bash
npm ci
npm run validate
git diff --check
```

4. Create a tag only after review:

```bash
git tag v0.1.0-alpha.0
git push origin v0.1.0-alpha.0
```

Use the version that matches the approved release.

## SDK Publication

The SDK package under `packages/js` is named `@svgicons-com/api-client`. It remains unpublished until maintainers approve npm publication.

Before npm publication:

1. Confirm package ownership and npm organization access.
2. Review `packages/js/package.json`, package exports, license, and README.
3. Confirm SDK methods match live `/api/pro` operations in `openapi/svgicons.openapi.yaml`.
4. Run `npm run validate`.
5. Choose the release version.
6. Publish from an approved maintainer environment.

Documentation should say "install from npm after the package is published" until publication actually happens.

## Updating OpenAPI

The svgicons.com website application owns the source OpenAPI JSON. This repo keeps the public YAML copy at:

```text
openapi/svgicons.openapi.yaml
```

When maintainers have access to the website source OpenAPI file, sync the YAML with:

```bash
npm run sync:openapi
npm run validate:openapi
```

In public clones and CI, `npm run validate:openapi` validates the committed YAML and runs Redocly linting without requiring the website repository.

## CHANGELOG

For each release:

1. Add or update the relevant `CHANGELOG.md` section.
2. List only shipped repository changes.
3. Keep SDK npm publication status accurate.
4. Never label `/api/v1`, REST icon-set endpoints, fake MCP packages, fake token scopes, or fixed rate limits as live.

## Website Links

When svgicons.com links to this repo, use natural developer links such as:

- API repo: `https://github.com/svgicons-com/api`
- OpenAPI spec: `https://github.com/svgicons-com/api/tree/main/openapi`
- TypeScript SDK: `https://github.com/svgicons-com/api/tree/main/packages/js`
- Examples: `https://github.com/svgicons-com/api/tree/main/examples`
- Recipes: `https://github.com/svgicons-com/api/tree/main/recipes`

Do not publish user-submitted external links on svgicons.com without moderation and link-policy handling.
