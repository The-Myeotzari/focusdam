import { Bell, CircleMinus, History, Hourglass } from 'lucide-react';

import type {
  NotificationSettingItem,
  NotificationSettingState,
} from './notification-settings.types';

export const NOTIFICATION_SETTING_ITEMS: NotificationSettingItem[] = [
  {
    id: 'start-reminder',
    label: '착수 알림',
    value: '오전 10시',
    icon: Bell,
  },
  {
    id: 'spend-hold',
    label: '소비 보류',
    value: '24시간 뒤',
    icon: Hourglass,
  },
  {
    id: 'emotion-reset',
    label: '감정 리셋',
    value: '막힘 상태에서만',
    icon: History,
  },
  {
    id: 'quiet-hours',
    label: '방해금지',
    value: '오후 10시~오전 8시',
    icon: CircleMinus,
  },
];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingState = {
  'start-reminder': true,
  'spend-hold': true,
  'emotion-reset': false,
  'quiet-hours': true,
};
