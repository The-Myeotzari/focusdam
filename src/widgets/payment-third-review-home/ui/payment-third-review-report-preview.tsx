import { ArrowRight } from 'lucide-react';

import { PaymentReviewHistoryRow } from '@/entities/payment-third-review';
import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';
import { SiteButton } from '@/shared/ui';

type Props = {
  items: PaymentReviewHistoryItem[];
};

export function PaymentThirdReviewReportPreview({ items }: Props) {
  return (
    <section id="report-preview" aria-labelledby="report-preview-title" className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 id="report-preview-title" className="text-lg font-semibold leading-7 text-[#1a1c1e]">
          최근 결제 3심
        </h2>
        <SiteButton
          href="/payment-third-review/list"
          variant="secondary"
          className="!min-h-9 !rounded-full !px-4 !text-xs !font-semibold"
        >
          더보기
          <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
        </SiteButton>
      </div>

      <div className="grid gap-2">
        {items.slice(0, 5).map((item) => (
          <PaymentReviewHistoryRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
