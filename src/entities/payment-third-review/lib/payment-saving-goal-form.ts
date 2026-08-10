import {
  SavePaymentSavingGoalRequestSchema,
  type SavePaymentSavingGoalRequest,
} from '@/entities/payment-third-review/api/payment-saving-goal.schema';
import { parsePaymentReviewWon } from '@/entities/payment-third-review/lib/payment-review-amount';

export type PaymentSavingGoalFormErrors = {
  amount?: string;
  name?: string;
};

type PaymentSavingGoalFormValidation = {
  data: SavePaymentSavingGoalRequest | null;
  errors: PaymentSavingGoalFormErrors;
};

// 목표 생성 팝업과 수정 페이지가 동일한 필드 검증 규칙을 사용하도록 변환과 오류 매핑을 담당합니다.
export function validatePaymentSavingGoalForm(
  name: string,
  amount: string,
): PaymentSavingGoalFormValidation {
  const result = SavePaymentSavingGoalRequestSchema.safeParse({
    name,
    targetAmountKrw: parsePaymentReviewWon(amount),
  });
  const errors: PaymentSavingGoalFormErrors = {};

  if (!amount.trim()) {
    errors.amount = '목표 금액을 입력해주세요.';
  }

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (field === 'name' && !errors.name) {
        errors.name = issue.message;
      }

      if (field === 'targetAmountKrw' && !errors.amount) {
        errors.amount = issue.message;
      }
    }
  }

  return {
    data: result.success && Object.keys(errors).length === 0 ? result.data : null,
    errors,
  };
}
