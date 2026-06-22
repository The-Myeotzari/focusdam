import type { LucideIcon } from 'lucide-react';

export type NotificationSettingId = 'start-reminder' | 'spend-hold' | 'emotion-reset' | 'quiet-hours';

export type NotificationSettingItem = {
  id: NotificationSettingId;
  label: string;
  value: string;
  icon: LucideIcon;
};

export type NotificationSettingState = Record<NotificationSettingId, boolean>;
