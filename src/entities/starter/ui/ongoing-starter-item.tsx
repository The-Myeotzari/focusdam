// 기존 유저 홈 화면 진행 중인 활동 아이템 컴포넌트

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { formatStarterSchedule } from '@/entities/starter';
import type { OngoingStarter } from '@/entities/starter';

type Props = {
  starter: OngoingStarter;
};

export function OngoingStarterItem({ starter }: Props) {
  const description = formatStarterSchedule(
    starter.startedAt,
    starter.durationMinutes
  );

  return (
    // 빌드 오류가 발생하여 임의로 Link 주석 처리
    // <Link
    //   href={`/starters/${starter.id}`}
    <article
      className="flex min-h-[104px] items-center gap-4 rounded-[32px] bg-[#f4f3f6] px-6 transition hover:bg-[var(--color-surface-container)]"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[var(--color-on-surface)]">
          {starter.title}
        </span>

        <span className="mt-1 block text-[11px] text-[var(--color-on-surface-variant)]">
          {description}
        </span>
      </span>

      <ChevronRight
        size={20}
        className="shrink-0 text-[#72777e]"
        aria-hidden="true"
      />
    {/* </Link> */}
    </article>
  );
}