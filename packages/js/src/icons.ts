import { pathParam, type BinaryRequester, type JsonRequester } from "./client.js";
import type { IconResponse, IconSvgResponse, Id, PngExportRequest, PngExportResponse } from "./types.js";

export interface GetIconParams {
  icon: Id;
}

export interface ExportPngParams extends PngExportRequest {
  icon: Id;
}

export interface IconsResource {
  get(params: GetIconParams): Promise<IconResponse>;
  getSvg(params: GetIconParams): Promise<IconSvgResponse>;
  exportPng(params: ExportPngParams): Promise<PngExportResponse>;
}

export function createIconsResource(request: JsonRequester, requestBinary: BinaryRequester): IconsResource {
  return {
    get: ({ icon }) => request<IconResponse>("GET", `/api/pro/icons/${pathParam(icon)}`),
    getSvg: ({ icon }) => request<IconSvgResponse>("GET", `/api/pro/icons/${pathParam(icon)}/svg`),
    exportPng: ({ icon, ...body }) =>
      requestBinary("POST", `/api/pro/icons/${pathParam(icon)}/png-export`, {
        body,
      }),
  };
}
