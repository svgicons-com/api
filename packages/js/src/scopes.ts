import type { JsonRequester } from "./client.js";
import type { ScopeListResponse } from "./types.js";

export interface ScopesResource {
  list(): Promise<ScopeListResponse>;
}

export function createScopesResource(request: JsonRequester): ScopesResource {
  return {
    list: () => request<ScopeListResponse>("GET", "/api/pro/scopes"),
  };
}
