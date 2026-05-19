import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(repoRoot, "openapi/svgicons.openapi.yaml");
const sourcePath = resolveSourcePath();
const checkOnly = process.argv.includes("--check");

const httpMethods = new Set(["get", "put", "post", "patch", "delete", "options", "head", "trace"]);

const liveOperations = [
  ["get", "/api/pro/scopes"],
  ["get", "/api/pro/me"],
  ["get", "/api/pro/search"],
  ["get", "/api/pro/icons/{icon}"],
  ["get", "/api/pro/icons/{icon}/svg"],
  ["post", "/api/pro/icons/{icon}/png-export"],
  ["get", "/api/pro/project-kits"],
  ["post", "/api/pro/project-kits"],
  ["get", "/api/pro/project-kits/{projectKit}"],
  ["patch", "/api/pro/project-kits/{projectKit}"],
  ["delete", "/api/pro/project-kits/{projectKit}"],
  ["post", "/api/pro/project-kits/{projectKit}/icons"],
  ["post", "/api/pro/project-kits/{projectKit}/icons/bulk"],
  ["delete", "/api/pro/project-kits/{projectKit}/icons/{icon}"],
  ["post", "/api/pro/project-kits/{projectKit}/exports"],
  ["get", "/api/pro/project-kits/{projectKit}/exports/{export}"],
  ["get", "/api/pro/project-kits/{projectKit}/exports/{export}/download"],
];

const operationDescriptions = {
  listProApiScopes:
    "Returns the current Pro API scope catalog. This public endpoint is useful before creating a token or configuring an integration.",
  getProApiMe:
    "Returns the authenticated user, account access summary, current token metadata, and scope catalog for the bearer token.",
  searchProIcons:
    "Searches icon metadata for the authenticated Pro API token. Results include icon set, license, source URL, and SVG URL metadata, but not raw SVG markup.",
  getProIcon:
    "Returns one icon's public metadata, including icon set, license, provenance URLs, dimensions, and public page/SVG URLs.",
  getProIconSvg:
    "Returns one icon's metadata plus the stored SVG body and a wrapped SVG document string.",
  exportProIconPng:
    "Renders one icon to a binary PNG response or a ZIP when multiple sizes, densities, or zip output are requested.",
  listProProjectKits:
    "Lists the authenticated user's Icon Collections. The live REST route keeps the historical project-kits path segment.",
  createProProjectKit:
    "Creates an Icon Collection for the authenticated user.",
  getProProjectKit:
    "Returns one Icon Collection, license and icon-set summaries, and a paginated list of icons in the collection.",
  updateProProjectKit:
    "Updates an Icon Collection's name, description, framework, color policy, or naming policy.",
  deleteProProjectKit:
    "Deletes an Icon Collection and its related collection export artifacts.",
  addProProjectKitIcon:
    "Adds one icon to an Icon Collection by icon id. The response tells whether a new collection entry was created.",
  bulkAddProProjectKitIcons:
    "Adds up to 500 icon ids to an Icon Collection and reports which ids were created or already present.",
  removeProProjectKitIcon:
    "Removes one icon from an Icon Collection by icon id.",
  createProProjectKitExport:
    "Queues an Icon Collection export job for one or more supported export formats.",
  getProProjectKitExport:
    "Returns export job status and a download URL when the ZIP artifact is complete and still available.",
  downloadProProjectKitExport:
    "Downloads a completed Icon Collection export ZIP artifact.",
};

const tagMap = new Map([
  ["Auth", "Auth / Account"],
  ["Icon Collections", "Project Kits"],
]);

const sampleIconSet = {
  id: 10,
  name: "Pro REST Icons",
  prefix: "pro-rest-icons",
  description: "Example icon set used by Pro REST API tests.",
  total: 120,
  author: "Svg/icons",
  authorUrl: null,
  license: "MIT",
  licenseUrl: "https://opensource.org/licenses/MIT",
  spdx: "MIT",
  category: "Interface",
  statusBadge: null,
  pageUrl: "https://svgicons.com/icon-set/pro-rest-icons",
};

