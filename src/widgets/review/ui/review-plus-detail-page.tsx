import { CheckCircle2, Target } from 'lucide-react';

import {
  WEEKLY_REVIEW_DETAIL_ICONS,
  WEEKLY_REVIEW_RECOMMENDATION_ICONS,
  type WeeklyReview,
} from '@/entities/review';
import { SiteButton, SiteTopBar } from '@/shared/ui';

import { getInsightAccentClassName, getMetricToneClassName } from './review-tone';

type Props = {
  review: WeeklyReview;
};

export function ReviewPlusDetailPage({ review }: Props) {
  return (
    <>
      <SiteTopBar
        title="주간 리포트"
        backHref="/review"
        skipHref="#recommendation"
        skipLabel="추천"
      />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <p className="w-fit rounded-full bg-[#e8eef3] px-4 py-1.5 text-sm font-medium leading-5 text-[#3c5f7c]">
          {review.weekLabel}
        </p>

        {review.insights.map((insight, index) => {
          const accent = getInsightAccentClassName(insight.accent);
          const Icon = WEEKLY_REVIEW_DETAIL_ICONS[index];

          return (
            <section
              key={insight.id}
              aria-labelledby={`review-insight-${insight.id}`}
              className={`rounded-[32px] px-5 py-6 shadow-[var(--shadow-card)] ${accent.section}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className={`mt-2 w-fit rounded-full px-4 py-1.5 text-sm font-medium leading-5 ${accent.badge}`}
                  >
                    {insight.badge}
                  </p>
                  <h2
                    id={`review-insight-${insight.id}`}
                    className="mt-4 text-[25px] font-semibold leading-9 text-[var(--color-on-surface)]"
                  >
                    {insight.title}
                  </h2>
                </div>
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-full ${accent.icon}`}
                  aria-hidden="true"
                >
                  <Icon size={23} strokeWidth={1.9} />
                </span>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-[var(--color-on-surface-variant)]">
                {insight.description}
              </p>
              <div className="mt-6 grid overflow-hidden rounded-[24px] bg-white/70">
                {insight.sections.map((section) => (
                  <section
                    key={section.id}
                    aria-label={section.subject}
                    className="grid gap-1 border-b border-white/80 px-4 py-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-sm font-semibold leading-6 text-[var(--color-on-surface)]">
                        {section.subject}
                      </h3>
                      <strong className="shrink-0 text-right text-[18px] font-semibold leading-7 text-[#3c5f7c]">
                        {section.value}
                      </strong>
                    </div>
                    <p className="text-xs font-medium leading-5 text-[var(--color-on-surface-variant)]">
                      {section.description}
                    </p>
                  </section>
                ))}
              </div>
            </section>
          );
        })}

        <section
          aria-labelledby="review-goal-title"
          className="rounded-[32px] bg-[#e8f5f1] px-5 py-6"
        >
          <p className="w-fit rounded-full bg-white/60 px-3 py-1 text-xs font-semibold leading-5 text-[#2d6a4f]">
            목표 달성
          </p>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h2
                id="review-goal-title"
                className="text-[24px] font-semibold leading-8 text-[var(--color-on-surface)]"
              >
                {review.goal.title}
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-[var(--color-on-surface-variant)]">
                {review.goal.description}
              </p>
            </div>
            <span
              className="grid size-12 shrink-0 place-items-center rounded-full bg-white/70 text-[#2d6a4f]"
              aria-hidden="true"
            >
              <Target size={23} strokeWidth={1.9} />
            </span>
          </div>
          <div className="mt-5 rounded-[22px] bg-white/75 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold leading-6 text-[var(--color-on-surface)]">
                10분 착수
              </span>
              <strong className="text-sm font-semibold leading-6 text-[#3c5f7c]">
                {review.goal.progressLabel}
              </strong>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#d5e9e1]">
              <span className="block h-full w-full rounded-full bg-[#2d6a4f]" />
            </div>
          </div>
        </section>

        <section
          id="recommendation"
          aria-labelledby="review-recommendation-title"
          className="rounded-[32px] bg-[var(--color-surface-container-low)] px-5 py-6"
        >
          <p className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold leading-5 text-[#3c5f7c]">
            개인화 추천
          </p>
          <h2
            id="review-recommendation-title"
            className="mt-4 text-[24px] font-semibold leading-8 text-[var(--color-on-surface)]"
          >
            {review.recommendation.title}
          </h2>
          <p className="mt-3 text-sm font-medium leading-6 text-[var(--color-on-surface-variant)]">
            {review.recommendation.description}
          </p>
          <div className="mt-5 grid gap-3">
            {review.recommendation.actions.map((action, index) => {
              const Icon = WEEKLY_REVIEW_RECOMMENDATION_ICONS[index];

              return (
                <article
                  key={action.id}
                  className="flex min-h-[92px] items-start gap-4 rounded-[24px] bg-white px-5 py-4 shadow-[var(--shadow-card)]"
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${getMetricToneClassName(action.tone)}`}
                    aria-hidden="true"
                  >
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-5 text-[var(--color-outline)]">
                      {action.label}
                    </p>
                    <h3 className="text-[19px] font-semibold leading-7 text-[#3c5f7c]">
                      {action.value}
                    </h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-[var(--color-on-surface-variant)]">
                      {action.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="grid gap-3">
          <SiteButton href="/review" className="w-full gap-2">
            추천 적용
            <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" />
          </SiteButton>
          <SiteButton href="/review/list" variant="secondary" className="w-full">
            목록으로 돌아가기
          </SiteButton>
        </div>
      </main>
    </>
  );
}
