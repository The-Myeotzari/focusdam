import { NextResponse } from "next/server";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";

export async function GET(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const { data: profile, error } = await auth.supabase
    .from("profiles")
    .select("display_name, email, social_provider")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return apiError(request, "INTERNAL_SERVER_ERROR", 500, error.message);
  }

  const socialProvider = profile?.social_provider;

  if (!socialProvider) {
    return apiError(request, "PROFILE_NOT_FOUND", 404, "사용자 프로필을 찾을 수 없습니다.");
  }

  return NextResponse.json({
    ok: true,
    user: {
      name: profile.display_name ?? profile.email.split("@")[0],
      email: profile.email,
      socialProvider,
    },
  });
}
