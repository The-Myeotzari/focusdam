import {
  CREATE_PAYMENT_THIRD_REVIEW_PROGRESS_STEPS,
  CREATE_PAYMENT_THIRD_REVIEW_STEP_TOTAL,
} from '@/features/create-payment-third-review/model/create-payment-third-review.steps';

type Props = {
  stepIndex: number;
};

// 결제 3심 생성 플로우의 현재 진행 위치를 표시합니다.
export function CreatePaymentThirdReviewProgress({ stepIndex }: Props) {
  return (
    <div className="grid gap-3 pb-6 pt-1">
      <div className="flex items-center justify-between text-xs font-semibold leading-4 text-[#3c5f7c]">
        <span>{CREATE_PAYMENT_THIRD_REVIEW_PROGRESS_STEPS[stepIndex].label}</span>
        <span>
          {stepIndex + 1}/{CREATE_PAYMENT_THIRD_REVIEW_STEP_TOTAL}
        </span>
      </div>
      <ol className="grid grid-cols-5 gap-2" aria-label="결제 3심 생성 진행도">
        {CREATE_PAYMENT_THIRD_REVIEW_PROGRESS_STEPS.map((item, index) => (
          <li key={item.step} className="h-1.5 overflow-hidden rounded-full bg-[#dde3eb]">
            <span
              className={[
                'block h-full rounded-full',
                index <= stepIndex ? 'bg-[#3c5f7c]' : 'bg-transparent',
              ].join(' ')}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
