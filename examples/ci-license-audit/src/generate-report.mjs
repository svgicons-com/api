import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { ApiError, SvgiconsClient } from "../../../packages/js/dist/index.js";

loadLocalEnv();

const token = process.env.SVGICONS_API_TOKEN;

if (!token || token === "YOUR_API_TOKEN") {
  console.error("Set SVGICONS_API_TOKEN before running this example.");
  process.exit(1);
}

const config = JSON.parse(readFileSync(resolve(process.cwd(), "icons.audit.json"), "utf8"));
const iconIds = normalizeIconIds(config.icons);

if (iconIds.length === 0) {
  console.error("icons.audit.json must include at least one icon id.");
  process.exit(1);
}

const client = new SvgiconsClient({ token });
const rows = [];

try {
  for (const iconId of iconIds) {
    const response = await client.icons.get({ icon: iconId });
    const icon = response.data;
    const set = icon.iconSet;

    rows.push({
      id: icon.id,
      name: icon.name,
      pageUrl: icon.pageUrl,
      svgUrl: icon.svgUrl,
      iconSet: set
        ? {
            name: set.name,
            prefix: set.prefix,
            license: set.license,
            licenseUrl: set.licenseUrl,
            spdx: set.spdx,
            author: set.author,
            authorUrl: set.authorUrl,
            pageUrl: set.pageUrl,
          }
        : null,
    });

    console.log(`Checked ${icon.name} [${icon.id}]`);
  }

  writeJsonReport(resolve(process.cwd(), config.output?.json ?? "output/third-party-icons.json"), rows);
  writeMarkdownReport(resolve(process.cwd(), config.output?.markdown ?? "output/THIRD_PARTY_ICONS.md"), rows);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`${error.method} ${error.path} failed: ${error.status} ${error.statusText}`);
    console.error(error.message);
    process.exit(1);
  }

  throw error;
}

function writeJsonReport(path, icons) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "svgicons.com Pro API",
        icons,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log(`Wrote ${path}`);
}

function writeMarkdownReport(path, icons) {
  const lines = [
    "# Third-Party Icons",
    "",
    "Generated from svgicons.com Pro API metadata.",
    "",
    "This report is a developer provenance aid. It is not legal advice.",
    "",
    "| Icon | Icon set | License | Source |",
    "| --- | --- | --- | --- |",
  ];

  for (const icon of icons) {
    const set = icon.iconSet;
    lines.push(
      `| ${markdownLink(`${icon.name} [${icon.id}]`, icon.pageUrl)} | ${escapeMarkdown(set?.name ?? "Unknown set")} | ${licenseCell(set)} | ${markdownLink("Source", set?.pageUrl ?? icon.svgUrl)} |`,
    );
  }

  lines.push("");

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${path}`);
}

function licenseCell(set) {
  if (!set) {
    return "Unknown";
  }

  const label = set.spdx || set.license || "Unknown";

  return set.licenseUrl ? markdownLink(label, set.licenseUrl) : escapeMarkdown(label);
}

function markdownLink(label, url) {
  return `[${escapeMarkdown(label)}](${String(url).replace(/\)/g, "%29")})`;
}

function escapeMarkdown(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function normalizeIconIds(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => Number(typeof item === "object" && item ? item.id : item))
    .filter((item) => Number.isInteger(item) && item > 0);
}

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
