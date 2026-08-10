import { ApiRequestError } from '@/shared/lib/api/api';

export type PaymentThirdReviewSubmitAction =
  | 'create'
  | 'goal'
  | 'reminder'
  | 'satisfaction';

const fallbackMessages: Record<PaymentThirdReviewSubmitAction, string> = {
  create: '결제 3심 기록을 저장하지 못했어요. 잠시 후 다시 시도해주세요.',
  goal: '목표를 저장하지 못했어요. 잠시 후 다시 시도해주세요.',
  reminder: '리마인드 판단을 저장하지 못했어요. 잠시 후 다시 시도해주세요.',
  satisfaction: '만족도 체크를 저장하지 못했어요. 잠시 후 다시 시도해주세요.',
};

export function getPaymentThirdReviewSubmitErrorMessage(
  error: unknown,
  action: PaymentThirdReviewSubmitAction,
) {
  const fallbackMessage = fallbackMessages[action];

  if (!(error instanceof ApiRequestError)) {
    return error ? fallbackMessage : null;
  }

  if (error.body.status === 401) {
    return '로그인이 만료됐어요. 다시 로그인한 뒤 시도해주세요.';
  }

  if (error.body.status === 403) {
    return '이 작업을 처리할 권한이 없어요.';
  }

  if (error.body.status === 409) {
    return `${error.body.detail} 최신 상태를 다시 확인해주세요.`;
  }

  if ([400, 404, 422].includes(error.body.status)) {
    return error.body.detail;
  }

  if (error.body.status === 429) {
    return '요청이 많아요. 잠시 기다린 뒤 다시 시도해주세요.';
  }

  if (error.body.status >= 500) {
    return fallbackMessage;
  }

  return error.body.detail || fallbackMessage;
}
