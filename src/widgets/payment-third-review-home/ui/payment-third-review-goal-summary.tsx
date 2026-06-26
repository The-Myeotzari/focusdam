import { ArrowRight, Flag } from 'lucide-react';

import { SiteButton } from '@/shared/ui';
import type {
  PaymentReviewOverview,
  SummaryCard,
} from '@/widgets/payment-third-review-home/model/payment-third-review-home.types';

type Props = {
  goalSettingHref: string;
  items: SummaryCard[];
  overview: PaymentReviewOverview;
};

export function PaymentThirdReviewGoalSummary({ goalSettingHref, items, overview }: Props) {
  return (
    <section aria-labelledby="spend-summary-title" className="grid gap-3">
      <h2 id="spend-summary-title" className="text-lg font-semibold leading-7 text-[#1a1c1e]">
        소비 요약
      </h2>

      <article className="flex items-center justify-between gap-4 rounded-[24px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e0f1ff] text-[#3c5f7c]">
            <Flag size={19} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium leading-5 text-[#72777e]">목표 금액</p>
            <p className="text-[24px] font-semibold leading-8 text-[#1a1c1e]">
              {overview.goalAmount}
            </p>
          </div>
        </div>
        <SiteButton
          href={goalSettingHref}
          variant="secondary"
          className="!min-h-10 !shrink-0 !gap-1.5 !rounded-full !px-4 !text-xs !font-semibold"
        >
          설정하기
          <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
        </SiteButton>
      </article>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex min-h-[156px] flex-col rounded-[24px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <span className={`grid size-9 place-items-center rounded-full ${item.tone}`}>
                <Icon size={18} strokeWidth={2.1} aria-hidden="true" />
              </span>
              <p className="mt-3 text-xs font-medium leading-5 text-[#72777e]">{item.title}</p>
              {item.value ? (
                <p className="text-[22px] font-semibold leading-8 text-[#1a1c1e]">{item.value}</p>
              ) : null}
              <p className="mt-1 text-xs leading-5 text-[#72777e]">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
