import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ApiError, SvgiconsClient } from "../../../packages/js/dist/index.js";

loadLocalEnv();

const token = process.env.SVGICONS_API_TOKEN;

if (!token || token === "YOUR_API_TOKEN") {
  console.error("Set SVGICONS_API_TOKEN before running this example.");
  process.exit(1);
}

const config = JSON.parse(readFileSync(resolve(process.cwd(), "selected-icons.json"), "utf8"));
const client = new SvgiconsClient({ token });

try {
  const kit = await client.projectKits.create(config.projectKit);
  const projectKitId = kit.data.id;

  console.log(`Created Icon Collection ${kit.data.name} [${projectKitId}]`);

  for (const icon of normalizeIconIds(config.icons)) {
    await client.projectKits.icons.add({
      projectKit: projectKitId,
      icon,
    });
    console.log(`Added icon ${icon}`);
  }

  const exportJob = await client.projectKits.exports.create({
    projectKit: projectKitId,
    formats: config.export?.formats,
    options: config.export?.options,
  });

  console.log(`Queued export ${exportJob.data.id}: ${exportJob.data.status}`);
  console.log(`Status URL: ${exportJob.data.statusUrl}`);
  console.log("");
  console.log("CLI companion commands for framework output:");
  console.log(`svgicons collection export "${kit.data.name}" --formats react-ts,vue --output ./exports`);
  console.log(`svgicons export status ${exportJob.data.id} --collection "${kit.data.name}"`);
  console.log(`svgicons export download ${exportJob.data.id} --collection "${kit.data.name}" --output ./exports`);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`${error.method} ${error.path} failed: ${error.status} ${error.statusText}`);
    console.error(error.message);
    process.exit(1);
  }

  throw error;
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
