import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const recipePaths = [
  "recipes/search-icons.md",
  "recipes/fetch-svg-safely.md",
  "recipes/build-a-react-icon-picker.md",
  "recipes/build-a-command-palette.md",
  "recipes/proxy-api-tokens-in-nextjs.md",
  "recipes/generate-svg-sprite.md",
  "recipes/manage-project-kits.md",
  "recipes/export-icons-to-frameworks.md",
  "recipes/generate-license-manifest.md",
  "recipes/use-svgicons-with-mcp.md",
  "recipes/use-svgicons-in-ci.md",
];

const useCaseSamplePaths = [
  "use-cases/examples/design-system-icon-picker.md",
  "use-cases/examples/ai-coding-assistant-icons.md",
  "use-cases/examples/ci-license-audit.md",
  "use-cases/examples/command-palette-icon-search.md",
  "use-cases/examples/svg-sprite-workflow.md",
];

const issueTemplatePaths = [
  ".github/ISSUE_TEMPLATE/use-case.yml",
  ".github/ISSUE_TEMPLATE/api-feedback.yml",
  ".github/ISSUE_TEMPLATE/bug-report.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
];

const requiredPaths = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CHANGELOG.md",
  "LICENSE",
  "package-lock.json",
  ".gitignore",
  ".editorconfig",
  "docs/LINK_POLICY.md",
  "docs/COMMUNITY_USE_CASES.md",
  "docs/MODERATION.md",
  "docs/RELEASE_CHECKLIST.md",
  "docs/PUBLISHING.md",
  "docs/API_VERSIONING.md",
  "docs/CI.md",
  "docs/MAINTAINER_CHECKLIST.md",
  "docs/TOKEN_SECURITY.md",
  "docs/ROADMAP.md",
  "openapi/README.md",
  "openapi/svgicons.openapi.yaml",
  "openapi/examples/README.md",
  "openapi/examples/search-icons.request.json",
  "openapi/examples/search-icons.response.json",
  "openapi/examples/get-icon.response.json",
  "openapi/examples/get-icon-svg.response.txt",
  "openapi/examples/png-export.request.json",
  "openapi/examples/png-export.response.json",
  "openapi/examples/project-kit-create.request.json",
  "openapi/examples/project-kit.response.json",
  "openapi/examples/project-kit-export.request.json",
  "openapi/examples/project-kit-export.response.json",
  "openapi/examples/error-unauthorized.response.json",
  "openapi/examples/error-not-found.response.json",
  "openapi/examples/error-validation.response.json",
  "packages/js/README.md",
  "packages/js/package.json",
  "packages/js/tsconfig.json",
  "packages/js/src/index.ts",
  "packages/js/src/client.ts",
  "packages/js/src/errors.ts",
  "packages/js/src/types.ts",
  "packages/js/src/scopes.ts",
  "packages/js/src/me.ts",
  "packages/js/src/search.ts",
  "packages/js/src/icons.ts",
  "packages/js/src/project-kits.ts",
  "packages/js/test/client.test.mjs",
  "examples/README.md",
  "examples/node-search-icons/README.md",
  "examples/node-search-icons/package.json",
  "examples/node-search-icons/.env.example",
  "examples/node-search-icons/src/search-icons.mjs",
  "examples/server-side-token-proxy/README.md",
  "examples/server-side-token-proxy/package.json",
  "examples/server-side-token-proxy/.env.example",
  "examples/server-side-token-proxy/src/server.mjs",
  "examples/server-side-token-proxy/public/index.html",
  "examples/nextjs-icon-picker/README.md",
  "examples/nextjs-icon-picker/package.json",
  "examples/nextjs-icon-picker/.env.example",
  "examples/nextjs-icon-picker/tsconfig.json",
  "examples/nextjs-icon-picker/app/page.tsx",
  "examples/nextjs-icon-picker/app/layout.tsx",
  "examples/nextjs-icon-picker/app/api/icons/search/route.ts",
  "examples/nextjs-icon-picker/app/api/icons/[icon]/svg/route.ts",
  "examples/nextjs-icon-picker/app/components/IconPicker.tsx",
  "examples/svg-sprite-generator/README.md",
  "examples/svg-sprite-generator/package.json",
  "examples/svg-sprite-generator/.env.example",
  "examples/svg-sprite-generator/icons.config.json",
  "examples/svg-sprite-generator/src/generate-sprite.mjs",
  "examples/svg-sprite-generator/dist/.gitkeep",
  "examples/react-command-palette/README.md",
  "examples/react-command-palette/package.json",
  "examples/react-command-palette/.env.example",
  "examples/react-command-palette/tsconfig.json",
  "examples/react-command-palette/src/CommandPalette.tsx",
  "examples/react-command-palette/src/searchIcons.ts",
  "examples/react-command-palette/src/types.ts",
  "examples/design-system-icons/README.md",
  "examples/design-system-icons/package.json",
  "examples/design-system-icons/.env.example",
  "examples/design-system-icons/approved-icons.config.json",
  "examples/design-system-icons/src/build-manifest.mjs",
  "examples/design-system-icons/output/.gitkeep",
  "examples/ci-license-audit/README.md",
  "examples/ci-license-audit/package.json",
  "examples/ci-license-audit/.env.example",
  "examples/ci-license-audit/icons.audit.json",
  "examples/ci-license-audit/src/generate-report.mjs",
  "examples/ci-license-audit/.github/workflows/icon-license-audit.example.yml",
  "examples/ci-license-audit/output/.gitkeep",
  "examples/ai-coding-mcp-workflow/README.md",
  "examples/ai-coding-mcp-workflow/package.json",
  "examples/ai-coding-mcp-workflow/.env.example",
  "examples/ai-coding-mcp-workflow/api-workflow.mjs",
  "examples/ai-coding-mcp-workflow/prompts.md",
  "examples/framework-export-workflow/README.md",
  "examples/framework-export-workflow/package.json",
  "examples/framework-export-workflow/.env.example",
  "examples/framework-export-workflow/selected-icons.json",
  "examples/framework-export-workflow/src/prepare-export.mjs",
  "recipes/README.md",
  ...recipePaths,
  "use-cases/README.md",
  "use-cases/TEMPLATE.md",
  "use-cases/examples/README.md",
  ...useCaseSamplePaths,
  ...issueTemplatePaths,
  ".github/pull_request_template.md",
  ".github/workflows/validate.yml",
  ".github/workflows/test.yml",
  "redocly.yaml",
  "scripts/check-secrets.mjs",
  "scripts/check-docs.mjs",
  "scripts/sync-openapi.mjs",
];

