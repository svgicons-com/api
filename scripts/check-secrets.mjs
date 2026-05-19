import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const bannedPatterns = [
  new RegExp(`SVGICONS${"_"}API${"_"}KEY`),
  new RegExp(`YOUR${"_"}PRO${"_"}API${"_"}TOKEN`),
  new RegExp(`svgicons${"_"}secret${"_"}token`, "i"),
  /sk-[A-Za-z0-9]{12,}/,
  /Bearer\s+(?!\$SVGICONS_API_TOKEN|YOUR_API_TOKEN|\$\{process\.env\.SVGICONS_API_TOKEN\})[A-Za-z0-9._~+/=-]{20,}/,
];

let failed = false;

for (const file of listTextFiles(".")) {
  const text = readFileSync(file, "utf8");

  for (const pattern of bannedPatterns) {
    if (pattern.test(text)) {
      console.error(`Potential secret or forbidden placeholder in ${file}: ${pattern}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("Secret check passed.");

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

    if (/\.(md|json|ya?ml|mjs|js|ts|tsx|txt|editorconfig|gitignore)$/.test(path) || entry === "LICENSE") {
      output.push(path);
    }
  }

  return output;
}
