'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import {
  DEFAULT_NOTIFICATION_SETTINGS,
  getNotificationSettings,
  NOTIFICATION_SETTINGS_UPDATED_EVENT,
  NotificationSettingsSchema,
  type NotificationSettings,
} from '@/entities/notification-settings';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { createClient } from '@/shared/lib/supabase/client';
import { SiteToast, SiteToastViewport } from '@/shared/ui';
import {
  getPaymentThirdReviewRealtimeNotification,
  type PaymentThirdReviewRealtimeNotification,
} from '../model/payment-third-review-realtime-notification';

type VisibleNotification = PaymentThirdReviewRealtimeNotification & {
  key: string;
};

export function PaymentThirdReviewRealtimeNotifications() {
  const queryClient = useQueryClient();
  const settingsRef = useRef<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [notification, setNotification] = useState<VisibleNotification | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let disposed = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const handleSettingsUpdate = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;

      const parsedSettings = NotificationSettingsSchema.safeParse(event.detail);

      if (parsedSettings.success) {
        settingsRef.current = parsedSettings.data;
      }
    };

    window.addEventListener(NOTIFICATION_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);

    void Promise.all([
      supabase.auth.getUser(),
      getNotificationSettings().catch(() => DEFAULT_NOTIFICATION_SETTINGS),
    ]).then(([authResult, settings]) => {
      if (disposed || !authResult.data.user) {
        return;
      }

      const userId = authResult.data.user.id;
      settingsRef.current = settings;

      channel = supabase
        .channel(`payment-third-review-notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'payment_review_followups',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            void queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.paymentThirdReviews.all,
            });

            const nextNotification = getPaymentThirdReviewRealtimeNotification(
              payload.new,
              settingsRef.current,
            );

            if (nextNotification) {
              setNotification({
                ...nextNotification,
                key: `${nextNotification.followUpId}:${Date.now()}`,
              });
            }
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notification_settings',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const row = payload.new as Record<string, unknown>;

            if (
              typeof row.start_reminder === 'boolean' &&
              typeof row.spend_hold === 'boolean' &&
              typeof row.emotion_reset === 'boolean' &&
              typeof row.quiet_hours === 'boolean'
            ) {
              settingsRef.current = {
                startReminder: row.start_reminder,
                spendHold: row.spend_hold,
                emotionReset: row.emotion_reset,
                quietHours: row.quiet_hours,
              };
            }
          },
        )
        .subscribe();
    });

    return () => {
      disposed = true;

      if (channel) {
        void supabase.removeChannel(channel);
      }

      window.removeEventListener(NOTIFICATION_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    };
  }, [queryClient]);

  return (
    <SiteToastViewport>
      <SiteToast
        key={notification?.key}
        open={notification !== null}
        title={notification?.title}
        description={
          notification ? (
            <>
              {notification.description}{' '}
              <Link className="font-semibold underline" href={notification.href}>
                확인하기
              </Link>
            </>
          ) : undefined
        }
        duration={5000}
        onOpenChange={(open) => {
          if (!open) setNotification(null);
        }}
      />
    </SiteToastViewport>
  );
}
