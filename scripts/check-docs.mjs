import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const forbiddenContentPatterns = [
  {
    pattern: /npm\s+(?:install|i)\s+[^\n]*(?:@svgicons[^\n]*mcp|svgicons[^\n]*mcp|mcp[^\n]*svgicons)/i,
    message: "Fake MCP npm install instruction",
  },
  {
    pattern: /\bdofollow\b/i,
    message: "Forbidden search-ranking link-attribute language",
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

let failed = false;

for (const file of listTextFiles(".")) {
  const text = readFileSync(file, "utf8");

  if (file.endsWith(".md") && text.trim().length === 0) {
    console.error(`Markdown file is empty: ${file}`);
    failed = true;
  }

  if (/\.(ya?ml)$/.test(file)) {
    validateYamlSanity(file, text);
  }

  for (const { pattern, message } of forbiddenContentPatterns) {
    if (pattern.test(text)) {
      console.error(`${message} in ${file}: ${pattern}`);
      failed = true;
    }
  }

  if (text.includes("/api/v1")) {
    for (const line of text.split(/\r?\n/)) {
      if (line.includes("/api/v1") && !isAllowedApiV1Reference(line)) {
        console.error(`Possible live /api/v1 claim in ${file}: ${line}`);
        failed = true;
      }
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("Documentation check passed.");

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

function isAllowedApiV1Reference(line) {
  return (
    /(not live|not currently live|planned|not available|do not use|not document|before adding|decision|missing api blockers|did not add|does not implement|does not include|intentionally excludes|excludes|no fake|no live|confirm no live|never label|claims that|whether|should describe)/i.test(line) ||
    /^\s*-\s*`?(?:GET\s+)?\/api\/v1/i.test(line)
  );
}

function listTextFiles(root) {
  const output = [];

  for (const entry of readdirSync(root)) {
    if ([".git", "node_modules"].includes(entry)) {
      continue;
    }

    const path = join(root, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      output.push(...listTextFiles(path));
      continue;
    }

    if (/\.(md|ya?ml)$/.test(path)) {
      output.push(path);
    }
  }

  return output;
}
