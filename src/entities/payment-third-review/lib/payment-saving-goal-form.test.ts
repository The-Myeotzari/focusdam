import { describe, expect, it } from 'vitest';

import { validatePaymentSavingGoalForm } from './payment-saving-goal-form';

describe('validatePaymentSavingGoalForm', () => {
  it('목표 이름과 금액의 필수값 오류를 필드별로 반환한다', () => {
    expect(validatePaymentSavingGoalForm('', '')).toEqual({
      data: null,
      errors: {
        amount: '목표 금액을 입력해주세요.',
        name: '목표 이름을 입력해주세요.',
      },
    });
  });

  it('최소·최대 목표 금액을 검증한다', () => {
    expect(validatePaymentSavingGoalForm('여행비', '999').errors.amount).toBe(
      '목표 금액은 1,000원 이상이어야 합니다.',
    );
    expect(validatePaymentSavingGoalForm('여행비', '1,000,000,001').errors.amount).toBe(
      '목표 금액은 10억원 이하여야 합니다.',
    );
  });

  it('유효한 원화 문자열을 API 요청 값으로 변환한다', () => {
    expect(validatePaymentSavingGoalForm('  여행비  ', '1,000,000')).toEqual({
      data: {
        name: '여행비',
        targetAmountKrw: 1_000_000,
      },
      errors: {},
    });
  });
});
