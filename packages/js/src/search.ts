import type { JsonRequester } from "./client.js";
import type { IconSearchResponse, SearchIconsParams } from "./types.js";

export interface SearchResource {
  icons(params?: SearchIconsParams): Promise<IconSearchResponse>;
}

export function createSearchResource(request: JsonRequester): SearchResource {
  return {
    icons: (params = {}) => request<IconSearchResponse>("GET", "/api/pro/search", { query: { ...params } }),
  };
}
