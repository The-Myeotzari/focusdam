import { MESSAGES } from "@/shared/constants/message";
import { apiError } from "@/shared/lib/api/api-error";
import { createServer } from "@/shared/lib/supabase/server";

export async function getUser(request: Request) {
  const supabase = await createServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      ok: false as const,
      response: apiError(request, "UNAUTHORIZED", 401, MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER),
    };
  }

  return { ok: true as const, supabase, user: data.user };
}
