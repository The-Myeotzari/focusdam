import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(`${origin}/onboarding/start`, {
    status: 303
  });
}
