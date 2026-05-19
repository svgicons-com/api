import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ApiError, SvgiconsClient } from "../../../packages/js/dist/index.js";

loadLocalEnv();

const token = process.env.SVGICONS_API_TOKEN;
const query = process.argv.slice(2).join(" ").trim() || process.env.SVGICONS_SEARCH_QUERY || "arrow";

if (!token || token === "YOUR_API_TOKEN") {
  console.error("Set SVGICONS_API_TOKEN before running this example.");
  console.error("Copy .env.example to .env or export SVGICONS_API_TOKEN in your shell.");
  process.exit(1);
}

const client = new SvgiconsClient({ token });

try {
  const response = await client.search.icons({
    q: query,
    limit: 10,
  });

  console.log(`Search: ${response.meta.query || query}`);
  console.log(`Results: ${response.data.length}`);

  for (const icon of response.data) {
    const set = icon.iconSet;
    const setText = set ? `${set.name} (${set.prefix})` : "Unknown set";
    const licenseText = set?.license ? `, license: ${set.license}` : "";

    console.log(`- ${icon.name} [${icon.id}]`);
    console.log(`  set: ${setText}${licenseText}`);
    console.log(`  page: ${icon.pageUrl}`);
  }
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`${error.method} ${error.path} failed: ${error.status} ${error.statusText}`);
    console.error(error.message);
    if (error.body) {
      console.error(JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }

  throw error;
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
