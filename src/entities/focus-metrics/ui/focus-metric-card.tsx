// 홈 화면 통계 전용 카드 컴포넌트

import type { LucideIcon } from 'lucide-react';

import { SiteCard } from '@/shared/ui';

type Props = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  descriptionClassName: string;
};

export function FocusMetricCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  descriptionClassName,
}: Props) {
  return (
    <SiteCard
      padded={false}
      className="flex min-h-[180px] flex-col !rounded-[32px] !border !border-[#c2c7ce1a] !bg-white !p-5"
    >
      <span
        className={`grid size-10 place-items-center rounded-full ${iconClassName}`}
        aria-hidden="true"
      >
        <Icon size={21} strokeWidth={1.8} />
      </span>

      <p className="mt-5 text-[11px] text-[var(--color-on-surface-variant)]">{label}</p>

      <p className="text-[22px] font-medium text-[var(--color-on-surface)]">{value}</p>

      <p className={`mt-auto pt-4 text-[11px] font-medium ${descriptionClassName}`}>
        {description}
      </p>
    </SiteCard>
  );
}
