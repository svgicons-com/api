# Link Policy

This policy applies to the public API repo, examples, recipes, community use cases, and any website implementation that republishes community submissions.

## General Principles

- Natural links to `https://svgicons.com` are okay in README files, examples, recipes, and docs.
- Natural links to developer docs are okay when they help users complete a task.
- Do not require users to add backlinks.
- Do not imply that API access, support, visibility, or community acceptance depends on linking back.
- Do not request search-ranking link attributes or trade links for inclusion.
- Optional attribution snippets are allowed.
- User-submitted use cases should not be used as link spam.
- Sponsored or paid links should not be treated as normal editorial links.

## Approved Project Links

Use these links where relevant:

- `https://svgicons.com`
- `https://svgicons.com/developers/api`
- `https://svgicons.com/developers/mcp`
- `https://svgicons.com/openapi/pro-api.json`
- `https://github.com/svgicons-com/cli`
- `https://github.com/svgicons-com/api`

## Attribution

Optional attribution is allowed when users want to include it.

Acceptable wording:

```html
Icons from <a href="https://svgicons.com">Svg/icons</a>
```

Rules:

- Attribution must be optional unless a specific third-party icon license requires it.
- Do not use forced backlink language.
- Do not ask users to use keyword-stuffed anchor text.
- License-specific attribution requirements should come from the icon set license/provenance data, not from Svg/icons marketing copy.

## Community Use Cases

Community submissions may include optional external links, but they require care.

Submission rules:

- External links are optional.
- Submitters must confirm they own or are allowed to submit the linked project.
- Submissions should describe a real workflow, not just request a link.
- Low-value link-only submissions should be rejected.
- Links should not use promotional anchor text.
- Links should be reviewed before they are featured.
- The repo can accept a use case without publishing the external link.

Website publication rules:

- Any user-generated external links on `svgicons.com` should be marked `rel="ugc"` unless curated editorially.
- If a link is paid, sponsored, or otherwise compensated, use sponsored handling such as `rel="sponsored"` and do not treat it as editorial.
- Editorially reviewed examples can be linked normally only after review for quality, relevance, and ownership.
- Do not automatically publish links from GitHub issues to `svgicons.com`.

## Examples And Recipes

Examples and recipes may link to:

- Svg/icons docs and developer pages.
- The CLI repo.
- The API repo.
- Standards, package docs, or framework docs needed to complete the example.

Examples and recipes should not:

- Require users to link back.
- Add unrelated commercial links.
- Include affiliate, paid, or sponsored links unless explicitly labeled and handled.
- Include real API tokens or secrets.

## Pull Requests And Issues

Maintainers should review links in PRs and issues before merging docs.

Reject or edit:

- Link-only submissions.
- Keyword-stuffed anchor text.
- Links unrelated to Svg/icons API, CLI, MCP, exports, or icon workflows.
- Links to spam, malware, deceptive downloads, or unsafe content.
- Links that appear paid or sponsored but are not disclosed.

Keep:

- Links to reproducible examples.
- Links to open-source integrations.
- Links to relevant docs.
- Links to real user projects when the submission explains the workflow and passes review.

## Implementation Notes For svgicons.com

If community use cases are later displayed on `svgicons.com`:

- Store moderation status separately from submission data.
- Default user-submitted external links to `rel="ugc"`.
- Add `rel="sponsored"` for paid placements.
- Do not render arbitrary user HTML.
- Sanitize URLs and reject unsafe protocols.
- Use neutral anchor text such as the project or organization name.
- Keep an editorial review trail for links that are upgraded from UGC to curated/editorial.
