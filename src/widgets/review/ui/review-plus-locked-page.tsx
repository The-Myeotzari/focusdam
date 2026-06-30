import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import type { WeeklyReview } from '@/entities/review';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  review: WeeklyReview;
};

export function ReviewPlusLockedPage({ review }: Props) {
  return (
    <>
      <SiteTopBar title="Plus 리포트 안내" backHref="/review" skipHref="/review" skipLabel="무료" />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <section
          aria-labelledby="review-plus-locked-title"
          className="overflow-hidden rounded-[32px] bg-[#ffd9aa] px-6 py-7 shadow-[0_20px_60px_rgba(60,95,124,0.08)]"
        >
          <span
            className="grid size-12 place-items-center rounded-full bg-white/45 text-[#785526]"
            aria-hidden="true"
          >
            <Sparkles size={24} strokeWidth={1.9} />
          </span>
          <h1
            id="review-plus-locked-title"
            className="mt-5 text-[26px] font-semibold leading-9 text-[#2a1800]"
          >
            더 자세한 패턴은 Plus에서 볼 수 있어요
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-[#6d4a1d]">
            무료 리포트는 유지하고, 개인화 분석을 확장합니다.
          </p>
        </section>

        <section className="grid gap-3" aria-labelledby="review-plus-features">
          <h2
            id="review-plus-features"
            className="text-lg font-semibold leading-7 text-[var(--color-on-surface)]"
          >
            Plus에서 열리는 기능
          </h2>
          <div className="grid gap-3">
            {review.plusFeatures.map((feature) => (
              <article
                key={feature.id}
                className="flex min-h-[86px] items-center gap-4 rounded-[24px] bg-white px-5 py-4 shadow-[var(--shadow-card)]"
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fff2e0] text-[#b07d05]"
                  aria-hidden="true"
                >
                  <feature.icon size={20} strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold leading-6 text-[var(--color-on-surface)]">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium leading-5 text-[var(--color-on-surface-variant)]">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-auto grid gap-3">
          <Link href="/settings/plus" className="site-button site-button--primary w-full gap-2">
            Plus 보기
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
          <Link href="/review" className="site-button site-button--secondary w-full">
            무료로 계속
          </Link>
        </div>
      </main>
    </>
  );
}