const sampleIcon = {
  id: 33716,
  name: "arrow-circle-up-fill",
  slug: "arrow-circle-up-fill",
  label: "Arrow Circle Up Fill",
  description: null,
  category: "Interface",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  pageUrl: "https://svgicons.com/icon/33716/arrow-circle-up-fill",
  svgUrl: "https://svgicons.com/img/33716/arrow-circle-up-fill.svg",
  iconSet: sampleIconSet,
};

const sampleProjectKit = {
  id: 123,
  name: "Dashboard icons",
  slug: "dashboard-icons",
  description: "Icons used by the dashboard UI.",
  framework: "react-ts",
  colorPolicy: "currentColor",
  namingPolicy: "pascal",
  iconsCount: 3,
  showUrl: "https://svgicons.com/project-kits/123",
  updatedAt: "2026-05-10T12:00:00+00:00",
  createdAt: "2026-05-10T11:45:00+00:00",
};

const sampleProjectKitIcon = {
  id: 33716,
  icon_set_id: 10,
  name: "arrow-circle-up-fill",
  width: 24,
  height: 24,
  body: '<path d="M12 4l7 7-1.4 1.4L13 7.8V20h-2V7.8l-4.6 4.6L5 11z"/>',
  iconSet: {
    id: 10,
    name: "Pro REST Icons",
    prefix: "pro-rest-icons",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
  },
};

const sampleProjectKitDetail = {
  ...sampleProjectKit,
  licenseSummary: [
    {
      license: "MIT",
      count: 3,
      sets: [
        {
          name: "Pro REST Icons",
          prefix: "pro-rest-icons",
          licenseUrl: "https://opensource.org/licenses/MIT",
        },
      ],
    },
  ],
  iconSetSummary: [
    {
      name: "Pro REST Icons",
      prefix: "pro-rest-icons",
      count: 3,
    },
  ],
};

const sampleProjectKitIconsPage = {
  data: [sampleProjectKitIcon],
  current_page: 1,
  first_page_url: "https://svgicons.com/api/pro/project-kits/123?page=1",
  from: 1,
  last_page: 1,
  last_page_url: "https://svgicons.com/api/pro/project-kits/123?page=1",
  links: [
    {
      url: null,
      label: "&laquo; Previous",
      active: false,
    },
    {
      url: "https://svgicons.com/api/pro/project-kits/123?page=1",
      label: "1",
      active: true,
    },
    {
      url: null,
      label: "Next &raquo;",
      active: false,
    },
  ],
  next_page_url: null,
  path: "https://svgicons.com/api/pro/project-kits/123",
  per_page: 100,
  prev_page_url: null,
  to: 1,
  total: 1,
};

const sampleExport = {
  id: 456,
  status: "queued",
  formats: ["svg-folder", "svg-sprite", "json-manifest", "license-manifest", "react-ts"],
  options: {
    colorPolicy: "currentColor",
    namingPolicy: "pascal",
    typescript: true,
    defaultSize: 24,
  },
  artifactFilename: null,
  artifactSize: null,
  artifactExists: false,
  failureMessage: null,
  createdAt: "2026-05-10T12:05:00+00:00",
  queuedAt: "2026-05-10T12:05:00+00:00",
  startedAt: null,
  completedAt: null,
  failedAt: null,
  expiresAt: null,
  statusUrl: "https://svgicons.com/api/pro/project-kits/123/exports/456",
  downloadUrl: null,
};

main();

function main() {
  if (!sourcePath) {
    if (checkOnly) {
      validateCommittedOpenApi();
      console.log("Website source OpenAPI file was not found; validated committed OpenAPI file only.");
      return;
    }

    console.error("Could not find the website source OpenAPI file.");
    console.error("Expected C:/Svgicons.com/svgicons/public/openapi/pro-api.json or set SVGICONS_WEBSITE_OPENAPI.");
    process.exit(1);
  }

  const source = JSON.parse(readFileSync(sourcePath, "utf8"));
  const spec = polishSpec(source);
  validateSpec(spec);

  const generated = `${toYaml(spec)}\n`;

  if (checkOnly) {
    const current = existsSync(outputPath) ? readFileSync(outputPath, "utf8").replace(/\r\n/g, "\n") : "";

    if (current !== generated) {
      console.error("openapi/svgicons.openapi.yaml is out of sync with the website source OpenAPI file.");
      console.error("Run: npm run sync:openapi");
      process.exit(1);
    }

    console.log("OpenAPI YAML is synchronized with the website source.");
    return;
  }

  writeFileSync(outputPath, generated, "utf8");
  console.log(`Wrote ${relativeToRepo(outputPath)} from ${sourcePath}`);
}

