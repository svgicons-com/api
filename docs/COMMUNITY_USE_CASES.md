# Community Use Cases

This guide explains how contributors and maintainers should handle community use-case submissions for the Svg/icons API repo.

## Purpose

The use-case system should help developers learn practical workflows for the Svg/icons Pro API, TypeScript SDK, examples, CLI workflows, and MCP-style workflows.

It is not a link directory and should not be used for link manipulation.

## Submission Paths

- GitHub issue using `.github/ISSUE_TEMPLATE/use-case.yml`.
- Pull request adding a Markdown file under `use-cases/`.
- GitHub Discussions are planned only after they are enabled/configured.

## Review Checklist

Before accepting a use case, check:

- It describes a real API, SDK, CLI, MCP, export, CI, or icon workflow.
- It identifies the problem solved.
- It lists the stack and Svg/icons surfaces used.
- It includes useful implementation notes or a short code snippet.
- It does not contain real API tokens.
- It does not contain private credentials or private customer data.
- It does not claim non-live routes, fake scopes, fake rate limits, fake MCP packages, or fake SDK publication.
- Any public link is optional, relevant, safe, and submitted with permission.
- Any screenshots or GIFs are submitted with permission.
- Sponsored or paid relationships are disclosed.

## Strong Use Cases

Strong submissions usually include:

- A clear problem and solution.
- Concrete implementation details.
- Safe token handling.
- A link to a runnable example or recipe when relevant.
- Honest limitations.
- Optional screenshots, code snippets, or repo/demo links.

## Screenshots And Links

Screenshots should not reveal private tokens, internal customer data, private repositories, or credentials.

External links should be reviewed before merge. The repo can accept a use case without including an external link.

If a community use case is later shown on svgicons.com, treat unreviewed user-submitted external links as user-generated content unless they have been editorially curated.

## Featuring Selected Use Cases

Selected use cases may be featured:

- In `use-cases/`.
- In README or docs summaries.
- Potentially on svgicons.com after review.

Only feature with attribution when the submitter grants permission. Do not imply endorsement, partnership, or customer status unless that has been explicitly approved.

## Spam Avoidance

Reject or request edits for submissions that:

- Are link-only.
- Use promotional anchor text.
- Are unrelated to Svg/icons developer workflows.
- Include affiliate or paid links without disclosure.
- Include unsafe or deceptive links.
- Duplicate the same project repeatedly.
- Overstate legal compliance, AI behavior, or product capabilities.

## Fake Claims

Do not accept fabricated use cases, fake company claims, fake screenshots, or implied customer quotes. Sample use cases must be clearly marked as `status: "example"` and should use generic authors such as `Svg/icons example team`.

## Updates And Removals

If a submitter asks to update or remove a use case:

1. Verify the request comes from the original submitter or an authorized representative when practical.
2. Remove private data immediately if reported.
3. Update broken links or stale workflow notes.
4. Preserve a short maintainer note in the pull request or issue when the change affects published docs.
