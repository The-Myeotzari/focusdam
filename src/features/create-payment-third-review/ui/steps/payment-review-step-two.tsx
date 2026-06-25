import type {
  CreatePaymentThirdReviewDraft,
  CreatePaymentThirdReviewDraftUpdater,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { NEED_TIMING_OPTIONS } from '@/features/create-payment-third-review/model/create-payment-third-review.options';
import { ChoiceCard } from '@/features/create-payment-third-review/ui/create-payment-third-review-cards';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
  updateDraft: CreatePaymentThirdReviewDraftUpdater;
};

// 2단계 화면에서 24시간 뒤에도 필요한지 선택합니다.
export function PaymentReviewStepTwo({ draft, updateDraft }: Props) {
  return (
    <div className="grid gap-3">
      {NEED_TIMING_OPTIONS.map((choice) => (
        <ChoiceCard
          key={choice.id}
          checked={draft.needTiming === choice.id}
          title={choice.title}
          description={choice.description}
          onClick={() => updateDraft({ needTiming: choice.id })}
        />
      ))}
    </div>
  );
}
