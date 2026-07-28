import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));
  const isLoginFlow = searchParams.get("flow") === "login";
  const accountErrorUrl = new URL("/onboarding/account", origin);

  if (isLoginFlow) {
    accountErrorUrl.searchParams.set("mode", "login");
  }

  if (!code) {
    accountErrorUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(accountErrorUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.redirect(`${origin}${next === '/' ? '/home' : next}`);
    }

    console.error("OAuth callback exchange failed", {
      code: error.code,
      message: error.message,
      status: error.status
    });
    accountErrorUrl.searchParams.set("error", "oauth_callback");
    return NextResponse.redirect(accountErrorUrl);
  }

  return NextResponse.redirect(`${origin}${next === '/' ? '/home' : next}`);
}

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}
