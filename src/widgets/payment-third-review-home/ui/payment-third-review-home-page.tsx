import { PAYMENT_REVIEW_HISTORY_ITEMS } from '@/entities/payment-third-review';
import { SiteTopBar } from '@/shared/ui';
import {
  PAYMENT_REVIEW_OVERVIEW,
  SUMMARY_CARDS,
} from '@/widgets/payment-third-review-home/model/payment-third-review-home.constants';
import { PaymentThirdReviewGoalSummary } from '@/widgets/payment-third-review-home/ui/payment-third-review-goal-summary';
import { PaymentThirdReviewHero } from '@/widgets/payment-third-review-home/ui/payment-third-review-hero';
import { PaymentThirdReviewReportPreview } from '@/widgets/payment-third-review-home/ui/payment-third-review-report-preview';

export function PaymentThirdReviewHomePage() {
  return (
    <>
      <SiteTopBar title="결제 3심" backHref="/" skipHref="#report-preview" />
      <main className="flex flex-col gap-5 px-5 pb-8 pt-4">
        <PaymentThirdReviewHero />
        <PaymentThirdReviewGoalSummary
          goalSettingHref="/payment-third-review/goal-setting"
          items={SUMMARY_CARDS}
          overview={PAYMENT_REVIEW_OVERVIEW}
        />
        <PaymentThirdReviewReportPreview items={PAYMENT_REVIEW_HISTORY_ITEMS} />
      </main>
    </>
  );
}
