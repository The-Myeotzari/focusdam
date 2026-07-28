import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";
import { parseJsonBody } from "@/shared/lib/api/request-validation";

const emotionRecordSchema = z.object({
  sessionId: z.string().uuid().nullable().optional(),
  emotionLabel: z.string().trim().min(1).max(100),
  intensity: z.number().int().min(1).max(5).nullable().optional(),
  triggerNote: z.string().trim().max(500).nullable().optional(),
  resetAction: z.string().trim().max(200).nullable().optional(),
  returnedToFocus: z.boolean().nullable().optional()
});

export async function POST(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const parsed = await parseJsonBody(request, emotionRecordSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const input = parsed.data;

  if (input.sessionId) {
    const { data: session, error } = await auth.supabase
      .from("focus_sessions")
      .select("id")
      .eq("id", input.sessionId)
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (error) {
      return apiError(request, "FOCUS_SESSION_FETCH_FAILED", 500, error.message);
    }

    if (!session) {
      return apiError(request, "FOCUS_SESSION_NOT_FOUND", 404, "집중 세션을 찾을 수 없습니다.");
    }
  }

  const { data: record, error } = await auth.supabase
    .from("emotion_records")
    .insert({
      user_id: auth.user.id,
      session_id: input.sessionId ?? null,
      emotion_label: input.emotionLabel,
      intensity: input.intensity ?? null,
      trigger_note: input.triggerNote ?? null,
      reset_action: input.resetAction ?? null,
      returned_to_focus: input.returnedToFocus ?? null
    })
    .select("id")
    .single();

  if (error) {
    return apiError(request, "EMOTION_RECORD_CREATE_FAILED", 500, error.message);
  }

  return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
}
