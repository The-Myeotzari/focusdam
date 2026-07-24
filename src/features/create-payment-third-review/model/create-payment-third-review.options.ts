import type {
  PaymentAlternativeStatus,
  PaymentImpulseStrength,
  PaymentNeedTiming,
  PaymentReviewDecision,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';

export type PaymentReviewOption<TValue extends string> = {
  id: TValue;
  title: string;
  description?: string;
};

export const IMPULSE_STRENGTH_OPTIONS: Array<
  PaymentReviewOption<PaymentImpulseStrength> & { label: string }
> = [
  { id: 'low', label: '낮음', title: '낮음', description: '가볍게 확인' },
  { id: 'medium', label: '보통', title: '보통', description: '조금 더 확인' },
  { id: 'high', label: '높음', title: '높음', description: '천천히 판단' },
];

export const NEED_TIMING_OPTIONS: Array<PaymentReviewOption<PaymentNeedTiming>> = [
  {
    id: 'now',
    title: '지금 꼭 필요',
  },
  {
    id: 'tomorrow',
    title: '애매함',
  },
  {
    id: 'low',
    title: '필요 낮음',
  },
];

export const ALTERNATIVE_STATUS_OPTIONS: Array<PaymentReviewOption<PaymentAlternativeStatus>> = [
  {
    id: 'similar',
    title: '비슷한 물건 있음',
    description: '기존 키보드',
  },
  {
    id: 'replaceable',
    title: '대체 가능',
    description: '회사 장비 사용',
  },
  {
    id: 'none',
    title: '대체 없음',
    description: '다음 단계',
  },
];

export const FINAL_DECISION_OPTIONS: Array<PaymentReviewOption<PaymentReviewDecision>> = [
  {
    id: 'hold',
    title: '24시간 보류',
    description: '리마인드 예약',
  },
  {
    id: 'memo',
    title: '취소하고 목표에 저축',
    description: '저축 금액 기록',
  },
  {
    id: 'buy',
    title: '그래도 결제',
    description: '이유 메모',
  },
];
