import type { ZodType } from "zod";

import { ApiErrorSchema, type ApiErrorBody } from "@/shared/lib/api/api-error.schema";

type ApiRequestInit = RequestInit & {
  baseUrl?: string;
};

export class ApiRequestError extends Error {
  constructor(public readonly body: ApiErrorBody) {
    super(body.detail);
    this.name = "ApiRequestError";
  }
}

async function request<T>(path: string, schema: ZodType<T>, init: ApiRequestInit = {}) {
  const { baseUrl = "", ...requestInit } = init;
  const response = await fetch(`${baseUrl}/api${path}`, requestInit);
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = ApiErrorSchema.safeParse(body);
    const fallbackError: ApiErrorBody = {
      type: 'about:blank',
      title: 'HTTP_ERROR',
      status: response.status,
      detail: response.statusText || 'API 요청에 실패했습니다.',
      timestamp: new Date().toISOString(),
      path,
    };

    throw new ApiRequestError(parsedError.success ? parsedError.data : fallbackError);
  }

  return schema.parse(body);
}

export const Api = {
  get<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { cache: "no-store", ...init, method: "GET" });
  },
  post<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { ...init, method: "POST" });
  },
  patch<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { ...init, method: "PATCH" });
  },
  put<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { ...init, method: "PUT" });
  },
  delete<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { ...init, method: "DELETE" });
  },
};
