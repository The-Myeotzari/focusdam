import type { PaymentReviewStatus } from '../model/payment-third-review.types';

// 목표 달성을 만든 결제 3심 상태를 사용자에게 보여줄 문구로 변환합니다.
export function getPaymentReviewGoalAchievementTriggerLabel(status: PaymentReviewStatus) {
  if (status.includes('after_save') || status === 'save_completed') {
    return '저축 반영';
  }

  if (status.includes('after_buy') || status.startsWith('buy_')) {
    return '결제 후 반영';
  }

  return '보류 후 반영';
}