function resolveSourcePath() {
  const candidates = [
    process.env.SVGICONS_WEBSITE_OPENAPI,
    "C:/Svgicons.com/svgicons/public/openapi/pro-api.json",
    resolve(repoRoot, "../svgicons/public/openapi/pro-api.json"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const path = resolve(candidate);

    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

function polishSpec(source) {
  const spec = clone(source);

  spec.info = {
    title: source.info.title,
    summary: source.info.summary,
    version: String(source.info.version),
    description:
      `${source.info.description}\n\n` +
      "This YAML file is the public API-repo version of the website source OpenAPI file at `public/openapi/pro-api.json`. " +
      "It documents the live `/api/pro` REST API only.",
  };

  spec.servers = [
    {
      url: "https://svgicons.com",
      description: "Production",
    },
  ];

  spec.tags = [
    {
      name: "Auth / Account",
      description: "Scope discovery and authenticated token/account inspection.",
    },
    {
      name: "Search",
      description: "Authenticated icon metadata search.",
    },
    {
      name: "Icons",
      description: "Icon metadata, SVG payloads, and single-icon PNG export.",
    },
    {
      name: "Project Kits",
      description: "Icon Collection workflows. The current REST path uses the historical project-kits segment.",
    },
    {
      name: "Exports",
      description: "Queued Icon Collection ZIP exports.",
    },
  ];

  spec.externalDocs = {
    description: "Svg/icons API developer documentation",
    url: "https://svgicons.com/developers/api",
  };

  spec["x-source-openapi"] = {
    publicUrl: "https://svgicons.com/openapi/pro-api.json",
    websiteRepoPath: "public/openapi/pro-api.json",
  };

  const paths = {};
  for (const [, path] of liveOperations) {
    paths[path] = clone(source.paths[path]);
  }
  spec.paths = paths;

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!httpMethods.has(method)) {
        continue;
      }

      operation.tags = (operation.tags ?? []).map((tag) => tagMap.get(tag) ?? tag);
      operation.description = operationDescriptions[operation.operationId] ?? operation.description;
      addOperationExamples(path, method, operation);
    }
  }

  spec.components.securitySchemes.bearerAuth.description =
    "Use a Pro API token from the Svg/icons account token page in the Authorization header: `Authorization: Bearer YOUR_API_TOKEN`.";

  refineSchemas(spec.components.schemas);
  refineResponses(spec.components.responses);

  return spec;
}

