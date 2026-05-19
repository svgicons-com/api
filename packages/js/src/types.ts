export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type Id = string | number;

export type ScopeValue =
  | "search:read"
  | "icons:read"
  | "collections:read"
  | "collections:write"
  | "exports:create"
  | "mcp:use";

export interface ProApiScope {
  value: ScopeValue;
  label: string;
  description: string;
}

export interface ProApiUser {
  id: number;
  name: string;
  email: string;
  hasVerifiedEmail: boolean;
}

export interface TokenSummary {
  id?: number | null;
  name?: string | null;
  abilities?: string[];
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
}

export interface Account {
  user: ProApiUser;
  access: Record<string, unknown>;
  token: TokenSummary | null;
  scopes: ProApiScope[];
}

export interface DataResponse<T> {
  data: T;
}

export interface ScopeListResponse extends DataResponse<ProApiScope[]> {}
export interface MeResponse extends DataResponse<Account> {}

export interface IconSet {
  id: number;
  name: string;
  prefix: string;
  description?: string | null;
  total: number;
  author?: string | null;
  authorUrl?: string | null;
  license?: string | null;
  licenseUrl?: string | null;
  spdx?: string | null;
  category?: string | null;
  statusBadge?: string | null;
  pageUrl: string;
}

export interface Icon {
  id: number;
  name: string;
  slug: string;
  label?: string;
  description?: string | null;
  category?: string | null;
  width: number;
  height: number;
  viewBox: string;
  pageUrl: string;
  svgUrl: string;
  iconSet: IconSet | null;
}

export type IconSearchResult = Icon;

export interface IconWithSvg extends Icon {
  body: string;
  svg: string;
  contentType: "image/svg+xml";
}

export interface IconResponse extends DataResponse<Icon> {}
export interface IconSvgResponse extends DataResponse<IconWithSvg> {}

export interface IconSearchResponse {
  data: IconSearchResult[];
  meta: {
    query: string;
    category?: string | null;
    iconSetPrefix?: string | null;
    limit: number;
    offset: number;
    page: number;
    nextOffset: number;
    hasMore: boolean;
  };
}

export interface SearchIconsParams {
  q?: string;
  query?: string;
  category?: string;
  iconSetPrefix?: string;
  icon_set_prefix?: string;
  limit?: number;
  offset?: number;
  page?: number;
}

export type ProjectKitFramework = "svg" | "react-ts" | "vue" | "sprite";
export type ColorPolicy = "currentColor" | "preserve" | "strip";
export type NamingPolicy = "kebab" | "pascal" | "camel";

export interface ProjectKit {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  framework: ProjectKitFramework;
  colorPolicy: ColorPolicy;
  namingPolicy: NamingPolicy;
  iconsCount: number;
  showUrl?: string;
  updatedAt?: string | null;
  createdAt?: string | null;
}

export interface ProjectKitWriteRequest {
  name?: string;
  description?: string | null;
  framework?: ProjectKitFramework | null;
  colorPolicy?: ColorPolicy | null;
  color_policy?: ColorPolicy | null;
  namingPolicy?: NamingPolicy | null;
  naming_policy?: NamingPolicy | null;
}

export interface ProjectKitSummaryResponse extends DataResponse<ProjectKit> {}

export interface ProjectKitOptions {
  frameworks?: ProjectKitFramework[];
  colorPolicies?: ColorPolicy[];
  namingPolicies?: NamingPolicy[];
}

export interface ProjectKitListResponse {
  data: ProjectKit[];
  meta: {
    options?: ProjectKitOptions;
  };
}

export interface ProjectKitIcon {
  id: number;
  icon_set_id: number | null;
  name: string;
  width: number;
  height: number;
  body: string;
  iconSet: {
    id: number;
    name: string;
    prefix: string;
    license?: string | null;
    licenseUrl?: string | null;
  } | null;
}

export interface Pagination<T = ProjectKitIcon> {
  data: T[];
  current_page?: number;
  first_page_url?: string | null;
  from?: number | null;
  last_page?: number;
  last_page_url?: string | null;
  links?: Array<{
    url?: string | null;
    label?: string;
    active?: boolean;
  }>;
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number | null;
  total?: number;
  [key: string]: unknown;
}

