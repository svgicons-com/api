import { ApiError } from "./errors.js";
import { createIconsResource, type IconsResource } from "./icons.js";
import { createMeResource, type MeResource } from "./me.js";
import { createProjectKitsResource, type ProjectKitsResource } from "./project-kits.js";
import { createScopesResource, type ScopesResource } from "./scopes.js";
import { createSearchResource, type SearchResource } from "./search.js";
import type { SvgiconsBinaryResponse } from "./types.js";

export const DEFAULT_BASE_URL = "https://svgicons.com";

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface SvgiconsClientOptions {
  token?: string | null;
  baseUrl?: string;
  fetch?: FetchLike;
  headers?: HeadersInit;
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export interface RequestOptions {
  body?: unknown;
  headers?: HeadersInit;
  query?: QueryParams;
}

export type JsonRequester = <T>(method: HttpMethod, path: string, options?: RequestOptions) => Promise<T>;
export type BinaryRequester = (
  method: HttpMethod,
  path: string,
  options?: RequestOptions,
) => Promise<SvgiconsBinaryResponse>;

export class SvgiconsClient {
  readonly baseUrl: string;
  readonly icons: IconsResource;
  readonly me: MeResource;
  readonly projectKits: ProjectKitsResource;
  readonly scopes: ScopesResource;
  readonly search: SearchResource;

  readonly #fetch: FetchLike;
  readonly #headers: HeadersInit | undefined;
  readonly #token: string | undefined;

  constructor(options: SvgiconsClientOptions = {}) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl ?? DEFAULT_BASE_URL);
    this.#token = options.token ?? undefined;
    this.#headers = options.headers;
    this.#fetch = options.fetch ?? globalThis.fetch?.bind(globalThis);

    if (!this.#fetch) {
      throw new Error("SvgiconsClient requires a fetch implementation.");
    }

    const jsonRequest = this.requestJson.bind(this);
    const binaryRequest = this.requestBinary.bind(this);

    this.scopes = createScopesResource(jsonRequest);
    this.me = createMeResource(jsonRequest);
    this.search = createSearchResource(jsonRequest);
    this.icons = createIconsResource(jsonRequest, binaryRequest);
    this.projectKits = createProjectKitsResource(jsonRequest, binaryRequest);
  }

  async requestJson<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.send(method, path, options);

    if (response.status === 204) {
      return undefined as T;
    }

    return (await parseJsonResponse(response)) as T;
  }

  async requestBinary(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<SvgiconsBinaryResponse> {
    const response = await this.send(method, path, options, {
      accept: "image/png, application/zip, */*",
    });
    const contentDisposition = response.headers.get("content-disposition");

    return {
      data: await response.arrayBuffer(),
      contentType: response.headers.get("content-type"),
      contentLength: parseContentLength(response.headers.get("content-length")),
      contentDisposition,
      filename: filenameFromContentDisposition(contentDisposition),
      response,
    };
  }

  private async send(
    method: HttpMethod,
    path: string,
    options: RequestOptions,
    requestOptions: { accept?: string } = {},
  ): Promise<Response> {
    const url = buildUrl(this.baseUrl, path, options.query);
    const headers = new Headers(this.#headers);

    headers.set("Accept", requestOptions.accept ?? "application/json");

    if (this.#token) {
      headers.set("Authorization", `Bearer ${this.#token}`);
    }

    let body: BodyInit | undefined;

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    }

    if (options.headers) {
      new Headers(options.headers).forEach((value, key) => headers.set(key, value));
    }

    const init: RequestInit = {
      headers,
      method,
    };

    if (body !== undefined) {
      init.body = body;
    }

    const response = await this.#fetch(url, init);

    if (!response.ok) {
      throw new ApiError({
        status: response.status,
        statusText: response.statusText,
        body: await parseErrorBody(response),
        method,
        path,
        response,
      });
    }

    return response;
  }
}

export function pathParam(value: string | number): string {
  return encodeURIComponent(String(value));
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const url = new URL(`${baseUrl}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      appendQueryValue(url.searchParams, key, value);
    }
  }

  return url.toString();
}

function appendQueryValue(params: URLSearchParams, key: string, value: QueryValue | QueryValue[]): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      appendQueryValue(params, key, item);
    }

    return;
  }

  if (value === undefined || value === null || value === "") {
    return;
  }

  params.append(key, String(value));
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  return JSON.parse(text);
}

async function parseErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

function parseContentLength(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function filenameFromContentDisposition(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const starMatch = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (starMatch?.[1]) {
    return decodeURIComponent(starMatch[1].trim().replace(/^"|"$/g, ""));
  }

  const match = value.match(/filename="?([^";]+)"?/i);

  return match?.[1] ?? null;
}