function refineSchemas(schemas) {
  schemas.ProApiScope = {
    description: "One currently supported Pro API scope.",
    allOf: [{ $ref: "#/components/schemas/Scope" }],
  };

  schemas.ProApiUser = {
    type: "object",
    required: ["id", "name", "email", "hasVerifiedEmail"],
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      hasVerifiedEmail: { type: "boolean" },
    },
  };

  schemas.Account = {
    type: "object",
    required: ["user", "access", "token", "scopes"],
    properties: {
      user: { $ref: "#/components/schemas/ProApiUser" },
      access: {
        type: "object",
        description: "Current account access summary returned by the website access service.",
        additionalProperties: true,
      },
      token: { $ref: "#/components/schemas/TokenSummary" },
      scopes: {
        type: "array",
        items: { $ref: "#/components/schemas/ProApiScope" },
      },
    },
  };

  schemas.MeResponse.properties.data = { $ref: "#/components/schemas/Account" };
  schemas.ScopeListResponse.properties.data.items = { $ref: "#/components/schemas/ProApiScope" };

  schemas.IconSearchResult = {
    description: "Icon metadata item returned by Pro API search.",
    allOf: [{ $ref: "#/components/schemas/Icon" }],
  };
  schemas.IconSearchResponse.properties.data.items = { $ref: "#/components/schemas/IconSearchResult" };

  schemas.PngExportRequest = {
    description: "Single-icon PNG export request body.",
    allOf: [{ $ref: "#/components/schemas/IconPngExportRequest" }],
  };

  schemas.PngExportResponse = {
    description: "Binary PNG or ZIP bytes returned by the live endpoint.",
    type: "string",
    format: "binary",
  };

  schemas.ProjectKit = {
    description: "Icon Collection summary returned by the Pro REST API.",
    allOf: [{ $ref: "#/components/schemas/ProjectKitSummary" }],
  };
  schemas.ProjectKitSummaryResponse.properties.data = { $ref: "#/components/schemas/ProjectKit" };
  schemas.ProjectKitListResponse.properties.data.items = { $ref: "#/components/schemas/ProjectKit" };

  schemas.ProjectKitIcon = {
    type: "object",
    required: ["id", "icon_set_id", "name", "width", "height", "body", "iconSet"],
    properties: {
      id: { type: "integer" },
      icon_set_id: { type: ["integer", "null"] },
      name: { type: "string" },
      width: { type: "integer" },
      height: { type: "integer" },
      body: { type: "string" },
      iconSet: {
        type: ["object", "null"],
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          prefix: { type: "string" },
          license: { type: ["string", "null"] },
          licenseUrl: { type: ["string", "null"], format: "uri" },
        },
      },
    },
  };

  schemas.ProjectKitExport = {
    description: "Icon Collection export job.",
    allOf: [{ $ref: "#/components/schemas/Export" }],
  };
  schemas.ExportResponse.properties.data = { $ref: "#/components/schemas/ProjectKitExport" };

  schemas.Pagination = {
    type: "object",
    description: "Laravel length-aware paginator response used for Icon Collection icons.",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/ProjectKitIcon" },
      },
      current_page: { type: "integer" },
      first_page_url: { type: ["string", "null"], format: "uri" },
      from: { type: ["integer", "null"] },
      last_page: { type: "integer" },
      last_page_url: { type: ["string", "null"], format: "uri" },
      links: {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: ["string", "null"], format: "uri" },
            label: { type: "string" },
            active: { type: "boolean" },
          },
        },
      },
      next_page_url: { type: ["string", "null"], format: "uri" },
      path: { type: "string", format: "uri" },
      per_page: { type: "integer" },
      prev_page_url: { type: ["string", "null"], format: "uri" },
      to: { type: ["integer", "null"] },
      total: { type: "integer" },
    },
    additionalProperties: true,
  };

  schemas.ProjectKitDetailResponse.properties.icons = { $ref: "#/components/schemas/Pagination" };

  schemas.ErrorResponse = {
    description: "Common JSON error response.",
    allOf: [{ $ref: "#/components/schemas/Error" }],
  };
}

function refineResponses(responses) {
  for (const responseName of ["Unauthenticated", "NotFound", "Conflict"]) {
    const schema = responses?.[responseName]?.content?.["application/json"]?.schema;
    if (schema) {
      responses[responseName].content["application/json"].schema = {
        $ref: "#/components/schemas/ErrorResponse",
      };
    }
  }
}

