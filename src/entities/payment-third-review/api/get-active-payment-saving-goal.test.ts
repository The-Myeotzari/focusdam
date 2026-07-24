import { describe, expect, it, vi } from 'vitest';

import { getActivePaymentSavingGoal } from './get-active-payment-saving-goal';

function createQuery(result: unknown) {
  const builder = {
    eq: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(),
    select: vi.fn(),
  };

  builder.eq.mockReturnValue(builder);
  builder.limit.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.select.mockReturnValue(builder);
  builder.maybeSingle.mockResolvedValue(result);

  return builder;
}

describe('getActivePaymentSavingGoal', () => {
  it('가장 오래된 활성 목표를 화면 응답으로 변환한다', async () => {
    const query = createQuery({
      data: {
        id: '20000000-0000-0000-0000-000000000001',
        name: '여행비',
        current_saved_amount_krw: 580000,
        target_amount_krw: 1000000,
      },
      error: null,
    });
    const from = vi.fn().mockReturnValue(query);

    const result = await getActivePaymentSavingGoal({ from } as never, 'user-1');

    expect(from).toHaveBeenCalledWith('payment_saving_goals');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.eq).toHaveBeenCalledWith('status', 'active');
    expect(result).toEqual({
      ok: true,
      item: {
        id: '20000000-0000-0000-0000-000000000001',
        name: '여행비',
        currentSavedAmountKrw: 580000,
        targetAmountKrw: 1000000,
      },
    });
  });

  it('활성 목표가 없으면 null을 반환한다', async () => {
    const query = createQuery({ data: null, error: null });

    const result = await getActivePaymentSavingGoal(
      { from: vi.fn().mockReturnValue(query) } as never,
      'user-1',
    );

    expect(result).toEqual({ ok: true, item: null });
  });

  it('DB 조회 오류를 반환한다', async () => {
    const query = createQuery({ data: null, error: { message: 'database unavailable' } });

    const result = await getActivePaymentSavingGoal(
      { from: vi.fn().mockReturnValue(query) } as never,
      'user-1',
    );

    expect(result).toEqual({ ok: false, errorMessage: 'database unavailable' });
  });
});
