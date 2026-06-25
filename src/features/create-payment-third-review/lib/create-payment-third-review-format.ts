import type { PaymentImpulseStrength } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { IMPULSE_STRENGTH_OPTIONS } from '@/features/create-payment-third-review/model/create-payment-third-review.options';

// 숫자 문자열을 원화 표기 문자열로 바꿉니다.
export function formatPaymentAmount(amount: string) {
  return `${Number(amount || 0).toLocaleString('ko-KR')}원`;
}

// 충동 강도 값을 사용자에게 보이는 한글 라벨로 바꿉니다.
export function formatImpulseStrength(value: PaymentImpulseStrength) {
  return IMPULSE_STRENGTH_OPTIONS.find((option) => option.id === value)?.label ?? '높음';
}