function addOperationExamples(path, method, operation) {
  if (path === "/api/pro/search" && method === "get") {
    setJsonResponseExample(operation, "200", "search", {
      data: [sampleIcon],
      meta: {
        query: "arrow",
        category: null,
        iconSetPrefix: null,
        limit: 20,
        offset: 0,
        page: 1,
        nextOffset: 1,
        hasMore: false,
      },
    });
  }

  if (path === "/api/pro/icons/{icon}" && method === "get") {
    setJsonResponseExample(operation, "200", "icon", { data: sampleIcon });
  }

  if (path === "/api/pro/icons/{icon}/svg" && method === "get") {
    setJsonResponseExample(operation, "200", "svg", {
      data: {
        ...sampleIcon,
        body: '<path d="M12 4l7 7-1.4 1.4L13 7.8V20h-2V7.8l-4.6 4.6L5 11z"/>',
        svg:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M12 4l7 7-1.4 1.4L13 7.8V20h-2V7.8l-4.6 4.6L5 11z"/></svg>',
        contentType: "image/svg+xml",
      },
    });
  }

  if (path === "/api/pro/icons/{icon}/png-export" && method === "post") {
    operation.requestBody.content["application/json"].schema = {
      $ref: "#/components/schemas/PngExportRequest",
    };

    setJsonRequestExample(operation, "png", {
      iconName: "arrow-circle-up-fill",
      sizes: [512],
      densities: [1],
      backgroundType: "transparent",
      iconColorMode: "preserve",
      padding: 48,
      fit: "contain",
    });

    operation.responses["200"].content["image/png"].schema = {
      $ref: "#/components/schemas/PngExportResponse",
    };
    operation.responses["200"].content["application/zip"].schema = {
      $ref: "#/components/schemas/PngExportResponse",
    };
  }

  if (path === "/api/pro/project-kits" && method === "post") {
    setJsonRequestExample(operation, "createProjectKit", {
      name: "Dashboard icons",
      description: "Icons used by the dashboard UI.",
      framework: "react-ts",
      colorPolicy: "currentColor",
      namingPolicy: "pascal",
    });
    setJsonResponseExample(operation, "201", "projectKit", { data: sampleProjectKit });
  }

  if (path === "/api/pro/project-kits" && method === "get") {
    setJsonResponseExample(operation, "200", "projectKits", {
      data: [sampleProjectKit],
      meta: {
        options: {
          frameworks: ["svg", "react-ts", "vue", "sprite"],
          colorPolicies: ["currentColor", "preserve", "strip"],
          namingPolicies: ["kebab", "pascal", "camel"],
        },
      },
    });
  }

  if (path === "/api/pro/project-kits/{projectKit}" && method === "get") {
    setJsonResponseExample(operation, "200", "projectKit", {
      data: sampleProjectKitDetail,
      icons: sampleProjectKitIconsPage,
    });
  }

  if (path === "/api/pro/project-kits/{projectKit}" && method === "patch") {
    setJsonRequestExample(operation, "updateProjectKit", {
      name: "Dashboard icons",
      colorPolicy: "currentColor",
      namingPolicy: "pascal",
    });
    setJsonResponseExample(operation, "200", "projectKit", { data: sampleProjectKit });
  }

  if (path === "/api/pro/project-kits/{projectKit}/icons" && method === "post") {
    setJsonRequestExample(operation, "addIcon", { icon_id: 33716 });
  }

  if (path === "/api/pro/project-kits/{projectKit}/icons/bulk" && method === "post") {
    setJsonRequestExample(operation, "bulkAddIcons", { icon_ids: [33716, 33717, 33718] });
  }

  if (path === "/api/pro/project-kits/{projectKit}/exports" && method === "post") {
    setJsonRequestExample(operation, "createExport", {
      formats: ["react-ts", "vue", "license-manifest"],
      options: {
        colorPolicy: "currentColor",
        namingPolicy: "pascal",
        typescript: true,
        defaultSize: 24,
      },
    });
    setJsonResponseExample(operation, "202", "export", { data: sampleExport });
  }

  if (path === "/api/pro/project-kits/{projectKit}/exports/{export}" && method === "get") {
    setJsonResponseExample(operation, "200", "export", { data: sampleExport });
  }
}

function validateCommittedOpenApi() {
  if (!existsSync(outputPath)) {
    console.error("Missing committed OpenAPI file: openapi/svgicons.openapi.yaml");
    process.exit(1);
  }

  const yaml = readFileSync(outputPath, "utf8");
  const requiredSnippets = [
    "openapi:",
    "https://svgicons.com",
    "/api/pro/search",
    "/api/pro/project-kits",
    "bearerAuth",
  ];

  for (const snippet of requiredSnippets) {
    if (!yaml.includes(snippet)) {
      console.error(`Committed OpenAPI file is missing required content: ${snippet}`);
      process.exit(1);
    }
  }

  if (yaml.includes("/api/v1/")) {
    console.error("Committed OpenAPI file must not document /api/v1 endpoints as live.");
    process.exit(1);
  }

  if (yaml.includes("/api/pro/icon-sets")) {
    console.error("Committed OpenAPI file must not document dedicated /api/pro/icon-sets endpoints as live.");
    process.exit(1);
  }

  for (const [method, path] of liveOperations) {
    if (!yaml.includes(JSON.stringify(path)) && !yaml.includes(path)) {
      console.error(`Committed OpenAPI file is missing live operation path: ${method.toUpperCase()} ${path}`);
      process.exit(1);
    }
  }
}

