import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { ApiError, SvgiconsClient } from "../../../packages/js/dist/index.js";

loadLocalEnv();

const token = process.env.SVGICONS_API_TOKEN;

if (!token || token === "YOUR_API_TOKEN") {
  console.error("Set SVGICONS_API_TOKEN before running this example.");
  console.error("Copy .env.example to .env or export SVGICONS_API_TOKEN in your shell.");
  process.exit(1);
}

const configPath = resolve(process.cwd(), "icons.config.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const outputPath = resolve(process.cwd(), config.output ?? "dist/sprite.svg");
const iconConfigs = normalizeIconConfigs(config.icons);

if (iconConfigs.length === 0) {
  console.error("icons.config.json must include at least one icon id.");
  process.exit(1);
}

const client = new SvgiconsClient({ token });
const symbols = [];

try {
  for (const item of iconConfigs) {
    const response = await client.icons.getSvg({ icon: item.id });
    const icon = response.data;
    const symbolId = item.symbol || `icon-${slug(icon.name)}`;
    const body = unwrapSvgBody(icon.body);

    symbols.push(
      `  <symbol id="${escapeAttribute(symbolId)}" viewBox="${escapeAttribute(icon.viewBox)}">\n${indent(body, 4)}\n  </symbol>`,
    );

    console.log(`Added ${icon.name} as #${symbolId}`);
  }

  const sprite = [
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">',
    ...symbols,
    "</svg>",
    "",
  ].join("\n");

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, sprite, "utf8");
  console.log(`Wrote ${outputPath}`);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`${error.method} ${error.path} failed: ${error.status} ${error.statusText}`);
    console.error(error.message);
    process.exit(1);
  }

  throw error;
}

function normalizeIconConfigs(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "number" || typeof item === "string") {
        return {
          id: item,
          symbol: null,
        };
      }

      if (item && (typeof item.id === "number" || typeof item.id === "string")) {
        return {
          id: item.id,
          symbol: typeof item.symbol === "string" ? item.symbol : null,
        };
      }

      return null;
    })
    .filter(Boolean);
}

function unwrapSvgBody(body) {
  const trimmed = String(body ?? "").trim();
  const match = trimmed.match(/^<svg\b[^>]*>([\s\S]*)<\/svg>$/i);

  return (match?.[1] ?? trimmed).trim();
}

function indent(value, spaces) {
  const prefix = " ".repeat(spaces);

  return String(value)
    .split(/\r?\n/)
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
