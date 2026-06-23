import type { LucideIcon } from 'lucide-react';

import type { NotificationSettingId } from '@/entities/notification-settings';

export type NotificationSettingItem = {
  id: NotificationSettingId;
  label: string;
  value: string;
  icon: LucideIcon;
};
