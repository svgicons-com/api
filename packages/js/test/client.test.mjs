import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, SvgiconsClient } from "../dist/index.js";

test("uses the default base URL", async () => {
  const mock = mockFetch(() => jsonResponse({ data: [] }));
  const client = new SvgiconsClient({ fetch: mock.fetch });

  await client.scopes.list();

  assert.equal(mock.calls[0].url, "https://svgicons.com/api/pro/scopes");
});

test("sends bearer auth when a token is configured", async () => {
  const mock = mockFetch(() => jsonResponse(searchResponse()));
  const client = new SvgiconsClient({
    token: "YOUR_API_TOKEN",
    fetch: mock.fetch,
  });

  await client.search.icons({ q: "arrow", limit: 20 });

  assert.equal(mock.calls[0].headers.get("authorization"), "Bearer YOUR_API_TOKEN");
});

test("builds search query strings", async () => {
  const mock = mockFetch(() => jsonResponse(searchResponse()));
  const client = new SvgiconsClient({
    baseUrl: "https://svgicons.com/",
    fetch: mock.fetch,
  });

  await client.search.icons({
    q: "arrow left",
    page: 2,
    limit: 20,
    iconSetPrefix: "pro-rest-icons",
  });

  const url = new URL(mock.calls[0].url);

  assert.equal(url.pathname, "/api/pro/search");
  assert.equal(url.searchParams.get("q"), "arrow left");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(url.searchParams.get("limit"), "20");
  assert.equal(url.searchParams.get("iconSetPrefix"), "pro-rest-icons");
});

test("gets icon metadata from the live /api/pro path shape", async () => {
  const mock = mockFetch(() => jsonResponse({ data: icon() }));
  const client = new SvgiconsClient({ fetch: mock.fetch });

  const response = await client.icons.get({ icon: 33716 });

  assert.equal(mock.calls[0].method, "GET");
  assert.equal(mock.calls[0].url, "https://svgicons.com/api/pro/icons/33716");
  assert.equal(response.data.name, "arrow-circle-up-fill");
});

test("gets SVG payload JSON from the SVG endpoint", async () => {
  const body = {
    data: {
      ...icon(),
      body: "<path />",
      svg: '<svg xmlns="http://www.w3.org/2000/svg"><path /></svg>',
      contentType: "image/svg+xml",
    },
  };
  const mock = mockFetch(() => jsonResponse(body));
  const client = new SvgiconsClient({ fetch: mock.fetch });

  const response = await client.icons.getSvg({ icon: "33716" });

  assert.equal(mock.calls[0].url, "https://svgicons.com/api/pro/icons/33716/svg");
  assert.equal(response.data.svg, body.data.svg);
  assert.equal(response.data.contentType, "image/svg+xml");
});

test("creates project kits with JSON request bodies", async () => {
  const mock = mockFetch(() => jsonResponse({ data: projectKit() }, 201));
  const client = new SvgiconsClient({ fetch: mock.fetch });

  await client.projectKits.create({
    name: "Dashboard icons",
    framework: "react-ts",
    colorPolicy: "currentColor",
    namingPolicy: "pascal",
  });

  assert.equal(mock.calls[0].method, "POST");
  assert.equal(mock.calls[0].url, "https://svgicons.com/api/pro/project-kits");
  assert.equal(mock.calls[0].headers.get("content-type"), "application/json");
  assert.deepEqual(JSON.parse(mock.calls[0].body), {
    name: "Dashboard icons",
    framework: "react-ts",
    colorPolicy: "currentColor",
    namingPolicy: "pascal",
  });
});

test("downloads export ZIP responses as ArrayBuffer", async () => {
  const mock = mockFetch(() =>
    binaryResponse(new Uint8Array([1, 2, 3]), {
      "content-type": "application/zip",
      "content-disposition": 'attachment; filename="dashboard-icons-export-456.zip"',
      "content-length": "3",
    }),
  );
  const client = new SvgiconsClient({ fetch: mock.fetch });

  const response = await client.projectKits.exports.download({
    projectKit: 123,
    export: 456,
  });

  assert.equal(mock.calls[0].url, "https://svgicons.com/api/pro/project-kits/123/exports/456/download");
  assert.equal(response.contentType, "application/zip");
  assert.equal(response.contentLength, 3);
  assert.equal(response.filename, "dashboard-icons-export-456.zip");
  assert.equal(response.data.byteLength, 3);
});

test("exports single icons as binary responses", async () => {
  const mock = mockFetch(() =>
    binaryResponse(new Uint8Array([137, 80, 78, 71]), {
      "content-type": "image/png",
    }),
  );
  const client = new SvgiconsClient({ fetch: mock.fetch });

  const response = await client.icons.exportPng({
    icon: 33716,
    iconName: "arrow-circle-up-fill",
    sizes: [512],
    densities: [1],
  });

  assert.equal(mock.calls[0].method, "POST");
  assert.equal(mock.calls[0].url, "https://svgicons.com/api/pro/icons/33716/png-export");
  assert.deepEqual(JSON.parse(mock.calls[0].body), {
    iconName: "arrow-circle-up-fill",
    sizes: [512],
    densities: [1],
  });
  assert.equal(response.contentType, "image/png");
  assert.equal(response.data.byteLength, 4);
});

test("throws ApiError with parsed JSON error body", async () => {
  const mock = mockFetch(() =>
    jsonResponse(
      {
        message: "The limit field must not be greater than 100.",
        errors: {
          limit: ["The limit field must not be greater than 100."],
        },
      },
      422,
      "Unprocessable Content",
    ),
  );
  const client = new SvgiconsClient({ fetch: mock.fetch });

  await assert.rejects(
    client.search.icons({ q: "arrow", limit: 101 }),
    (error) => {
      assert.equal(error instanceof ApiError, true);
      assert.equal(error.status, 422);
      assert.equal(error.statusText, "Unprocessable Content");
      assert.equal(error.method, "GET");
      assert.equal(error.path, "/api/pro/search");
      assert.equal(error.body.errors.limit[0], "The limit field must not be greater than 100.");
      assert.equal(error.message, "The limit field must not be greater than 100.");
      return true;
    },
  );
});

test("does not require a real API token for mocked tests", async () => {
  const mock = mockFetch(() => jsonResponse({ data: [] }));
  const client = new SvgiconsClient({ fetch: mock.fetch });

  await client.scopes.list();

  assert.equal(mock.calls.length, 1);
  assert.equal(mock.calls[0].headers.has("authorization"), false);
});

function mockFetch(factory) {
  const calls = [];

  return {
    calls,
    fetch: async (input, init = {}) => {
      const call = {
        url: String(input),
        method: init.method ?? "GET",
        headers: new Headers(init.headers),
        body: init.body ?? null,
      };
      calls.push(call);

      return factory(call);
    },
  };
}

function jsonResponse(body, status = 200, statusText = "OK") {
  return new Response(JSON.stringify(body), {
    status,
    statusText,
    headers: {
      "content-type": "application/json",
    },
  });
}

function binaryResponse(body, headers = {}) {
  return new Response(body, {
    status: 200,
    statusText: "OK",
    headers,
  });
}

function searchResponse() {
  return {
    data: [icon()],
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
  };
}

function icon() {
  return {
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
    iconSet: {
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
    },
  };
}

function projectKit() {
  return {
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
}
