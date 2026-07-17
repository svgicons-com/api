# Changelog

All notable changes to this repository will be documented here.

This repo follows practical pre-1.0 versioning while the public API docs and SDK mature. The hosted svgicons.com API may have its own deployment cadence.

## 0.2.0 - 2026-07-17

- Documented the new `DELETE .../icons/{icon}` parameters: `all_variants` (default `true` for backward compatibility) and `edit_id` (entry-precise removal of one custom-icon variant), including response fields and examples.
- Documented custom-icon entries in collection reads: `entryId`, `customEditId`, `customName`, and customized SVG snapshot bodies, plus `styledWith` on kit summaries and `hasCustomIcons` on the detail response.
- Added a `patchLiveContractDeltas` step to the OpenAPI sync script so the public YAML tracks live contract additions until the website source file regenerates; documented the sync procedure in `openapi/README.md`.
- Added credits-era positioning to the README: website Icon Collections are member-level with Pro credits; the REST API itself remains Pro-only and unlimited.

## 0.1.0-alpha.0 - Initial public-ready repository

- Added public API repository structure.
- Added token security, roadmap, link policy, contribution, and security docs.
- Added synchronized OpenAPI spec for the real live `/api/pro` REST API.
- Added alpha TypeScript SDK package source for `@svgicons-com/api-client`.
- Added core examples.
- Added advanced examples.
- Added developer recipes.
- Added community use-case submission system.
- Added CI workflows, validation scripts, and release-readiness docs.
- Prepared svgicons.com website developer page integration.
- SDK npm publication is pending and has not happened yet.

## 0.0.0

- Initial scaffold for `https://github.com/svgicons-com/api`.
