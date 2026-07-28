import type { PaymentThirdReviewDetail } from '@/entities/payment-third-review/api/payment-third-review-detail.schema';
import { mapPaymentThirdReviewListItemToHistoryRow } from '@/entities/payment-third-review/lib/payment-review-list-item';
import type {
  PaymentReviewHistoryItem,
  PaymentReviewReminderResult,
  PaymentReviewSatisfactionResult,
} from '@/entities/payment-third-review/model/payment-third-review.types';

const decisionLabels = {
  hold: '24시간 보류',
  save: '취소하고 목표에 저축',
  buy: '그래도 결제',
} as const;

const impulseStrengthLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
} as const;

export function mapPaymentThirdReviewDetailToHistoryItem(
  item: PaymentThirdReviewDetail,
  now = new Date(),
): PaymentReviewHistoryItem {
  const latestFollowUp = item.followUps[0] ?? null;
  const listItem = mapPaymentThirdReviewListItemToHistoryRow(
    {
      id: item.id,
      itemName: item.itemName,
      amountKrw: item.amountKrw,
      impulseStrength: item.impulseStrength,
      outcomeType: item.outcomeType,
      status: item.status,
      createdAt: item.createdAt,
      followUp: latestFollowUp,
    },
    now,
  );
  const satisfactionFollowUp = item.followUps.find(
    (followUp) => followUp.type === 'satisfaction' && followUp.status !== 'canceled',
  );
  const reminderFollowUp = item.followUps.find(
    (followUp) => followUp.type === 'reminder' && followUp.status !== 'canceled',
  );
  const followUpType = getFollowUpType(item);

  return {
    ...listItem,
    impulseStrength: impulseStrengthLabels[item.impulseStrength],
    decision: decisionLabels[item.initialDecision],
    decisionType: item.initialDecision,
    reason: item.reason ?? item.buyReason ?? '입력된 판단 이유가 없어요',
    followUpType,
    progressLabel: getGoalProgressLabel(item),
    savedAmount: item.outcomeType === 'save' ? item.amountKrw : undefined,
    budgetImpactLabel: getBudgetImpactLabel(item),
    satisfaction: satisfactionFollowUp
      ? {
          status: getActiveFollowUpStatus(satisfactionFollowUp.status),
          result: getSatisfactionResult(satisfactionFollowUp),
        }
      : undefined,
    reminder: reminderFollowUp
      ? {
          reminderCount: reminderFollowUp.sequence,
          status: getActiveFollowUpStatus(reminderFollowUp.status),
          result: getReminderResult(reminderFollowUp),
        }
      : undefined,
  };
}

function getFollowUpType(
  item: PaymentThirdReviewDetail,
): PaymentReviewHistoryItem['followUpType'] {
  if (item.status === 'save_completed') {
    return 'saved';
  }

  if (item.status.startsWith('hold_') || item.status.startsWith('rehold_')) {
    return 'reminder';
  }

  return 'satisfaction';
}

function getGoalProgressLabel(item: PaymentThirdReviewDetail) {
  if (!item.goal) {
    return '연결된 목표 없음';
  }

  const progress = Math.min(
    100,
    Math.round((item.goal.currentSavedAmountKrw / item.goal.targetAmountKrw) * 100),
  );

  return `${item.goal.name} ${progress}%`;
}

function getBudgetImpactLabel(item: PaymentThirdReviewDetail) {
  if (item.outcomeType === 'buy') {
    return '이번 달 소비에 기록';
  }

  if (item.outcomeType === 'save') {
    return `${item.amountKrw.toLocaleString('ko-KR')}원 절약`;
  }

  return item.status.startsWith('rehold_') ? '재보류 중' : '결제 보류 중';
}

function getActiveFollowUpStatus(status: 'scheduled' | 'required' | 'completed' | 'canceled') {
  if (status === 'required' || status === 'completed') {
    return status;
  }

  return 'scheduled';
}

function getSatisfactionResult(
  followUp: PaymentThirdReviewDetail['followUps'][number],
): PaymentReviewSatisfactionResult | undefined {
  if (
    followUp.status !== 'completed' ||
    !followUp.completedAt ||
    followUp.satisfactionScore === null
  ) {
    return undefined;
  }

  return {
    checkedAt: formatDetailDate(followUp.completedAt),
    memo: followUp.memo ?? '작성된 회고 메모가 없어요',
    score: followUp.satisfactionScore,
    summary: followUp.summary ?? getSatisfactionSummary(followUp.satisfactionScore),
  };
}

function getReminderResult(
  followUp: PaymentThirdReviewDetail['followUps'][number],
): PaymentReviewReminderResult | undefined {
  if (
    followUp.status !== 'completed' ||
    !followUp.completedAt ||
    !followUp.reminderDecision
  ) {
    return undefined;
  }

  return {
    completedType: followUp.sequence > 1 ? 'after-rehold' : 'after-first-hold',
    decision: followUp.reminderDecision,
    memo: followUp.memo ?? '작성된 메모가 없어요',
    submittedAt: formatDetailDate(followUp.completedAt),
  };
}

function getSatisfactionSummary(score: number) {
  if (score >= 4) {
    return '만족';
  }

  if (score === 3) {
    return '보통';
  }

  return '아쉬움';
}

function formatDetailDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}