export interface ProjectKitDetail extends ProjectKit {
  licenseSummary?: Array<{
    license: string;
    count: number;
    sets: Array<{
      name: string;
      prefix: string;
      licenseUrl?: string | null;
    }>;
  }>;
  iconSetSummary?: Array<{
    name: string;
    prefix: string;
    count: number;
  }>;
}

export interface ProjectKitDetailResponse {
  data: ProjectKitDetail;
  icons: Pagination<ProjectKitIcon>;
}

export interface AddIconResponse {
  data: {
    kit?: ProjectKit;
    iconId?: number;
    created?: boolean;
  };
}

export interface BulkAddIconsResponse {
  data: {
    kit?: ProjectKit;
    createdIconIds?: number[];
    existingIconIds?: number[];
    createdCount?: number;
    existingCount?: number;
  };
}

export interface RemoveIconResponse {
  data: {
    kit?: ProjectKit;
    iconId?: number;
    removed?: boolean;
  };
}

export type ExportFormat =
  | "svg-folder"
  | "svg-sprite"
  | "json-manifest"
  | "license-manifest"
  | "react-ts"
  | "vue"
  | "svelte"
  | "solid"
  | "blade"
  | "storybook"
  | "npm-package"
  | "png-pack"
  | "iconify-json";

export type PngSize = 16 | 24 | 32 | 48 | 96 | 128 | 256 | 512 | 1024;
export type PngDensity = 1 | 2 | 3;
export type IconPngDensity = PngDensity | 4;
export type PngBackgroundType = "transparent" | "solid";
export type IconColorMode = "preserve" | "black" | "white" | "custom";

export interface PngOptions {
  sizes?: PngSize[];
  densities?: PngDensity[];
  backgroundType?: PngBackgroundType;
  backgroundColor?: string;
  iconColorMode?: IconColorMode;
  iconColor?: string;
  padding?: number;
  fit?: "contain";
}

export interface ExportOptions {
  colorPolicy?: ColorPolicy;
  color_policy?: ColorPolicy;
  namingPolicy?: NamingPolicy;
  naming_policy?: NamingPolicy;
  sizeProps?: boolean;
  size_props?: boolean;
  typescript?: boolean;
  defaultSize?: number;
  default_size?: number;
  titleProp?: boolean;
  title_prop?: boolean;
  decorative?: boolean;
  componentSuffix?: string;
  component_suffix?: string;
  packageName?: string;
  package_name?: string;
  packageVersion?: string;
  package_version?: string;
  png?: PngOptions;
  [key: string]: unknown;
}

export interface CreateExportRequest {
  formats?: ExportFormat[];
  options?: ExportOptions;
}

export interface ProjectKitExport {
  id: number;
  status: "queued" | "processing" | "completed" | "failed";
  formats: ExportFormat[];
  options: Record<string, unknown>;
  artifactFilename?: string | null;
  artifactSize?: number | null;
  artifactExists: boolean;
  failureMessage?: string | null;
  createdAt?: string | null;
  queuedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  expiresAt?: string | null;
  statusUrl: string;
  downloadUrl: string | null;
}

export interface ExportResponse extends DataResponse<ProjectKitExport> {}

export interface PngExportRequest {
  iconName: string;
  sizes?: PngSize[];
  densities?: IconPngDensity[];
  backgroundType?: PngBackgroundType;
  backgroundColor?: string;
  iconColorMode?: IconColorMode;
  iconColor?: string;
  padding?: number;
  fit?: "contain";
  filename?: string;
  zip?: boolean;
}

export interface SvgiconsBinaryResponse {
  data: ArrayBuffer;
  contentType: string | null;
  contentLength: number | null;
  contentDisposition: string | null;
  filename: string | null;
  response: Response;
}

export type PngExportResponse = SvgiconsBinaryResponse;

export interface ErrorResponse {
  message: string;
  [key: string]: unknown;
}

export interface ScopeError extends ErrorResponse {
  requiredScopes: ScopeValue[];
  missingScope?: ScopeValue;
  pricingUrl?: string;
}

export interface ValidationError extends ErrorResponse {
  errors: Record<string, string[]>;
}
