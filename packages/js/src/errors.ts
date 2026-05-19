export interface ApiErrorOptions {
  status: number;
  statusText: string;
  body: unknown;
  method: string;
  path: string;
  response?: Response;
}

export class ApiError<TBody = unknown> extends Error {
  readonly body: TBody;
  readonly method: string;
  readonly path: string;
  readonly response: Response | undefined;
  readonly status: number;
  readonly statusText: string;

  constructor(options: ApiErrorOptions) {
    super(errorMessage(options));
    this.name = "ApiError";
    this.status = options.status;
    this.statusText = options.statusText;
    this.body = options.body as TBody;
    this.method = options.method;
    this.path = options.path;
    this.response = options.response;
  }
}

function errorMessage(options: ApiErrorOptions): string {
  if (isObject(options.body) && typeof options.body.message === "string") {
    return options.body.message;
  }

  return `${options.method} ${options.path} failed with ${options.status} ${options.statusText}`.trim();
}

function isObject(value: unknown): value is { message?: unknown } {
  return typeof value === "object" && value !== null;
}
