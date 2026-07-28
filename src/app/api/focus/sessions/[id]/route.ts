import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";
import { parseJsonBody } from "@/shared/lib/api/request-validation";

const updateSessionSchema = z
  .object({
    status: z.enum(["running", "paused", "overtime", "completed", "canceled"]).optional(),
    eventType: z
      .enum([
        "paused",
        "resumed",
        "emotion_reset_started",
        "emotion_reset_completed",
        "overtime_started",
        "extended",
        "split_task",
        "completed",
        "canceled"
      ])
      .optional(),
    eventReason: z.string().trim().max(200).nullable().optional(),
    actualDurationSeconds: z.number().int().min(0).optional(),
    overrunSeconds: z.number().int().min(0).optional(),
    completionMood: z.enum(["light", "neutral", "hard"]).optional(),
    focusLevel: z.enum(["low", "medium", "high"]).optional()
  })
  .refine(
    (value) =>
      value.status !== undefined ||
      value.eventType !== undefined ||
      value.actualDurationSeconds !== undefined ||
      value.overrunSeconds !== undefined ||
      value.completionMood !== undefined ||
      value.focusLevel !== undefined,
    "변경할 세션 정보가 필요합니다."
  );

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;

  if (!z.string().uuid().safeParse(id).success) {
    return apiError(request, "VALIDATION_ERROR", 400, "세션 ID가 올바르지 않습니다.");
  }

  const parsed = await parseJsonBody(request, updateSessionSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const input = parsed.data;
  const { data: existingSession, error: existingSessionError } = await auth.supabase
    .from("focus_sessions")
    .select("id, schedule_id")
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (existingSessionError) {
    return apiError(request, "FOCUS_SESSION_FETCH_FAILED", 500, existingSessionError.message);
  }

  if (!existingSession) {
    return apiError(request, "FOCUS_SESSION_NOT_FOUND", 404, "집중 세션을 찾을 수 없습니다.");
  }

  const terminal = input.status === "completed" || input.status === "canceled";
  const { error: updateError } = await auth.supabase
    .from("focus_sessions")
    .update({
      ...(input.status ? { status: input.status } : {}),
      ...(terminal ? { ended_at: new Date().toISOString() } : {}),
      ...(input.actualDurationSeconds !== undefined
        ? { actual_duration_seconds: input.actualDurationSeconds }
        : {}),
      ...(input.overrunSeconds !== undefined ? { overrun_seconds: input.overrunSeconds } : {}),
      ...(input.completionMood ? { completion_mood: input.completionMood } : {}),
      ...(input.focusLevel ? { focus_level: input.focusLevel } : {})
    })
    .eq("id", id)
    .eq("user_id", auth.user.id);

  if (updateError) {
    return apiError(request, "FOCUS_SESSION_UPDATE_FAILED", 500, updateError.message);
  }

  if (input.eventType) {
    const { error: eventError } = await auth.supabase.from("focus_session_events").insert({
      user_id: auth.user.id,
      session_id: id,
      event_type: input.eventType,
      event_reason: input.eventReason ?? null
    });

    if (eventError) {
      return apiError(request, "FOCUS_EVENT_CREATE_FAILED", 500, eventError.message);
    }
  }

  if (existingSession.schedule_id && terminal) {
    await auth.supabase
      .from("starter_schedules")
      .update({ status: input.status === "completed" ? "completed" : "canceled" })
      .eq("id", existingSession.schedule_id)
      .eq("user_id", auth.user.id);
  }

  return NextResponse.json({ ok: true });
}
