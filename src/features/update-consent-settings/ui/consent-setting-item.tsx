// 선택 동의 설정 아이템 컴포넌트

import type { LucideIcon } from 'lucide-react';

import { SiteSwitch } from '@/shared/ui';

import type { ConsentSettingId } from '@/entities/consent-settings';

type Props = {
  checked: boolean;
  description: string;
  icon: LucideIcon;
  id: ConsentSettingId;
  label: string;
  onCheckedChange: (id: ConsentSettingId, checked: boolean) => void;
};

export function ConsentSettingItem({
  checked,
  description,
  icon: Icon,
  id,
  label,
  onCheckedChange,
}: Props) {
  return (
    <li className="flex min-h-[96px] items-center gap-4 rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-4 shadow-[var(--shadow-card)]">
      <span
        className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--ds-caution)] text-[var(--ds-caution-ink)]"
        aria-hidden="true"
      >
        <Icon size={24} strokeWidth={1.8} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium text-[var(--color-on-surface)]">{label}</span>
        <span className="mt-1 block text-xs text-[var(--color-on-surface-variant)]">
          {description}
        </span>
      </span>

      <SiteSwitch
        checked={checked}
        label={`${label} ${checked ? '동의 철회' : '동의'}`}
        onCheckedChange={(nextChecked) => onCheckedChange(id, nextChecked)}
      />
    </li>
  );
}