const bannedPatterns = [
  new RegExp(`SVGICONS${"_"}API${"_"}KEY`),
  new RegExp(`YOUR${"_"}PRO${"_"}API${"_"}TOKEN`),
  new RegExp(`svgicons${"_"}secret${"_"}token`, "i"),
  /sk-[A-Za-z0-9]{12,}/,
  /Bearer\s+(?!\$SVGICONS_API_TOKEN|YOUR_API_TOKEN|\$\{process\.env\.SVGICONS_API_TOKEN\})[A-Za-z0-9._~+/=-]{20,}/,
];

const forbiddenContentPatterns = [
  {
    pattern: /npm\s+(?:install|i)\s+[^\n]*(?:@svgicons[^\n]*mcp|svgicons[^\n]*mcp|mcp[^\n]*svgicons)/i,
    message: "Fake MCP npm install instruction",
  },
  {
    pattern: /\bdofollow\b/i,
    message: "Forbidden dofollow/backlink language",
  },
  {
    pattern: /must\s+link\s+back|required\s+backlink|link\s+back\s+required/i,
    message: "Forced backlink language",
  },
  {
    pattern: /\b\d+\s*(?:requests|reqs)\s*(?:\/|per)\s*(?:second|minute|hour|day)\b/i,
    message: "Fake concrete rate-limit claim",
  },
  {
    pattern: /\b(?:tokens?:read|tokens?:write|usage:read|usage:write|billing:read|admin:[a-z-]+)\b/i,
    message: "Fake token-scope claim",
  },
];

