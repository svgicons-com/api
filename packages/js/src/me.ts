import type { JsonRequester } from "./client.js";
import type { MeResponse } from "./types.js";

export interface MeResource {
  get(): Promise<MeResponse>;
}

export function createMeResource(request: JsonRequester): MeResource {
  return {
    get: () => request<MeResponse>("GET", "/api/pro/me"),
  };
}
