import { CheckCircle2, ClipboardList, Clock3, Keyboard, PencilLine, Scale } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export type CreatePaymentThirdReviewStep = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'complete';

export type CreatePaymentThirdReviewStepConfig = {
  step: CreatePaymentThirdReviewStep;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  previousHref: string;
  nextHref: string;
  nextLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export const CREATE_PAYMENT_THIRD_REVIEW_STEPS: CreatePaymentThirdReviewStepConfig[] = [
  {
    step: 'step-1',
    label: '입력',
    title: '결제 전\n30초만 멈춰볼까요?',
    description: '상품명과 금액만 입력하면 3단계로 판단을 도와드립니다.',
    icon: Keyboard,
    previousHref: '/payment-third-review',
    nextHref: '/payment-third-review/create/step-2',
    nextLabel: '결제 3심 시작',
    secondaryHref: '/payment-third-review',
    secondaryLabel: '뒤로가기',
  },
  {
    step: 'step-2',
    label: '1심',
    title: '24시간 뒤에도\n필요할까요?',
    description: '지금의 강한 욕구와 실제 필요를 분리해보는 단계입니다.',
    icon: Clock3,
    previousHref: '/payment-third-review/create/step-1',
    nextHref: '/payment-third-review/create/step-3',
    nextLabel: '2심으로 이동',
    secondaryHref: '/payment-third-review/list',
    secondaryLabel: '24시간 보류',
  },
  {
    step: 'step-3',
    label: '2심',
    title: '이미 비슷한 것이\n있나요?',
    description: '집에 있거나 이미 구독 중인 대체재를 짧게 확인합니다.',
    icon: PencilLine,
    previousHref: '/payment-third-review/create/step-2',
    nextHref: '/payment-third-review/create/step-4',
    nextLabel: '3심으로 이동',
    secondaryHref: '/payment-third-review/list',
    secondaryLabel: '보류하기',
  },
  {
    step: 'step-4',
    label: '3심',
    title: '목표 금액과\n바꿀 가치가 있나요?',
    description: '이번 결제가 목표와 예산에 어떤 영향을 주는지 보여줍니다.',
    icon: Scale,
    previousHref: '/payment-third-review/create/step-3',
    nextHref: '/payment-third-review/create/complete',
    nextLabel: '결정하기',
    secondaryHref: '/payment-third-review/list',
    secondaryLabel: '목표에 더하기',
  },
  {
    step: 'complete',
    label: '최종',
    title: '어떻게 할까요?',
    description: '결제는 금지가 아니라 선택을 늦추고 명확히 하는 과정입니다.',
    icon: CheckCircle2,
    previousHref: '/payment-third-review/create/step-4',
    nextHref: '/payment-third-review/list',
    nextLabel: '제출하기',
    secondaryHref: '/payment-third-review/create/step-4',
    secondaryLabel: '이전',
  },
];

export const CREATE_PAYMENT_THIRD_REVIEW_STEP_TOTAL = CREATE_PAYMENT_THIRD_REVIEW_STEPS.length;

// URL에서 받은 스텝 값에 대응하는 화면 설정을 반환합니다.
export function getCreatePaymentThirdReviewStepConfig(step: CreatePaymentThirdReviewStep) {
  return (
    CREATE_PAYMENT_THIRD_REVIEW_STEPS.find((item) => item.step === step) ??
    CREATE_PAYMENT_THIRD_REVIEW_STEPS[0]
  );
}

export const COMPLETE_REPORT_ICON = ClipboardList;
