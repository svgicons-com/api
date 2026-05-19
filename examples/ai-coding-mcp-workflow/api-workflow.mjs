import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ApiError, SvgiconsClient } from "../../packages/js/dist/index.js";

loadLocalEnv();

const token = process.env.SVGICONS_API_TOKEN;
const query = process.argv.slice(2).join(" ").trim() || process.env.SVGICONS_AI_QUERY || "dashboard navigation";

if (!token || token === "YOUR_API_TOKEN") {
  console.error("Set SVGICONS_API_TOKEN before running this example.");
  process.exit(1);
}

const client = new SvgiconsClient({ token });

try {
  const search = await client.search.icons({ q: query, limit: 5 });
  const icons = [];

  for (const icon of search.data.slice(0, 3)) {
    const svg = await client.icons.getSvg({ icon: icon.id });
    icons.push({
      id: svg.data.id,
      name: svg.data.name,
      label: svg.data.label,
      svg: svg.data.svg,
      iconSet: svg.data.iconSet
        ? {
            name: svg.data.iconSet.name,
            prefix: svg.data.iconSet.prefix,
            license: svg.data.iconSet.license,
          }
        : null,
    });
  }

  console.log(JSON.stringify({ query, icons }, null, 2));
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`${error.method} ${error.path} failed: ${error.status} ${error.statusText}`);
    console.error(error.message);
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
