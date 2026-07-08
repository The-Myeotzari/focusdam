import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/onboarding/account?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/onboarding/account?error=oauth_callback`);
  }

  return NextResponse.redirect(`${origin}${next === '/' ? '/home' : next}`);
}

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}
