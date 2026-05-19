# OpenAPI Examples

This directory contains request and response examples for the live Svg/icons Pro REST API.

Rules:

- Use live endpoints only.
- Use `SVGICONS_API_TOKEN` and `YOUR_API_TOKEN` placeholders.
- Do not include real API tokens.
- Keep binary responses such as PNG and ZIP downloads documented by content type and filename behavior rather than embedding binary data.
- Keep MCP examples outside the OpenAPI spec because MCP is JSON-RPC, not REST/OpenAPI.

For `GET` routes, `*.request.json` files describe the method, path, headers, and query string because there is no request body. For binary endpoints, `*.response.json` files describe HTTP response metadata; the live response body is bytes, not JSON.
