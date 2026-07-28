import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/shared/lib/supabase/server";

import { GET } from "./route";

vi.mock("@/shared/lib/supabase/server", () => ({
  createClient: vi.fn()
}));

const createClientMock = vi.mocked(createClient);

function mockSupabase(options?: {
  exchangeError?: { code?: string; message: string; status?: number };
  user?: { id: string } | null;
}) {
  const exchangeCodeForSession = vi.fn().mockResolvedValue({
    error: options?.exchangeError ?? null
  });
  const getUser = vi.fn().mockResolvedValue({
    data: { user: options?.user ?? null },
    error: null
  });

  createClientMock.mockResolvedValue({
    auth: { exchangeCodeForSession, getUser }
  } as never);

  return { exchangeCodeForSession, getUser };
}

describe("GET /auth/callback", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("인증 코드 교환에 성공하면 요청한 경로로 이동한다", async () => {
    const mocks = mockSupabase();

    const response = await GET(
      new Request("https://focusdam.test/auth/callback?code=code-1&next=/home")
    );

    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith("code-1");
    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBe("https://focusdam.test/home");
  });

  it("코드 교환 오류가 나도 유효한 세션이 있으면 홈으로 이동한다", async () => {
    const mocks = mockSupabase({
      exchangeError: { code: "unexpected_failure", message: "exchange failed", status: 500 },
      user: { id: "user-1" }
    });

    const response = await GET(
      new Request("https://focusdam.test/auth/callback?code=code-1&next=/home&flow=login")
    );

    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(response.headers.get("location")).toBe("https://focusdam.test/home");
  });

  it("세션도 없으면 기존 계정 로그인 화면에 오류를 표시한다", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    mockSupabase({
      exchangeError: { code: "bad_code_verifier", message: "exchange failed", status: 400 }
    });

    const response = await GET(
      new Request("https://focusdam.test/auth/callback?code=code-1&next=/home&flow=login")
    );

    expect(response.headers.get("location")).toBe(
      "https://focusdam.test/onboarding/account?mode=login&error=oauth_callback"
    );
  });
});
