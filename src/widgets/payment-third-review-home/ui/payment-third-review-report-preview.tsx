import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';
import { PaymentReviewHistoryRow } from '@/entities/payment-third-review';
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
          className="!min-h-9 !rounded-full !bg-transparent !px-1 !text-xs !font-semibold !text-[#72777e] !shadow-none"
        >
          더보기
        </SiteButton>
      </div>

      <div className="grid gap-2">
        {items.slice(0, 3).map((item) => (
          <PaymentReviewHistoryRow
            key={item.id}
            href={`/payment-third-review/list/${item.id}`}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}
