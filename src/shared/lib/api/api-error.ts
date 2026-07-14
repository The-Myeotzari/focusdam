import { NextResponse } from "next/server";

export type ApiErrorBody = {
  type: "about:blank";
  title: string;
  status: number;
  detail: string;
  timestamp: string;
  path: string;
};

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
