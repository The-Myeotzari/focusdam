import type { WeeklyReviewListItem } from '@/entities/review';
import { SiteTopBar } from '@/shared/ui';

import { ReviewList } from './review-list';

type Props = {
  items: WeeklyReviewListItem[];
};

export function ReviewListPage({ items }: Props) {
  return (
    <>
      <SiteTopBar title="리포트 목록" backHref="/review" skipHref="/review/plus" skipLabel="Plus" />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <section aria-labelledby="review-list-title">
          <h1
            id="review-list-title"
            className="text-[24px] font-semibold leading-8 text-[var(--color-on-surface)]"
          >
            주간 리포트
          </h1>
          <p className="mt-1 text-sm font-medium leading-6 text-[var(--color-on-surface-variant)]">
            지난 리포트를 모아서 확인해요.
          </p>
        </section>

        <ReviewList items={items} />
      </main>
    </>
  );
}
