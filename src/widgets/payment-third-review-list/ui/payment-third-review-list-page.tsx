import {
  PAYMENT_REVIEW_HISTORY_ITEMS,
  PaymentReviewHistoryRow,
} from '@/entities/payment-third-review';
import { SiteTopBar } from '@/shared/ui';

export function PaymentThirdReviewListPage() {
  return (
    <>
      <SiteTopBar title="결제 3심 내역" backHref="/payment-third-review" skipHref="/payment-third-review" />
      <main className="flex flex-col gap-4 px-5 pb-8 pt-4">
        <section aria-labelledby="payment-third-review-list-title" className="grid gap-3">
          <div>
            <h1
              id="payment-third-review-list-title"
              className="text-[24px] font-semibold leading-8 text-[#1a1c1e]"
            >
              진행한 결제 3심
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#72777e]">
              최근 진행한 결제 3심 내역을 확인해요.
            </p>
          </div>

          <div className="grid gap-2">
            {PAYMENT_REVIEW_HISTORY_ITEMS.map((item) => (
              <PaymentReviewHistoryRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
