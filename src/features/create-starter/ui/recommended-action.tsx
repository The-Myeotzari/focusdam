// '추천 작은 행동' 랜덤 출력 컴포넌트

import { Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { connection } from 'next/server';

import { getRandomRecommendedAction } from '@/features/create-starter';

export async function RecommendedAction() {
  await connection();

  const action = getRandomRecommendedAction();

  return (
    <Link
      href={{
        pathname: 'starter/new',
        query: { action },
      }}
      className="flex w-full items-center gap-4 text-left"
    >
      <span
        className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e0e6ef] text-[var(--color-primary)]"
        aria-hidden="true"
      >
        <Lightbulb size={24} strokeWidth={1.8} />
      </span>

      <span className="flex flex-col">
        <span className="text-[11px] font-medium text-[var(--color-on-surface-variant)]">
          추천 작은 행동
        </span>

        <span className="mt-0.5 text-sm text-[var(--color-on-surface)]">{action}</span>
      </span>
    </Link>
  );
}
