import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review/model/payment-third-review.types';

export type PaymentReviewFollowUpMeta = {
  dotClassName: string;
  label: string;
};

const satisfactionStatusMeta = {
  completed: {
    dotClassName: 'bg-[#2d6a4f]',
    label: '만족도 체크 완료',
  },
  required: {
    dotClassName: 'bg-[#d85c49]',
    label: '만족도 체크 필요',
  },
  scheduled: {
    dotClassName: 'bg-[#3c5f7c]',
    label: '만족도 체크 예정',
  },
} satisfies Record<
  NonNullable<PaymentReviewHistoryItem['satisfaction']>['status'],
  PaymentReviewFollowUpMeta
>;

// 결제 3심 후속 처리 유형과 만족도 상태에 맞는 배지 메타를 반환합니다.
export function getPaymentReviewFollowUpMeta(
  item: PaymentReviewHistoryItem,
): PaymentReviewFollowUpMeta {
  if (item.followUpType === 'satisfaction') {
    return satisfactionStatusMeta[item.satisfaction?.status ?? 'scheduled'];
  }

  if (item.followUpType === 'saved') {
    return {
      dotClassName: 'bg-[#2d6a4f]',
      label: '저축 반영',
    };
  }

  return {
    dotClassName: 'bg-[#94640a]',
    label: '리마인드 예정',
  };
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

  return `${item.followUpLabel} 다시 확인해요`;
}