const tokenRequirementChecks = [
  {
    file: "README.md",
    phrases: ["## Authentication Required", "Pro API token", "SVGICONS_API_TOKEN", "no official unauthenticated public icon REST API"],
  },
  {
    file: "packages/js/README.md",
    phrases: ["Pro API token", "SVGICONS_API_TOKEN", "client.scopes.list()"],
  },
  {
    file: "openapi/README.md",
    phrases: ["Pro API token", "GET /api/pro/scopes", "metadata/discovery"],
  },
  {
    file: "examples/README.md",
    phrases: ["Pro API token", "SVGICONS_API_TOKEN", "no official unauthenticated public icon REST API"],
  },
];

let failed = false;

for (const path of requiredPaths) {
  if (!existsSync(path)) {
    console.error(`Missing required path: ${path}`);
    failed = true;
  }
}

for (const { file, phrases } of tokenRequirementChecks) {
  if (!existsSync(file)) {
    continue;
  }

  const text = readFileSync(file, "utf8");
  for (const phrase of phrases) {
    if (!text.includes(phrase)) {
      console.error(`Token-required messaging missing "${phrase}" in ${file}`);
      failed = true;
    }
  }
}

if (existsSync("C:/Svgicons.com/api")) {
  console.error("Forbidden path exists: C:/Svgicons.com/api");
  failed = true;
}

if (existsSync("openapi/svgicons.openapi.yaml")) {
  const spec = readFileSync("openapi/svgicons.openapi.yaml", "utf8");
  if (!spec.includes('openapi: "3.1.0"') && !spec.includes("openapi: 3.1.0")) {
    console.error("OpenAPI YAML does not declare openapi: 3.1.0");
    failed = true;
  }
  if (!spec.includes("/api/pro/search")) {
    console.error("OpenAPI YAML does not include /api/pro/search");
    failed = true;
  }
  if (spec.includes("/api/v1/")) {
    console.error("OpenAPI YAML must not document planned /api/v1 endpoints as live");
    failed = true;
  }
  if (spec.includes("/api/pro/icon-sets")) {
    console.error("OpenAPI YAML must not document dedicated /api/pro/icon-sets endpoints as live");
    failed = true;
  }
  if (spec.includes('"\\/mcp"') || spec.includes('"/mcp"') || spec.includes(" /mcp:")) {
    console.error("OpenAPI YAML must not model MCP as a REST path");
    failed = true;
  }
}

for (const file of listTextFiles(".")) {
  const text = readFileSync(file, "utf8");

  if (file.endsWith(".md") && text.trim().length === 0) {
    console.error(`Markdown file is empty: ${file}`);
    failed = true;
  }

  for (const pattern of bannedPatterns) {
    if (pattern.test(text)) {
      console.error(`Potential secret or forbidden placeholder in ${file}: ${pattern}`);
      failed = true;
    }
  }

  if (!isValidatorFile(file)) {
    for (const { pattern, message } of forbiddenContentPatterns) {
      if (pattern.test(text)) {
        console.error(`${message} in ${file}: ${pattern}`);
        failed = true;
      }
    }
  }

  if (isExamplesPath(file)) {
    if (text.includes("/api/v1")) {
      console.error(`Examples must not use /api/v1: ${file}`);
      failed = true;
    }
  }

  if (isRecipePath(file)) {
    if (!/^## Status\s*$/m.test(text)) {
      console.error(`Recipe is missing a Status section: ${file}`);
      failed = true;
    }

    if (!/^## Security Notes\s*$/m.test(text)) {
      console.error(`Recipe is missing Security Notes: ${file}`);
      failed = true;
    }

    if (!text.includes("../examples/") && !/no runnable example/i.test(text)) {
      console.error(`Recipe must link to an example or explicitly say no runnable example: ${file}`);
      failed = true;
    }

    for (const line of text.split(/\r?\n/)) {
      if (line.includes("/api/v1") && !/(not live|not currently live|planned|not available|do not use)/i.test(line)) {
        console.error(`Recipe appears to use /api/v1 as live: ${file}: ${line}`);
        failed = true;
      }
    }
  }

  if (isUseCaseSamplePath(file)) {
    if (!/^status:\s*"example"\s*$/m.test(text)) {
      console.error(`Sample use case must be marked as status: "example": ${file}`);
      failed = true;
    }

    if (!/sample use case|sample submission|not a real customer submission/i.test(text)) {
      console.error(`Sample use case must clearly say it is a sample/example: ${file}`);
      failed = true;
    }

    if (/status:\s*"community-submitted"/i.test(text) || /permission_to_feature:\s*true/i.test(text)) {
      console.error(`Sample use case must not look like a real submission: ${file}`);
      failed = true;
    }

    if (/\b(?:Acme|Globex|Initech|Fortune\s*\d+|customer quote)\b/i.test(text)) {
      console.error(`Sample use case appears to include fake customer/company claims: ${file}`);
      failed = true;
    }
  }

  if (isUseCaseTemplatePath(file)) {
    if (!/Do not include real API tokens/i.test(text)) {
      console.error(`Use-case template must include token warning: ${file}`);
      failed = true;
    }

    if (!/External links are optional/i.test(text)) {
      console.error(`Use-case template must state external links are optional: ${file}`);
      failed = true;
    }
  }

  if (isIssueTemplatePath(file)) {
    validateIssueTemplate(file, text);
  }

  if (/\.(ya?ml)$/.test(file)) {
    validateYamlSanity(file, text);
  }
}

