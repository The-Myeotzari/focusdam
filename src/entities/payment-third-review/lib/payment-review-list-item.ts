import type { PaymentThirdReviewListItem } from '@/entities/payment-third-review/api/payment-third-review-list.schema';
import { formatPaymentReviewWon } from '@/entities/payment-third-review/lib/payment-review-amount';
import type { PaymentReviewHistoryRowItem } from '@/entities/payment-third-review/ui/payment-review-history-row';

const impulseStrengthLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
} as const;

// 목록 API의 원본 값을 기존 결제 3심 행이 표시할 수 있는 값으로 변환
export function mapPaymentThirdReviewListItemToHistoryRow(
  item: PaymentThirdReviewListItem,
  now = new Date(),
): PaymentReviewHistoryRowItem {
  return {
    id: item.id,
    itemName: item.itemName,
    date: formatPaymentReviewDate(item.createdAt, now),
    amount: formatPaymentReviewWon(item.amountKrw),
    impulseStrength: impulseStrengthLabels[item.impulseStrength],
    outcomeType: item.outcomeType,
    status: item.status,
    followUpLabel: getPaymentReviewListFollowUpLabel(item, now),
  };
}

function formatPaymentReviewDate(createdAt: string, now: Date) {
  const createdDate = new Date(createdAt);
  const createdDay = new Date(
    createdDate.getFullYear(),
    createdDate.getMonth(),
    createdDate.getDate(),
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayDifference = Math.round((today.getTime() - createdDay.getTime()) / 86_400_000);

  if (dayDifference === 0) {
    return '오늘';
  }

  if (dayDifference === 1) {
    return '어제';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(createdDate);
}

function getPaymentReviewListFollowUpLabel(item: PaymentThirdReviewListItem, now: Date) {
  const followUp = item.followUp;

  if (followUp?.status === 'required') {
    return '지금 진행';
  }

  if (followUp?.status === 'scheduled') {
    const remainingHours = (new Date(followUp.scheduledAt).getTime() - now.getTime()) / 3_600_000;

    if (remainingHours <= 30) {
      return '24시간 뒤';
    }

    if (remainingHours <= 96) {
      return '3일 뒤';
    }
  }

  if (followUp?.type === 'satisfaction' && followUp.satisfactionScore) {
    return `만족도 ${followUp.satisfactionScore}/5`;
  }

  const completedStatusLabels: Partial<Record<PaymentThirdReviewListItem['status'], string>> = {
    buy_satisfaction_completed: '만족도 완료',
    save_completed: '목표 저축',
    hold_after_buy: '보류 후 결제',
    hold_after_save: '보류 후 저축',
    rehold_after_buy: '재보류 후 결제',
    rehold_after_save: '재보류 후 저축',
    rehold_after_hold_scheduled: '추가 보류',
  };

  return completedStatusLabels[item.status] ?? '완료';
}
