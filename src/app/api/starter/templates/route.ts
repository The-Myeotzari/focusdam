import { NextResponse } from "next/server";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";

export async function GET(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const searchParams = new URL(request.url).searchParams;
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.trim();

  let query = auth.supabase
    .from("starter_action_templates")
    .select(
      "id, category, label, title, description, difficulty, default_duration_minutes, recommended_duration_minutes"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.ilike("title", `%${search.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`);
  }

  const { data, error } = await query.limit(50);

  if (error) {
    return apiError(request, "STARTER_TEMPLATES_FETCH_FAILED", 500, error.message);
  }

  return NextResponse.json({
    ok: true,
    templates: data.map((template) => ({
      id: template.id,
      category: template.category,
      label: template.label,
      title: template.title,
      description: template.description,
      difficulty: template.difficulty,
      defaultDurationMinutes: template.default_duration_minutes,
      recommendedDurationMinutes: template.recommended_duration_minutes
    }))
  });
}
