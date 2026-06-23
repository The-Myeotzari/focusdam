import { SiteSwitch } from '@/shared/ui';

import type { NotificationSettingId } from '@/entities/notification-settings';

import type { NotificationSettingItem as NotificationSettingItemType } from '../model/notification-settings.types';

type Props = {
  checked: boolean;
  item: NotificationSettingItemType;
  onCheckedChange: (id: NotificationSettingId, checked: boolean) => void;
};

export function NotificationSettingItem({ checked, item, onCheckedChange }: Props) {
  const Icon = item.icon;

  return (
    <li className="flex min-h-[96px] items-center gap-4 rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-4 shadow-[var(--shadow-card)]">
      <span
        className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-primary)]"
        aria-hidden="true"
      >
        <Icon size={24} strokeWidth={1.8} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[var(--color-on-surface-variant)]">
          {item.label}
        </span>
        <span className="mt-1 block text-lg font-medium text-[var(--color-on-surface)]">
          {item.value}
        </span>
      </span>

      <SiteSwitch
        checked={checked}
        label={`${item.label} ${checked ? '끄기' : '켜기'}`}
        onCheckedChange={(nextChecked) => onCheckedChange(item.id, nextChecked)}
      />
    </li>
  );
}
