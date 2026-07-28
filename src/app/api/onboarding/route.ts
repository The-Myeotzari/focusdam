import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";
import { parseJsonBody } from "@/shared/lib/api/request-validation";

const onboardingSchema = z.object({
  analysisUsage: z.boolean(),
  emotionRecord: z.boolean(),
  startReminder: z.boolean(),
  spendHold: z.boolean(),
  emotionReset: z.boolean()
});

export async function POST(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const parsed = await parseJsonBody(request, onboardingSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const { analysisUsage, emotionRecord, startReminder, spendHold, emotionReset } = parsed.data;
  const userId = auth.user.id;

  const { error: consentSettingsError } = await auth.supabase.from("consent_settings").upsert(
    {
      user_id: userId,
      analysis_usage: analysisUsage,
      emotion_record: emotionRecord
    },
    { onConflict: "user_id" }
  );

  if (consentSettingsError) {
    return apiError(request, "ONBOARDING_SAVE_FAILED", 500, consentSettingsError.message);
  }

  const { error: notificationSettingsError } = await auth.supabase
    .from("notification_settings")
    .upsert(
      {
        user_id: userId,
        start_reminder: startReminder,
        spend_hold: spendHold,
        emotion_reset: emotionReset
      },
      { onConflict: "user_id" }
    );

  if (notificationSettingsError) {
    return apiError(request, "ONBOARDING_SAVE_FAILED", 500, notificationSettingsError.message);
  }

  const { error: consentEventsError } = await auth.supabase.from("consent_events").insert([
    {
      user_id: userId,
      consent_key: "required_service_terms",
      granted: true,
      source: "onboarding"
    },
    {
      user_id: userId,
      consent_key: "analysis_usage",
      granted: analysisUsage,
      source: "onboarding"
    },
    {
      user_id: userId,
      consent_key: "emotion_record",
      granted: emotionRecord,
      source: "onboarding"
    }
  ]);

  if (consentEventsError) {
    return apiError(request, "ONBOARDING_SAVE_FAILED", 500, consentEventsError.message);
  }

  const { error: profileError } = await auth.supabase
    .from("profiles")
    .update({ onboarded_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (profileError) {
    return apiError(request, "ONBOARDING_SAVE_FAILED", 500, profileError.message);
  }

  return NextResponse.json({ ok: true });
}
