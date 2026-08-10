import { NextResponse } from 'next/server';

import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NotificationSettingsSchema,
} from '@/entities/notification-settings';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { parseJsonBody } from '@/shared/lib/api/request-validation';

const notificationSettingsColumns =
  'start_reminder,spend_hold,emotion_reset,quiet_hours' as const;

export async function GET(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const { data, error } = await auth.supabase
    .from('notification_settings')
    .select(notificationSettingsColumns)
    .eq('user_id', auth.user.id)
    .maybeSingle();

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message);
  }

  return settingsResponse(data ? toNotificationSettings(data) : DEFAULT_NOTIFICATION_SETTINGS);
}

export async function PATCH(request: Request) {
  const parsedBody = await parseJsonBody(request, NotificationSettingsSchema);

  if (!parsedBody.success) {
    return parsedBody.response;
  }

  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const settings = parsedBody.data;
  const { data, error } = await auth.supabase
    .from('notification_settings')
    .upsert(
      {
        user_id: auth.user.id,
        start_reminder: settings.startReminder,
        spend_hold: settings.spendHold,
        emotion_reset: settings.emotionReset,
        quiet_hours: settings.quietHours,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select(notificationSettingsColumns)
    .single();

  if (error || !data) {
    return apiError(
      request,
      'INTERNAL_SERVER_ERROR',
      500,
      error?.message ?? '알림 설정을 저장하지 못했습니다.',
    );
  }

  return settingsResponse(toNotificationSettings(data));
}

function toNotificationSettings(row: {
  start_reminder: boolean;
  spend_hold: boolean;
  emotion_reset: boolean;
  quiet_hours: boolean;
}) {
  return {
    startReminder: row.start_reminder,
    spendHold: row.spend_hold,
    emotionReset: row.emotion_reset,
    quietHours: row.quiet_hours,
  };
}

function settingsResponse(settings: ReturnType<typeof toNotificationSettings>) {
  return NextResponse.json(
    { ok: true, settings },
    { headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
  );
}
