# Security Policy

Security reports are taken seriously. Please do not open public issues for vulnerabilities, leaked credentials, authentication bypasses, token exposure, or abuse vectors.

## Reporting A Security Issue

Report security issues through the private security reporting channel on the GitHub repository:

```text
https://github.com/svgicons-com/api/security/advisories/new
```

If GitHub private vulnerability reporting is unavailable, contact the project owner through the official Svg/icons support path on https://svgicons.com.

Include:

- A clear description of the issue.
- Steps to reproduce.
- Affected endpoint, SDK method, example, or workflow.
- Impact and suggested mitigation if known.

Do not include real API tokens in the report unless the project owner explicitly asks for a secure transfer method.

## Token Safety

Svg/icons Pro API tokens grant access according to their scopes. Treat them like passwords.

- Store tokens in environment variables or a secret manager.
- Use `SVGICONS_API_TOKEN` for examples and local development.
- Never commit tokens to Git.
- Never ship Pro API tokens in browser JavaScript, mobile app bundles, logs, telemetry, public issues, or screenshots.
- Prefer server-side API calls or a narrow backend proxy for frontend applications.

## If A Token Leaks

Rotate the token immediately from the Svg/icons account token page.

Also:

- Remove the token from source history or logs where possible.
- Invalidate affected deployments or CI secrets.
- Review recent API usage.
- Create a replacement token with only the scopes needed.

## Responsible Disclosure

Please give maintainers a reasonable opportunity to investigate and fix issues before public disclosure.

This repo contains docs, examples, OpenAPI files, and SDK code. Hosted API authentication and entitlement enforcement live in the svgicons.com application.
