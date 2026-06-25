import { SiteInput } from '@/shared/ui/site-input';
import type {
  CreatePaymentThirdReviewDraft,
  CreatePaymentThirdReviewDraftUpdater,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { ImpulseStrengthCard } from '@/features/create-payment-third-review/ui/create-payment-third-review-cards';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
  updateDraft: CreatePaymentThirdReviewDraftUpdater;
};

// 1단계 입력 화면에서 품목, 금액, 충동 강도를 받습니다.
export function PaymentReviewStepOne({ draft, updateDraft }: Props) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-xs font-medium leading-5 text-[#72777e]">품목명</span>
        <SiteInput
          value={draft.itemName}
          onChange={(event) => updateDraft({ itemName: event.target.value })}
          placeholder="예: 무선 이어폰"
          className="!min-h-[64px] !rounded-[24px] !border-transparent !px-5 !text-[20px] !font-semibold !leading-8 !shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-medium leading-5 text-[#72777e]">결제 예정 금액</span>
        <SiteInput
          value={draft.amount}
          onChange={(event) => updateDraft({ amount: event.target.value.replace(/[^0-9]/g, '') })}
          inputMode="numeric"
          placeholder="예: 62000"
          className="!min-h-[64px] !rounded-[24px] !border-transparent !px-5 !text-[24px] !font-semibold !leading-8 !shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
        />
      </label>
      <ImpulseStrengthCard
        value={draft.impulseStrength}
        onChange={(impulseStrength) => updateDraft({ impulseStrength })}
      />
    </div>
  );
}
