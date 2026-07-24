import { describe, expect, it, vi } from 'vitest';

import {
  createPaymentSavingGoal,
  updateActivePaymentSavingGoal,
} from './save-payment-saving-goal';

const input = { name: '여행비', targetAmountKrw: 1_000_000 };
const goalRow = {
  id: '20000000-0000-0000-0000-000000000001',
  name: '여행비',
  current_saved_amount_krw: 580000,
  target_amount_krw: 1000000,
};

function createInsertQuery(result: unknown) {
  const builder = {
    insert: vi.fn(),
    select: vi.fn(),
    single: vi.fn(),
  };

  builder.insert.mockReturnValue(builder);
  builder.select.mockReturnValue(builder);
  builder.single.mockResolvedValue(result);

  return builder;
}

function createUpdateQuery(result: unknown) {
  const builder = {
    eq: vi.fn(),
    maybeSingle: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
  };

  builder.eq.mockReturnValue(builder);
  builder.select.mockReturnValue(builder);
  builder.update.mockReturnValue(builder);
  builder.maybeSingle.mockResolvedValue(result);

  return builder;
}

describe('createPaymentSavingGoal', () => {
  it('새 활성 목표를 생성하고 화면 응답으로 변환한다', async () => {
    const query = createInsertQuery({ data: goalRow, error: null });
    const from = vi.fn().mockReturnValue(query);

    const result = await createPaymentSavingGoal({ from } as never, 'user-1', input);

    expect(from).toHaveBeenCalledWith('payment_saving_goals');
    expect(query.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      name: '여행비',
      target_amount_krw: 1000000,
      status: 'active',
    });
    expect(result).toEqual({
      ok: true,
      item: {
        id: goalRow.id,
        name: '여행비',
        currentSavedAmountKrw: 580000,
        targetAmountKrw: 1000000,
      },
    });
  });

  it('활성 목표 중복 오류를 구분한다', async () => {
    const query = createInsertQuery({
      data: null,
      error: { code: '23505', message: 'duplicate key' },
    });

    const result = await createPaymentSavingGoal(
      { from: vi.fn().mockReturnValue(query) } as never,
      'user-1',
      input,
    );

    expect(result).toEqual({
      ok: false,
      reason: 'already_exists',
      errorMessage: 'duplicate key',
    });
  });
});

describe('updateActivePaymentSavingGoal', () => {
  it('현재 저축액을 유지하면서 활성 목표를 수정한다', async () => {
    const query = createUpdateQuery({ data: goalRow, error: null });

    const result = await updateActivePaymentSavingGoal(
      { from: vi.fn().mockReturnValue(query) } as never,
      'user-1',
      input,
    );

    expect(query.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '여행비',
        target_amount_krw: 1000000,
      }),
    );
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.eq).toHaveBeenCalledWith('status', 'active');
    expect(result).toMatchObject({
      ok: true,
      item: { currentSavedAmountKrw: 580000 },
    });
  });

  it('활성 목표가 없으면 not_found를 반환한다', async () => {
    const query = createUpdateQuery({ data: null, error: null });

    const result = await updateActivePaymentSavingGoal(
      { from: vi.fn().mockReturnValue(query) } as never,
      'user-1',
      input,
    );

    expect(result).toEqual({
      ok: false,
      reason: 'not_found',
      errorMessage: '수정할 활성 목표를 찾을 수 없습니다.',
    });
  });
});
