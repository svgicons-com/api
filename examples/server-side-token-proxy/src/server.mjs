import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ApiError, SvgiconsClient } from "../../../packages/js/dist/index.js";

loadLocalEnv();

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicDir = resolve(__dirname, "../public");
const port = Number(process.env.PORT || 3030);
const token = process.env.SVGICONS_API_TOKEN;
const client = token && token !== "YOUR_API_TOKEN" ? new SvgiconsClient({ token }) : null;

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

    if (url.pathname === "/api/icons/search") {
      await handleSearch(url, response);
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { message: "Internal server error." });
  }
});

server.listen(port, () => {
  console.log(`Proxy example running at http://localhost:${port}`);
});

async function handleSearch(url, response) {
  if (!client) {
    sendJson(response, 500, {
      message: "Server is missing SVGICONS_API_TOKEN.",
    });
    return;
  }

  const q = sanitizeQuery(url.searchParams.get("q"));
  const limit = sanitizeLimit(url.searchParams.get("limit"));

  if (!q) {
    sendJson(response, 200, { data: [] });
    return;
  }

  try {
    const results = await client.search.icons({
      q,
      limit,
    });

    sendJson(response, 200, {
      data: results.data.map((icon) => ({
        id: icon.id,
        name: icon.name,
        label: icon.label,
        pageUrl: icon.pageUrl,
        iconSet: icon.iconSet
          ? {
              name: icon.iconSet.name,
              prefix: icon.iconSet.prefix,
              license: icon.iconSet.license,
            }
          : null,
      })),
      meta: {
        query: results.meta.query,
        hasMore: results.meta.hasMore,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      sendJson(response, error.status, {
        message: error.message,
      });
      return;
    }

    throw error;
  }
}

function sanitizeQuery(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 100);
}

function sanitizeLimit(value) {
  const parsed = Number(value ?? 12);

  if (!Number.isFinite(parsed)) {
    return 12;
  }

  return Math.min(Math.max(Math.trunc(parsed), 1), 20);
}

async function serveStatic(pathname, response) {
  const normalized = pathname === "/" ? "/index.html" : pathname;
  const filePath = resolve(publicDir, `.${normalized}`);

  if (!filePath.startsWith(publicDir)) {
    sendJson(response, 404, { message: "Not found." });
    return;
  }

  if (!existsSync(filePath)) {
    sendJson(response, 404, { message: "Not found." });
    return;
  }

  response.writeHead(200, {
    "content-type": contentType(filePath),
  });
  response.end(readFileSync(filePath));
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json",
  });
  response.end(JSON.stringify(body));
}

function contentType(filePath) {
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
    }[extname(filePath)] ?? "text/plain; charset=utf-8"
  );
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
