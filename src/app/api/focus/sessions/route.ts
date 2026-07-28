import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";
import { parseJsonBody } from "@/shared/lib/api/request-validation";

const createSessionSchema = z.object({
  starterActionId: z.string().uuid().nullable().optional(),
  scheduleId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).max(100),
  subtitle: z.string().trim().max(200).nullable().optional(),
  plannedDurationMinutes: z.number().int().min(1).max(1440),
  recommendedDurationMinutes: z.number().int().min(1).max(1440).nullable().optional()
});

export async function GET(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const { data: session, error } = await auth.supabase
    .from("focus_sessions")
    .select(
      "id, starter_action_id, schedule_id, title_snapshot, subtitle_snapshot, planned_duration_minutes, recommended_duration_minutes, started_at, status"
    )
    .eq("user_id", auth.user.id)
    .in("status", ["running", "paused", "overtime"])
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return apiError(request, "FOCUS_SESSION_FETCH_FAILED", 500, error.message);
  }

  return NextResponse.json({
    ok: true,
    session: session
      ? {
          id: session.id,
          starterActionId: session.starter_action_id,
          scheduleId: session.schedule_id,
          title: session.title_snapshot,
          subtitle: session.subtitle_snapshot,
          plannedDurationMinutes: session.planned_duration_minutes,
          recommendedDurationMinutes: session.recommended_duration_minutes,
          startedAt: session.started_at,
          status: session.status
        }
      : null
  });
}

export async function POST(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const parsed = await parseJsonBody(request, createSessionSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const input = parsed.data;

  const { data: activeSessions, error: activeSessionsError } = await auth.supabase
    .from("focus_sessions")
    .select("id, schedule_id")
    .eq("user_id", auth.user.id)
    .in("status", ["running", "paused", "overtime"]);

  if (activeSessionsError) {
    return apiError(request, "FOCUS_SESSION_FETCH_FAILED", 500, activeSessionsError.message);
  }

  if (activeSessions.length > 0) {
    const activeSessionIds = activeSessions.map((session) => session.id);
    const endedAt = new Date().toISOString();
    const { error: cancelError } = await auth.supabase
      .from("focus_sessions")
      .update({ status: "canceled", ended_at: endedAt })
      .eq("user_id", auth.user.id)
      .in("id", activeSessionIds);

    if (cancelError) {
      return apiError(request, "FOCUS_SESSION_CANCEL_FAILED", 500, cancelError.message);
    }

    const { error: cancelEventsError } = await auth.supabase.from("focus_session_events").insert(
      activeSessionIds.map((sessionId) => ({
        user_id: auth.user.id,
        session_id: sessionId,
        event_type: "canceled" as const,
        event_reason: "새 집중 행동 시작"
      }))
    );

    if (cancelEventsError) {
      return apiError(request, "FOCUS_EVENT_CREATE_FAILED", 500, cancelEventsError.message);
    }

    const activeScheduleIds = activeSessions.flatMap((session) =>
      session.schedule_id ? [session.schedule_id] : []
    );

    if (activeScheduleIds.length > 0) {
      await auth.supabase
        .from("starter_schedules")
        .update({ status: "canceled" })
        .eq("user_id", auth.user.id)
        .in("id", activeScheduleIds);
    }
  }

  if (input.starterActionId) {
    const { data: action, error } = await auth.supabase
      .from("starter_actions")
      .select("id")
      .eq("id", input.starterActionId)
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (error) {
      return apiError(request, "STARTER_ACTION_FETCH_FAILED", 500, error.message);
    }

    if (!action) {
      return apiError(request, "STARTER_ACTION_NOT_FOUND", 404, "시작할 행동을 찾을 수 없습니다.");
    }
  }

  if (input.scheduleId) {
    const { data: schedule, error } = await auth.supabase
      .from("starter_schedules")
      .select("id, starter_action_id")
      .eq("id", input.scheduleId)
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (error) {
      return apiError(request, "STARTER_SCHEDULE_FETCH_FAILED", 500, error.message);
    }

    if (!schedule || (input.starterActionId && schedule.starter_action_id !== input.starterActionId)) {
      return apiError(request, "STARTER_SCHEDULE_NOT_FOUND", 404, "시작할 예약을 찾을 수 없습니다.");
    }
  }

  const { data: session, error: sessionError } = await auth.supabase
    .from("focus_sessions")
    .insert({
      user_id: auth.user.id,
      starter_action_id: input.starterActionId ?? null,
      schedule_id: input.scheduleId ?? null,
      title_snapshot: input.title,
      subtitle_snapshot: input.subtitle ?? null,
      planned_duration_minutes: input.plannedDurationMinutes,
      recommended_duration_minutes: input.recommendedDurationMinutes ?? null
    })
    .select("id, started_at")
    .single();

  if (sessionError) {
    return apiError(request, "FOCUS_SESSION_CREATE_FAILED", 500, sessionError.message);
  }

  const { error: eventError } = await auth.supabase.from("focus_session_events").insert({
    user_id: auth.user.id,
    session_id: session.id,
    event_type: "started"
  });

  if (eventError) {
    await auth.supabase
      .from("focus_sessions")
      .delete()
      .eq("id", session.id)
      .eq("user_id", auth.user.id);

    return apiError(request, "FOCUS_SESSION_CREATE_FAILED", 500, eventError.message);
  }

  if (input.starterActionId) {
    await auth.supabase
      .from("starter_actions")
      .update({ last_started_at: session.started_at })
      .eq("id", input.starterActionId)
      .eq("user_id", auth.user.id);
  }

  if (input.scheduleId) {
    await auth.supabase
      .from("starter_schedules")
      .update({ status: "started" })
      .eq("id", input.scheduleId)
      .eq("user_id", auth.user.id);
  }

  return NextResponse.json(
    {
      ok: true,
      session: {
        id: session.id,
        startedAt: session.started_at
      }
    },
    { status: 201 }
  );
}
