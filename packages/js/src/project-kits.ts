import { pathParam, type BinaryRequester, type JsonRequester } from "./client.js";
import type {
  AddIconResponse,
  BulkAddIconsResponse,
  CreateExportRequest,
  ExportResponse,
  Id,
  ProjectKitDetailResponse,
  ProjectKitListResponse,
  ProjectKitSummaryResponse,
  ProjectKitWriteRequest,
  RemoveIconResponse,
  SvgiconsBinaryResponse,
} from "./types.js";

export interface ProjectKitIdParams {
  projectKit: Id;
}

export interface GetProjectKitParams extends ProjectKitIdParams {
  perPage?: number;
  per_page?: number;
}

export type CreateProjectKitParams = ProjectKitWriteRequest;

export interface UpdateProjectKitParams extends ProjectKitWriteRequest, ProjectKitIdParams {}

export interface ProjectKitIconParams extends ProjectKitIdParams {
  icon: Id;
}

export interface RemoveProjectKitIconParams extends ProjectKitIconParams {
  /**
   * Defaults to true on the server for backward compatibility: removes every
   * entry of the icon (the plain entry plus any custom-icon variants). Pass
   * false to remove only the plain entry. Ignored when editId is provided.
   */
  allVariants?: boolean;
  /**
   * Remove exactly one custom-icon variant: the entry whose Icon Studio edit
   * id matches. The edit must belong to the authenticated account.
   */
  editId?: Id;
}

export interface AddProjectKitIconParams extends ProjectKitIdParams {
  icon: number;
}

export interface AddBulkProjectKitIconsParams extends ProjectKitIdParams {
  icons: number[];
}

export interface ProjectKitExportParams extends ProjectKitIdParams {
  export: Id;
}

export interface CreateProjectKitExportParams extends CreateExportRequest, ProjectKitIdParams {}

export interface ProjectKitIconsResource {
  add(params: AddProjectKitIconParams): Promise<AddIconResponse>;
  addBulk(params: AddBulkProjectKitIconsParams): Promise<BulkAddIconsResponse>;
  remove(params: RemoveProjectKitIconParams): Promise<RemoveIconResponse>;
}

export interface ProjectKitExportsResource {
  create(params: CreateProjectKitExportParams): Promise<ExportResponse>;
  get(params: ProjectKitExportParams): Promise<ExportResponse>;
  download(params: ProjectKitExportParams): Promise<SvgiconsBinaryResponse>;
}

export interface ProjectKitsResource {
  icons: ProjectKitIconsResource;
  exports: ProjectKitExportsResource;
  list(): Promise<ProjectKitListResponse>;
  create(params: CreateProjectKitParams): Promise<ProjectKitSummaryResponse>;
  get(params: GetProjectKitParams): Promise<ProjectKitDetailResponse>;
  update(params: UpdateProjectKitParams): Promise<ProjectKitSummaryResponse>;
  delete(params: ProjectKitIdParams): Promise<void>;
}

export function createProjectKitsResource(
  request: JsonRequester,
  requestBinary: BinaryRequester,
): ProjectKitsResource {
  return {
    icons: {
      add: ({ projectKit, icon }) =>
        request<AddIconResponse>("POST", `/api/pro/project-kits/${pathParam(projectKit)}/icons`, {
          body: {
            icon_id: icon,
          },
        }),
      addBulk: ({ projectKit, icons }) =>
        request<BulkAddIconsResponse>("POST", `/api/pro/project-kits/${pathParam(projectKit)}/icons/bulk`, {
          body: {
            icon_ids: icons,
          },
        }),
      remove: ({ projectKit, icon, allVariants, editId }) =>
        request<RemoveIconResponse>("DELETE", `/api/pro/project-kits/${pathParam(projectKit)}/icons/${pathParam(icon)}`, {
          query: {
            // The server's boolean validation accepts 1/0, not "true"/"false".
            ...(allVariants === undefined ? {} : { all_variants: allVariants ? 1 : 0 }),
            ...(editId === undefined ? {} : { edit_id: editId }),
          },
        }),
    },
    exports: {
      create: ({ projectKit, formats, options }) =>
        request<ExportResponse>("POST", `/api/pro/project-kits/${pathParam(projectKit)}/exports`, {
          body: {
            formats,
            options,
          },
        }),
      get: ({ projectKit, export: exportId }) =>
        request<ExportResponse>(
          "GET",
          `/api/pro/project-kits/${pathParam(projectKit)}/exports/${pathParam(exportId)}`,
        ),
      download: ({ projectKit, export: exportId }) =>
        requestBinary(
          "GET",
          `/api/pro/project-kits/${pathParam(projectKit)}/exports/${pathParam(exportId)}/download`,
        ),
    },
    list: () => request<ProjectKitListResponse>("GET", "/api/pro/project-kits"),
    create: (params) => request<ProjectKitSummaryResponse>("POST", "/api/pro/project-kits", { body: params }),
    get: ({ projectKit, perPage, per_page }) =>
      request<ProjectKitDetailResponse>("GET", `/api/pro/project-kits/${pathParam(projectKit)}`, {
        query: {
          per_page: per_page ?? perPage,
        },
      }),
    update: ({ projectKit, ...body }) =>
      request<ProjectKitSummaryResponse>("PATCH", `/api/pro/project-kits/${pathParam(projectKit)}`, { body }),
    delete: async ({ projectKit }) => {
      await request<void>("DELETE", `/api/pro/project-kits/${pathParam(projectKit)}`);
    },
  };
}
