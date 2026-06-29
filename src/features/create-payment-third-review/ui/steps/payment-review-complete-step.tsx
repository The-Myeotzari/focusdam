import type {
  CreatePaymentThirdReviewDraft,
  CreatePaymentThirdReviewDraftUpdater,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { FINAL_DECISION_OPTIONS } from '@/features/create-payment-third-review/model/create-payment-third-review.options';
import { ChoiceCard } from '@/features/create-payment-third-review/ui/create-payment-third-review-cards';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
  updateDraft: CreatePaymentThirdReviewDraftUpdater;
};

// 최종 판단 선택 화면에서 이후 처리 방식을 고르게 합니다.
export function PaymentReviewCompleteStep({ draft, updateDraft }: Props) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        {FINAL_DECISION_OPTIONS.map((choice) => (
          <ChoiceCard
            key={choice.id}
            checked={draft.decision === choice.id}
            title={choice.title}
            description={choice.description}
            onClick={() => updateDraft({ decision: choice.id })}
          />
        ))}
      </div>
    </div>
  );
}