for (const file of listTextFiles(".").filter((path) => path.endsWith(".json"))) {
  try {
    JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`Invalid JSON in ${file}: ${error.message}`);
    failed = true;
  }
}

for (const file of listTextFiles(".").filter((path) => isExamplesPath(path) && path.endsWith(".mjs"))) {
  try {
    execFileSync("node", ["--check", file], { stdio: "pipe" });
  } catch (error) {
    console.error(`JavaScript syntax check failed in ${file}`);
    if (error.stderr) {
      console.error(String(error.stderr));
    }
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log("Scaffold validation passed.");

function listTextFiles(root) {
  const output = [];
  for (const entry of readdirSync(root)) {
    if (entry === ".git" || entry === "node_modules") {
      continue;
    }

    const path = join(root, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      output.push(...listTextFiles(path));
      continue;
    }

    if (/\.(md|json|ya?ml|mjs|js|ts|tsx|txt|editorconfig|gitignore)$/.test(path) || entry === "LICENSE") {
      output.push(path);
    }
  }
  return output;
}

function isExamplesPath(file) {
  return file.startsWith(`examples${"\\"}`) || file.startsWith("examples/");
}

function isRecipePath(file) {
  return recipePaths.some((recipePath) => file === recipePath || file === recipePath.replaceAll("/", "\\"));
}

function isUseCaseSamplePath(file) {
  return useCaseSamplePaths.some((samplePath) => file === samplePath || file === samplePath.replaceAll("/", "\\"));
}

function isUseCaseTemplatePath(file) {
  return file === "use-cases/TEMPLATE.md" || file === `use-cases${"\\"}TEMPLATE.md`;
}

function isIssueTemplatePath(file) {
  return issueTemplatePaths.some((templatePath) => file === templatePath || file === templatePath.replaceAll("/", "\\"));
}

function isValidatorFile(file) {
  return file.startsWith(`scripts${"\\"}`) || file.startsWith("scripts/");
}

function validateIssueTemplate(file, text) {
  if (text.trim().length === 0) {
    console.error(`Issue template is empty: ${file}`);
    failed = true;
  }

  if (text.includes("\t")) {
    console.error(`Issue template must not use tabs: ${file}`);
    failed = true;
  }

  if (file.endsWith("config.yml")) {
    if (!/^blank_issues_enabled:/m.test(text) || !/^contact_links:/m.test(text)) {
      console.error(`Issue template config is missing expected keys: ${file}`);
      failed = true;
    }
    return;
  }

  for (const key of ["name:", "description:", "title:", "labels:", "body:"]) {
    if (!text.includes(key)) {
      console.error(`Issue template missing ${key} ${file}`);
      failed = true;
    }
  }
}

function validateYamlSanity(file, text) {
  if (text.trim().length === 0) {
    console.error(`YAML file is empty: ${file}`);
    failed = true;
  }

  if (text.includes("\t")) {
    console.error(`YAML file must not use tabs: ${file}`);
    failed = true;
  }

  if (!text.includes(":")) {
    console.error(`YAML file does not contain key/value content: ${file}`);
    failed = true;
  }
}
