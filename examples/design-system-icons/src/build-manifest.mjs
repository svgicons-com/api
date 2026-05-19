import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { ApiError, SvgiconsClient } from "../../../packages/js/dist/index.js";

loadLocalEnv();

const token = process.env.SVGICONS_API_TOKEN;

if (!token || token === "YOUR_API_TOKEN") {
  console.error("Set SVGICONS_API_TOKEN before running this example.");
  process.exit(1);
}

const configPath = resolve(process.cwd(), "approved-icons.config.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const outputPath = resolve(process.cwd(), config.output ?? "output/icons.manifest.json");
const client = new SvgiconsClient({ token });
const icons = normalizeConfigIcons(config.icons);

if (icons.length === 0) {
  console.error("approved-icons.config.json must include at least one icon.");
  process.exit(1);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source: "svgicons.com Pro API",
  icons: [],
};

try {
  for (const item of icons) {
    const response = await client.icons.getSvg({ icon: item.id });
    const icon = response.data;

    manifest.icons.push({
      id: icon.id,
      name: icon.name,
      approvedName: item.approvedName ?? icon.label ?? icon.name,
      usage: item.usage ?? null,
      category: icon.category ?? null,
      width: icon.width,
      height: icon.height,
      viewBox: icon.viewBox,
      pageUrl: icon.pageUrl,
      svgUrl: icon.svgUrl,
      svg: icon.svg,
      iconSet: icon.iconSet
        ? {
            id: icon.iconSet.id,
            name: icon.iconSet.name,
            prefix: icon.iconSet.prefix,
            license: icon.iconSet.license,
            licenseUrl: icon.iconSet.licenseUrl,
            spdx: icon.iconSet.spdx,
            author: icon.iconSet.author,
            authorUrl: icon.iconSet.authorUrl,
            pageUrl: icon.iconSet.pageUrl,
          }
        : null,
    });

    console.log(`Added ${icon.name} [${icon.id}]`);
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outputPath}`);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`${error.method} ${error.path} failed: ${error.status} ${error.statusText}`);
    console.error(error.message);
    process.exit(1);
  }

  throw error;
}

function normalizeConfigIcons(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "number" || typeof item === "string") {
        return {
          id: item,
        };
      }

      if (item && (typeof item.id === "number" || typeof item.id === "string")) {
        return item;
      }

      return null;
    })
    .filter(Boolean);
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
