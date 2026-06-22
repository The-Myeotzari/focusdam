// 설정 메뉴 아이템 컴포넌트

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import type { SettingsMenuItemType } from '@/widgets/settings-menu';

type Props = SettingsMenuItemType;

const TONE_CLASS_NAMES: Record<SettingsMenuItemType['tone'], string> = {
  primary: 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)]',
  success: 'bg-[var(--ds-success)] text-[var(--ds-success-ink)]',
  caution: 'bg-[var(--ds-caution)] text-[var(--ds-caution-ink)]',
  premium: 'bg-[var(--ds-premium)] text-[var(--ds-premium-ink)]',
  safety: 'bg-[var(--ds-safety)] text-[var(--ds-safety-ink)]',
};

export function SettingsMenuItem({ href, title, description, icon: Icon, tone }: Props) {
  return (
    <li>
      <Link
        href={href}
        className="group flex min-h-[88px] items-center gap-4 rounded-[var(--radius-xl)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-container-low)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
      >
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-full ${TONE_CLASS_NAMES[tone]}`}
          aria-hidden="true"
        >
          <Icon size={24} strokeWidth={1.8} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold text-[var(--color-on-surface)]">
            {title}
          </span>
          <span className="mt-1 block text-sm leading-5 text-[var(--color-on-surface-variant)]">
            {description}
          </span>
        </span>

        <ChevronRight
          size={20}
          className="shrink-0 text-[var(--color-outline)] transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
