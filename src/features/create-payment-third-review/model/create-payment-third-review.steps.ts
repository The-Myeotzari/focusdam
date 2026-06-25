import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Keyboard,
  PencilLine,
  PiggyBank,
  ReceiptText,
  Scale,
  SmilePlus,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import type { PaymentReviewDecision } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';

export type CreatePaymentThirdReviewStep =
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'step-4'
  | 'complete'
  | 'save'
  | 'buy'
  | 'satisfaction-check'
  | 'report';

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
  showHero?: boolean;
  showProgress?: boolean;
  submitOnNext?: boolean;
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
    nextLabel: '다음',
    secondaryHref: '/payment-third-review/create/step-4',
    secondaryLabel: '이전',
  },
  {
    step: 'save',
    label: '목표 저축 반영',
    title: '아낀 금액을\n어디에 둘까요?',
    description: '보류 성공을 목표, 자기보상, 제휴 혜택으로 연결합니다.',
    icon: PiggyBank,
    previousHref: '/payment-third-review/create/complete',
    nextHref: '/payment-third-review/create/report',
    nextLabel: '리포트 보기',
    secondaryHref: '/payment-third-review/create/complete',
    secondaryLabel: '이전',
    showHero: false,
    showProgress: false,
  },
  {
    step: 'buy',
    label: '결제 이유',
    title: '결제 이유를\n짧게 남길까요?',
    description: '필요한 소비라면 기록하고 후회 방지 회고만 예약합니다.',
    icon: ReceiptText,
    previousHref: '/payment-third-review/create/complete',
    nextHref: '/payment-third-review/create/satisfaction-check',
    nextLabel: '만족도 체크 예약',
    secondaryHref: '/payment-third-review/create/complete',
    secondaryLabel: '이전',
    showHero: false,
    showProgress: false,
  },
  {
    step: 'satisfaction-check',
    label: '만족도 체크',
    title: '24시간 뒤\n만족도를 확인해요',
    description: '결제 직후의 확신이 하루 뒤에도 유지되는지 확인합니다.',
    icon: SmilePlus,
    previousHref: '/payment-third-review/create/buy',
    nextHref: '/payment-third-review/create/report',
    nextLabel: '리포트 보기',
    secondaryHref: '/payment-third-review/create/buy',
    secondaryLabel: '이전',
    showHero: false,
    showProgress: false,
  },
  {
    step: 'report',
    label: '리포트',
    title: '결제 3심 리포트',
    description: '방금 남긴 판단을 저장하기 전에 한 번 더 확인해요.',
    icon: ClipboardList,
    previousHref: '/payment-third-review/create/complete',
    nextHref: '/payment-third-review/list',
    nextLabel: '제출하기',
    secondaryHref: '/payment-third-review/create/complete',
    secondaryLabel: '이전',
    showHero: false,
    showProgress: false,
    submitOnNext: true,
  },
];

export const CREATE_PAYMENT_THIRD_REVIEW_PROGRESS_STEPS = CREATE_PAYMENT_THIRD_REVIEW_STEPS.filter(
  (item) => item.showProgress !== false,
);

export const CREATE_PAYMENT_THIRD_REVIEW_STEP_TOTAL =
  CREATE_PAYMENT_THIRD_REVIEW_PROGRESS_STEPS.length;

const PAYMENT_REVIEW_DECISION_NEXT_HREFS: Record<PaymentReviewDecision, string> = {
  hold: '/payment-third-review/create/report',
  memo: '/payment-third-review/create/save',
  buy: '/payment-third-review/create/buy',
};

const PAYMENT_REVIEW_REPORT_PREVIOUS_HREFS: Record<PaymentReviewDecision, string> = {
  hold: '/payment-third-review/create/complete',
  memo: '/payment-third-review/create/save',
  buy: '/payment-third-review/create/satisfaction-check',
};

// URL에서 받은 스텝 값에 대응하는 화면 설정을 반환합니다.
export function getCreatePaymentThirdReviewStepConfig(step: CreatePaymentThirdReviewStep) {
  return (
    CREATE_PAYMENT_THIRD_REVIEW_STEPS.find((item) => item.step === step) ??
    CREATE_PAYMENT_THIRD_REVIEW_STEPS[0]
  );
}

// 최종 판단 선택값에 맞는 후속 화면 경로를 반환합니다.
export function getPaymentReviewDecisionHref(decision: PaymentReviewDecision) {
  return PAYMENT_REVIEW_DECISION_NEXT_HREFS[decision];
}

// 최종 리포트에서 이전 버튼이 돌아갈 판단별 화면 경로를 반환합니다.
export function getPaymentReviewReportPreviousHref(decision: PaymentReviewDecision) {
  return PAYMENT_REVIEW_REPORT_PREVIOUS_HREFS[decision];
}
