import type {
  CreatePaymentThirdReviewDraft,
  CreatePaymentThirdReviewDraftUpdater,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { ALTERNATIVE_STATUS_OPTIONS } from '@/features/create-payment-third-review/model/create-payment-third-review.options';
import { ChoiceCard } from '@/features/create-payment-third-review/ui/create-payment-third-review-cards';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
  updateDraft: CreatePaymentThirdReviewDraftUpdater;
};

// 3단계 화면에서 이미 가진 대체재 여부를 선택합니다.
export function PaymentReviewStepThree({ draft, updateDraft }: Props) {
  return (
    <div className="grid gap-3">
      {ALTERNATIVE_STATUS_OPTIONS.map((choice) => (
        <ChoiceCard
          key={choice.id}
          checked={draft.alternativeStatus === choice.id}
          title={choice.title}
          description={choice.description}
          onClick={() => updateDraft({ alternativeStatus: choice.id })}
        />
      ))}
    </div>
  );
}
