import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";
import { parseJsonBody } from "@/shared/lib/api/request-validation";

const starterActionSchema = z.object({
  title: z.string().trim().min(1).max(100),
  subtitle: z.string().trim().max(200).nullable().optional(),
  target: z.string().trim().max(100).nullable().optional(),
  microAction: z.string().trim().max(100).nullable().optional(),
  verb: z.string().trim().max(50).nullable().optional(),
  category: z.string().trim().max(50).nullable().optional(),
  templateId: z.string().uuid().nullable().optional(),
  source: z.enum(["custom", "template", "recent", "favorite", "split"]).default("custom"),
  plannedDurationMinutes: z.number().int().min(1).max(1440).default(25),
  recommendedDurationMinutes: z.number().int().min(1).max(1440).default(10),
  isFavorite: z.boolean().default(false),
  scheduledAt: z.string().datetime().nullable().optional()
});

export async function GET(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const searchParams = new URL(request.url).searchParams;
  const kind = searchParams.get("kind");
  const requestedLimit = Number(searchParams.get("limit") ?? 20);
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 50)
    : 20;

  let query = auth.supabase
    .from("starter_actions")
    .select(
      "id, title, subtitle, target, micro_action, verb, category, template_id, source, planned_duration_minutes, recommended_duration_minutes, is_favorite, last_started_at, created_at"
    )
    .eq("user_id", auth.user.id)
    .is("archived_at", null);

  if (kind === "favorite") {
    query = query.eq("is_favorite", true);
  }

  const { data, error } = await query
    .order(kind === "recent" ? "last_started_at" : "created_at", {
      ascending: false,
      nullsFirst: false
    })
    .limit(limit);

  if (error) {
    return apiError(request, "STARTER_ACTIONS_FETCH_FAILED", 500, error.message);
  }

  return NextResponse.json({
    ok: true,
    actions: data.map((action) => ({
      id: action.id,
      title: action.title,
      subtitle: action.subtitle,
      target: action.target,
      microAction: action.micro_action,
      verb: action.verb,
      category: action.category,
      templateId: action.template_id,
      source: action.source,
      plannedDurationMinutes: action.planned_duration_minutes,
      recommendedDurationMinutes: action.recommended_duration_minutes,
      isFavorite: action.is_favorite,
      lastStartedAt: action.last_started_at,
      createdAt: action.created_at
    }))
  });
}

export async function POST(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const parsed = await parseJsonBody(request, starterActionSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const input = parsed.data;

  if (input.templateId) {
    const { data: template, error: templateError } = await auth.supabase
      .from("starter_action_templates")
      .select("id")
      .eq("id", input.templateId)
      .eq("is_active", true)
      .maybeSingle();

    if (templateError) {
      return apiError(request, "STARTER_TEMPLATE_FETCH_FAILED", 500, templateError.message);
    }

    if (!template) {
      return apiError(request, "STARTER_TEMPLATE_NOT_FOUND", 404, "행동 템플릿을 찾을 수 없습니다.");
    }
  }

  const { data: action, error: actionError } = await auth.supabase
    .from("starter_actions")
    .insert({
      user_id: auth.user.id,
      title: input.title,
      subtitle: input.subtitle ?? null,
      target: input.target ?? null,
      micro_action: input.microAction ?? null,
      verb: input.verb ?? null,
      category: input.category ?? null,
      template_id: input.templateId ?? null,
      source: input.source,
      planned_duration_minutes: input.plannedDurationMinutes,
      recommended_duration_minutes: input.recommendedDurationMinutes,
      is_favorite: input.isFavorite
    })
    .select("id")
    .single();

  if (actionError) {
    return apiError(request, "STARTER_ACTION_CREATE_FAILED", 500, actionError.message);
  }

  let scheduleId: string | null = null;

  if (input.scheduledAt) {
    const { data: schedule, error: scheduleError } = await auth.supabase
      .from("starter_schedules")
      .insert({
        user_id: auth.user.id,
        starter_action_id: action.id,
        scheduled_at: input.scheduledAt
      })
      .select("id")
      .single();

    if (scheduleError) {
      await auth.supabase
        .from("starter_actions")
        .delete()
        .eq("id", action.id)
        .eq("user_id", auth.user.id);

      return apiError(request, "STARTER_SCHEDULE_CREATE_FAILED", 500, scheduleError.message);
    }

    scheduleId = schedule.id;
  }

  return NextResponse.json(
    {
      ok: true,
      actionId: action.id,
      scheduleId
    },
    { status: 201 }
  );
}
