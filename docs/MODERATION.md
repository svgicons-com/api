# Moderation

This document defines moderation rules for issues, pull requests, use cases, examples, recipes, and community links in this repo.

## Accept

Accept or approve submissions that include:

- Real API, SDK, CLI, MCP, export, CI, or icon workflows.
- Useful code snippets with placeholders only.
- Clear problem and solution descriptions.
- Honest limitations.
- Relevant links submitted with permission.
- Screenshots or GIFs that do not expose private data.

## Reject Or Request Edits

Reject or request edits for:

- Spammy links.
- Affiliate or sponsored links that are not disclosed.
- Fake claims, fake customer stories, or fabricated usage.
- Irrelevant SEO submissions.
- Real API tokens.
- Private credentials.
- Private customer data.
- Malware, abusive content, deceptive downloads, or unsafe links.
- Legal/compliance overclaims.
- Claims that `/api/v1`, dedicated `/api/pro/icon-sets`, public REST token-management, public REST usage-reporting, or fake MCP packages are live.

## Link Handling

- User-submitted links are optional.
- Links may be removed during review.
- A use case can be accepted without an external link.
- Website publication should treat unreviewed user-submitted links as user-generated content.
- Paid or sponsored links need explicit disclosure and appropriate sponsored/nofollow handling.
- Do not trade links for inclusion.

## Privacy

Remove or redact:

- API tokens.
- Authorization headers.
- Private project names when not approved for sharing.
- Private customer or user data.
- Internal URLs, screenshots, or logs that expose confidential information.

## Takedown And Update Process

When someone requests an update or removal:

1. Prioritize removing secrets or private data.
2. Ask for enough context to verify ownership when needed.
3. Edit or remove links if permission is unclear.
4. Update stale docs when source repos confirm behavior changed.
5. Record the moderation action in the related issue or pull request when appropriate.

## Maintainer Notes

Moderation should protect developer usefulness. A submission with no external link but strong technical detail is better than a link-heavy submission with little workflow value.
