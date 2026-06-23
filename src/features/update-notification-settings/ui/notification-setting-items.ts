import { Bell, CircleMinus, History, Hourglass } from 'lucide-react';

import type { NotificationSettingId } from '@/entities/notification-settings';

import type { NotificationSettingItem } from '../model/notification-settings.types';

export const NOTIFICATION_SETTING_ITEMS: NotificationSettingItem[] = [
  {
    id: 'startReminder',
    label: '착수 알림',
    value: '오전 10시',
    icon: Bell,
  },
  {
    id: 'spendHold',
    label: '소비 보류',
    value: '24시간 뒤',
    icon: Hourglass,
  },
  {
    id: 'emotionReset',
    label: '감정 리셋',
    value: '막힘 상태에서만',
    icon: History,
  },
  {
    id: 'quietHours',
    label: '방해금지',
    value: '오후 10시~오전 8시',
    icon: CircleMinus,
  },
] satisfies Array<{
  id: NotificationSettingId;
  label: string;
  value: string;
  icon: NotificationSettingItem['icon'];
}>;
