import type { ZodType } from "zod";

import type { ApiErrorBody } from "@/shared/lib/api/api-error";

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
  const body: unknown = await response.json();

  if (!response.ok) {
    throw new ApiRequestError(body as ApiErrorBody);
  }

  return schema.parse(body);
}

export const Api = {
  get<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { ...init, method: "GET" });
  },
  post<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { ...init, method: "POST" });
  },
  patch<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { ...init, method: "PATCH" });
  },
  delete<T>(path: string, schema: ZodType<T>, init?: ApiRequestInit) {
    return request(path, schema, { ...init, method: "DELETE" });
  },
};
