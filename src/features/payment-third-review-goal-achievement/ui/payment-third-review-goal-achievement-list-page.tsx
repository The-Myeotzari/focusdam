import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';

import {
  formatPaymentReviewWon,
  type PaymentReviewGoalAchievement,
} from '@/entities/payment-third-review';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  achievements: PaymentReviewGoalAchievement[];
};

// 목표 달성 기록 목록을 렌더링합니다.
export function PaymentThirdReviewGoalAchievementListPage({ achievements }: Props) {
  return (
    <>
      <SiteTopBar
        title="달성 기록"
        backHref="/payment-third-review"
        skipHref="/payment-third-review"
      />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-4 px-5 pb-8 pt-4">
        <section aria-labelledby="goal-achievement-list-title" className="grid gap-3">
          <div>
            <h1
              id="goal-achievement-list-title"
              className="text-[24px] font-semibold leading-8 text-[#1a1c1e]"
            >
              목표 달성 기록
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#72777e]">
              결제 3심으로 목표에 도달한 순간을 모아봐요.
            </p>
          </div>

          <div className="grid gap-2">
            {achievements.map((achievement) => (
              <Link
                key={achievement.id}
                href={`/payment-third-review/goal-achievement/${achievement.id}`}
                className="block rounded-[22px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8f5f1] text-[#2d6a4f]">
                      <Award size={19} strokeWidth={2.1} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold leading-6 text-[#1a1c1e]">
                        {achievement.goalName}
                      </p>
                      <p className="truncate text-xs font-medium leading-5 text-[#72777e]">
                        {achievement.achievedAt} · {formatPaymentReviewWon(achievement.savedAmount)}{' '}
                        저축 반영
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <p className="text-sm font-semibold leading-5 text-[#1a1c1e]">
                      {formatPaymentReviewWon(achievement.achievedAmount)}
                    </p>
                    <ArrowRight
                      size={15}
                      strokeWidth={2.2}
                      className="text-[#72777e]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
