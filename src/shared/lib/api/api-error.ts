import { NextResponse } from "next/server";
import type { ApiErrorBody } from '@/shared/lib/api/api-error.schema';

export type { ApiErrorBody } from '@/shared/lib/api/api-error.schema';

export function apiError(request: Request, title: string, status: number, detail: string) {
  return NextResponse.json<ApiErrorBody>(
    {
      type: "about:blank",
      title,
      status,
      detail,
      timestamp: new Date().toISOString(),
      path: new URL(request.url).pathname,
    },
    { status },
  );
}
