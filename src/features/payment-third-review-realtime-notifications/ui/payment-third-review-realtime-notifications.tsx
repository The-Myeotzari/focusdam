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
import { getPaymentThirdReviewListClient } from '@/entities/payment-third-review/api/payment-third-review-list.client';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { createClient } from '@/shared/lib/supabase/client';
import { SiteToast, SiteToastViewport } from '@/shared/ui';
import {
  getMissedPaymentThirdReviewNotification,
  getPaymentThirdReviewRealtimeNotification,
  shouldUseRealtimeFallback,
  type PaymentThirdReviewRealtimeNotification,
} from '../model/payment-third-review-realtime-notification';

const FALLBACK_REFETCH_INTERVAL_MS = 60_000;
const SEEN_FOLLOW_UPS_STORAGE_PREFIX = 'focusdam:seen-payment-review-followups';

type VisibleNotification = PaymentThirdReviewRealtimeNotification & {
  key: string;
};

export function PaymentThirdReviewRealtimeNotifications() {
  const queryClient = useQueryClient();
  const settingsRef = useRef<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const seenFollowUpIdsRef = useRef(new Set<string>());
  const userIdRef = useRef<string | null>(null);
  const [notification, setNotification] = useState<VisibleNotification | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let disposed = false;
    let recoveryInFlight = false;
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const persistSeenFollowUps = () => {
      const userId = userIdRef.current;
      if (!userId) return;

      try {
        sessionStorage.setItem(
          getSeenFollowUpsStorageKey(userId),
          JSON.stringify([...seenFollowUpIdsRef.current]),
        );
      } catch {
        // 세션 저장소를 사용할 수 없어도 메모리 내 중복 방지는 유지한다.
      }
    };

    const showNotification = (nextNotification: PaymentThirdReviewRealtimeNotification | null) => {
      if (
        !nextNotification ||
        seenFollowUpIdsRef.current.has(nextNotification.followUpId)
      ) {
        return;
      }

      seenFollowUpIdsRef.current.add(nextNotification.followUpId);
      persistSeenFollowUps();
      setNotification({
        ...nextNotification,
        key: `${nextNotification.followUpId}:${Date.now()}`,
      });
    };

    const recoverMissedNotification = async () => {
      if (disposed || !userIdRef.current || recoveryInFlight) return;

      recoveryInFlight = true;

      try {
        const response = await getPaymentThirdReviewListClient({ page: 1, size: 100 });

        if (disposed) return;

        showNotification(
          getMissedPaymentThirdReviewNotification(
            response.items,
            settingsRef.current,
            seenFollowUpIdsRef.current,
          ),
        );
      } catch {
        // 기존 화면의 refetch 정책이 다음 복구 시도를 이어간다.
      } finally {
        recoveryInFlight = false;
      }
    };

    const refreshPaymentReviews = () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.paymentThirdReviews.all,
      });
    };

    const stopFallbackRefetch = () => {
      if (fallbackTimer) {
        clearInterval(fallbackTimer);
        fallbackTimer = null;
      }
    };

    const startFallbackRefetch = () => {
      if (fallbackTimer) return;

      void recoverMissedNotification();
      fallbackTimer = setInterval(() => {
        refreshPaymentReviews();
        void recoverMissedNotification();
      }, FALLBACK_REFETCH_INTERVAL_MS);
    };

    const handleSettingsUpdate = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;

      const parsedSettings = NotificationSettingsSchema.safeParse(event.detail);

      if (parsedSettings.success) {
        settingsRef.current = parsedSettings.data;
        void recoverMissedNotification();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      refreshPaymentReviews();
      void getNotificationSettings()
        .then((settings) => {
          settingsRef.current = settings;
        })
        .catch(() => undefined)
        .finally(() => {
          void recoverMissedNotification();
        });
    };

    window.addEventListener(NOTIFICATION_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    void Promise.all([
      supabase.auth.getUser(),
      getNotificationSettings().catch(() => DEFAULT_NOTIFICATION_SETTINGS),
    ]).then(([authResult, settings]) => {
      if (disposed || !authResult.data.user) {
        return;
      }

      const userId = authResult.data.user.id;
      userIdRef.current = userId;
      settingsRef.current = settings;
      seenFollowUpIdsRef.current = readSeenFollowUpIds(userId);

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
            refreshPaymentReviews();
            showNotification(
              getPaymentThirdReviewRealtimeNotification(
                payload.new,
                settingsRef.current,
              ),
            );
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
            const parsedSettings = NotificationSettingsSchema.safeParse({
              startReminder: row.start_reminder,
              spendHold: row.spend_hold,
              emotionReset: row.emotion_reset,
              quietHours: row.quiet_hours,
            });

            if (parsedSettings.success) {
              settingsRef.current = parsedSettings.data;
              void recoverMissedNotification();
            }
          },
        )
        .subscribe((status) => {
          if (disposed) return;

          if (status === 'SUBSCRIBED') {
            stopFallbackRefetch();
            refreshPaymentReviews();
            void recoverMissedNotification();
            return;
          }

          if (shouldUseRealtimeFallback(status)) {
            startFallbackRefetch();
          }
        });
    });

    return () => {
      disposed = true;
      stopFallbackRefetch();

      if (channel) {
        void supabase.removeChannel(channel);
      }

      window.removeEventListener(NOTIFICATION_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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

function getSeenFollowUpsStorageKey(userId: string) {
  return `${SEEN_FOLLOW_UPS_STORAGE_PREFIX}:${userId}`;
}

function readSeenFollowUpIds(userId: string) {
  try {
    const storedValue = sessionStorage.getItem(getSeenFollowUpsStorageKey(userId));
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];

    return new Set(
      Array.isArray(parsedValue)
        ? parsedValue.filter((value): value is string => typeof value === 'string')
        : [],
    );
  } catch {
    return new Set<string>();
  }
}
