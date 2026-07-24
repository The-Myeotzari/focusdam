import {
  PaymentReviewHistoryRow,
  type PaymentReviewHistoryRowItem,
} from '@/entities/payment-third-review';
import { SiteButton } from '@/shared/ui';

type Props = {
  items: PaymentReviewHistoryRowItem[];
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

      {items.length === 0 ? (
        <div className="rounded-[24px] bg-white px-5 py-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[15px] font-semibold leading-6 text-[#1a1c1e]">
            아직 결제 3심 내역이 없어요
          </p>
          <p className="mt-1 text-sm leading-6 text-[#72777e]">
            결제 전 한 번 더 점검하면 최근 기록이 여기에 표시돼요.
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {items.slice(0, 3).map((item) => (
            <PaymentReviewHistoryRow
              key={item.id}
              href={`/payment-third-review/list/${item.id}`}
              item={item}
            />
          ))}
        </div>
      )}
    </section>
  );
}