function setJsonRequestExample(operation, name, value) {
  const content = operation.requestBody?.content?.["application/json"];

  if (!content) {
    return;
  }

  content.examples = {
    ...(content.examples ?? {}),
    [name]: { value },
  };
}

function setJsonResponseExample(operation, status, name, value) {
  const content = operation.responses?.[status]?.content?.["application/json"];

  if (!content) {
    return;
  }

  content.examples = {
    ...(content.examples ?? {}),
    [name]: { value },
  };
}

function validateSpec(spec) {
  const actualOperations = [];

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    if (path.startsWith("/api/v1")) {
      throw new Error("The API repo OpenAPI spec must not document /api/v1 endpoints as live.");
    }

    if (path.startsWith("/api/pro/icon-sets")) {
      throw new Error("Dedicated /api/pro/icon-sets endpoints are not live and must not be documented.");
    }

    if (path === "/mcp") {
      throw new Error("MCP is JSON-RPC over /mcp and must not be modeled in this REST OpenAPI spec.");
    }

    for (const [method] of Object.entries(pathItem)) {
      if (httpMethods.has(method)) {
        actualOperations.push(`${method.toUpperCase()} ${path}`);
      }
    }
  }

  const expectedOperations = liveOperations.map(([method, path]) => `${method.toUpperCase()} ${path}`);
  const missing = expectedOperations.filter((operation) => !actualOperations.includes(operation));
  const extra = actualOperations.filter((operation) => !expectedOperations.includes(operation));

  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      [
        "OpenAPI operation list does not match the live /api/pro route contract.",
        missing.length ? `Missing: ${missing.join(", ")}` : null,
        extra.length ? `Extra: ${extra.join(", ")}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    );
  }

  if (spec.servers?.[0]?.url !== "https://svgicons.com") {
    throw new Error("OpenAPI server URL must be https://svgicons.com.");
  }

  if (spec.components?.securitySchemes?.bearerAuth?.scheme !== "bearer") {
    throw new Error("OpenAPI bearerAuth scheme must remain HTTP bearer.");
  }

  for (const requiredTag of ["Auth / Account", "Search", "Icons", "Project Kits", "Exports"]) {
    if (!spec.tags.some((tag) => tag.name === requiredTag)) {
      throw new Error(`Missing OpenAPI tag: ${requiredTag}`);
    }
  }
}

function toYaml(value, indent = 0) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    return value
      .map((item) => {
        const prefix = `${" ".repeat(indent)}-`;

        if (isScalar(item) || isEmptyCollection(item)) {
          return `${prefix} ${formatScalar(item)}`;
        }

        return `${prefix}\n${toYaml(item, indent + 2)}`;
      })
      .join("\n");
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return "{}";
    }

    return entries
      .map(([key, item]) => {
        const formattedKey = formatKey(key);

        if (isScalar(item) || isEmptyCollection(item)) {
          return `${" ".repeat(indent)}${formattedKey}: ${formatScalar(item)}`;
        }

        return `${" ".repeat(indent)}${formattedKey}:\n${toYaml(item, indent + 2)}`;
      })
      .join("\n");
  }

  return formatScalar(value);
}

function formatKey(key) {
  return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(key) ? key : JSON.stringify(key);
}

function formatScalar(value) {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "[]";
  }

  if (isPlainObject(value)) {
    return "{}";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value);
}

function isScalar(value) {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

function isEmptyCollection(value) {
  return (Array.isArray(value) && value.length === 0) || (isPlainObject(value) && Object.keys(value).length === 0);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function relativeToRepo(path) {
  return path.replace(`${repoRoot}\\`, "").replace(`${repoRoot}/`, "").replace(/\\/g, "/");
}
