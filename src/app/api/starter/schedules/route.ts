import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";

const rangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime()
});

export async function GET(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const searchParams = new URL(request.url).searchParams;
  const parsedRange = rangeSchema.safeParse({
    from: searchParams.get("from"),
    to: searchParams.get("to")
  });

  if (!parsedRange.success) {
    return apiError(request, "VALIDATION_ERROR", 400, "조회할 예약 기간이 올바르지 않습니다.");
  }

  const { from, to } = parsedRange.data;
  const { data: schedules, error: schedulesError } = await auth.supabase
    .from("starter_schedules")
    .select("id, starter_action_id, scheduled_at, status, created_at")
    .eq("user_id", auth.user.id)
    .gte("scheduled_at", from)
    .lt("scheduled_at", to)
    .neq("status", "canceled")
    .order("scheduled_at", { ascending: true });

  if (schedulesError) {
    return apiError(request, "STARTER_SCHEDULES_FETCH_FAILED", 500, schedulesError.message);
  }

  const actionIds = [...new Set(schedules.map((schedule) => schedule.starter_action_id))];
  const { data: actions, error: actionsError } =
    actionIds.length > 0
      ? await auth.supabase
          .from("starter_actions")
          .select(
            "id, title, subtitle, planned_duration_minutes, recommended_duration_minutes"
          )
          .eq("user_id", auth.user.id)
          .in("id", actionIds)
      : { data: [], error: null };

  if (actionsError) {
    return apiError(request, "STARTER_ACTIONS_FETCH_FAILED", 500, actionsError.message);
  }

  const actionsById = new Map(actions.map((action) => [action.id, action]));

  return NextResponse.json({
    ok: true,
    schedules: schedules.flatMap((schedule) => {
      const action = actionsById.get(schedule.starter_action_id);

      if (!action) {
        return [];
      }

      return [
        {
          id: schedule.id,
          starterActionId: action.id,
          title: action.title,
          subtitle: action.subtitle,
          plannedDurationMinutes: action.planned_duration_minutes,
          recommendedDurationMinutes: action.recommended_duration_minutes,
          scheduledAt: schedule.scheduled_at,
          status: schedule.status,
          createdAt: schedule.created_at
        }
      ];
    })
  });
}
