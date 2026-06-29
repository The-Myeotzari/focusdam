import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review/model/payment-third-review.types';

export type PaymentReviewFollowUpMeta = {
  dotClassName: string;
  label: string;
};

const paymentReviewStatusMeta = {
  buy_satisfaction_completed: {
    dotClassName: 'bg-[#2d6a4f]',
    label: '만족도 체크 완료',
  },
  buy_satisfaction_required: {
    dotClassName: 'bg-[#d85c49]',
    label: '만족도 체크 필요',
  },
  buy_satisfaction_scheduled: {
    dotClassName: 'bg-[#3c5f7c]',
    label: '만족도 체크 예정',
  },
  hold_after_buy: {
    dotClassName: 'bg-[#3c5f7c]',
    label: '보류 후 결제',
  },
  hold_after_hold_scheduled: {
    dotClassName: 'bg-[#94640a]',
    label: '재보류 예정',
  },
  hold_after_save: {
    dotClassName: 'bg-[#2d6a4f]',
    label: '보류 후 저축',
  },
  hold_reminder_required: {
    dotClassName: 'bg-[#d85c49]',
    label: '리마인드 필요',
  },
  hold_reminder_scheduled: {
    dotClassName: 'bg-[#94640a]',
    label: '리마인드 예정',
  },
  rehold_after_buy: {
    dotClassName: 'bg-[#3c5f7c]',
    label: '재보류 후 결제',
  },
  rehold_after_hold_scheduled: {
    dotClassName: 'bg-[#94640a]',
    label: '추가 보류 예정',
  },
  rehold_after_save: {
    dotClassName: 'bg-[#2d6a4f]',
    label: '재보류 후 저축',
  },
  rehold_reminder_required: {
    dotClassName: 'bg-[#d85c49]',
    label: '재보류 판단 필요',
  },
  rehold_reminder_scheduled: {
    dotClassName: 'bg-[#94640a]',
    label: '재보류 리마인드 예정',
  },
  save_completed: {
    dotClassName: 'bg-[#2d6a4f]',
    label: '저축 완료',
  },
} satisfies Record<PaymentReviewHistoryItem['status'], PaymentReviewFollowUpMeta>;

// 결제 3심 세부 상태에 맞는 배지 메타를 반환합니다.
export function getPaymentReviewFollowUpMeta(
  item: PaymentReviewHistoryItem,
): PaymentReviewFollowUpMeta {
  return paymentReviewStatusMeta[item.status];
}

// 후속 처리 유형에 맞는 상세 제목을 반환합니다.
export function getPaymentReviewFollowUpTitle(
  followUpType: PaymentReviewHistoryItem['followUpType'],
) {
  if (followUpType === 'satisfaction') {
    return '만족도 체크';
  }

  if (followUpType === 'saved') {
    return '저축 반영';
  }

  return '리마인드';
}

// 후속 처리 유형과 만족도 상태에 맞는 상세 문장을 반환합니다.
export function getPaymentReviewFollowUpDescription(item: PaymentReviewHistoryItem) {
  const statusDescription = getPaymentReviewStatusDescription(item);

  if (statusDescription) {
    return statusDescription;
  }

  if (item.followUpType === 'satisfaction') {
    if (item.satisfaction?.status === 'required') {
      return '결제 후 24시간이 지나 만족도 체크가 필요해요';
    }

    if (item.satisfaction?.status === 'completed') {
      return '만족도 체크를 완료했어요';
    }

    return `${item.followUpLabel} 만족도를 확인해요`;
  }

  if (item.followUpType === 'saved') {
    return `${item.followUpLabel}으로 이동했어요`;
  }

  if (item.reminder?.status === 'required') {
    return '24시간이 지나 다시 결정할 차례예요';
  }

  if (item.reminder?.status === 'completed') {
    if (item.reminder.result?.completedType === 'after-rehold') {
      return '재보류 이후 리마인드 결정을 완료했어요';
    }

    return '리마인드 결정을 완료했어요';
  }

  return `${item.followUpLabel} 다시 확인해요`;
}

// 결제 3심 세부 상태에 맞는 상세 문장을 반환합니다.
function getPaymentReviewStatusDescription(item: PaymentReviewHistoryItem) {
  if (item.status === 'hold_after_buy') {
    return '24시간 보류 후 결제를 진행했어요';
  }

  if (item.status === 'hold_after_save') {
    return '24시간 보류 후 결제하지 않고 저축으로 돌렸어요';
  }

  if (item.status === 'hold_after_hold_scheduled') {
    return '24시간 보류 후 다시 보류해 3일 뒤 재확인해요';
  }

  if (item.status === 'rehold_after_buy') {
    return '재보류 이후 결제를 진행했어요';
  }

  if (item.status === 'rehold_after_save') {
    return '재보류 이후 결제하지 않고 저축으로 돌렸어요';
  }

  if (item.status === 'rehold_after_hold_scheduled') {
    return '재보류 이후에도 결정하지 않고 추가 보류했어요';
  }

  if (item.status === 'rehold_reminder_required') {
    return '재보류 후 3일이 지나 다시 판단할 차례예요';
  }

  if (item.status === 'rehold_reminder_scheduled') {
    return `${item.followUpLabel} 재보류 항목을 다시 확인해요`;
  }

  return '';
}
