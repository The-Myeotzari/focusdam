import { beforeEach, describe, expect, it, vi } from 'vitest';

import { completePaymentThirdReviewReminder } from './complete-payment-third-review-reminder';
import { getPaymentGoalAchievementIdBySavingEntryId } from './get-payment-goal-achievements';

vi.mock('./get-payment-goal-achievements', () => ({
  getPaymentGoalAchievementIdBySavingEntryId: vi.fn(),
}));

const getGoalAchievementIdMock = vi.mocked(getPaymentGoalAchievementIdBySavingEntryId);
const reviewId = '10000000-0000-0000-0000-000000000001';
const followUpId = '30000000-0000-0000-0000-000000000001';
const nextFollowUpId = '30000000-0000-0000-0000-000000000002';
const savingEntryId = '40000000-0000-0000-0000-000000000001';
const goalAchievementId = '50000000-0000-0000-0000-000000000001';

function successItem(overrides: Record<string, unknown> = {}) {
  return {
    reviewId,
    followUpId,
    decision: 'buy',
    status: 'hold_after_buy',
    outcomeType: 'buy',
    completedAt: '2026-08-07T05:30:00+00:00',
    nextFollowUpId: null,
    savingEntryId: null,
    goalAchievementId: null,
    ...overrides,
  };
}

describe('completePaymentThirdReviewReminder', () => {
  const rpc = vi.fn();

  beforeEach(() => {
    rpc.mockReset();
    getGoalAchievementIdMock.mockReset();
  });

  it('completes a first reminder with a buy decision through one RPC', async () => {
    rpc.mockResolvedValue({ data: { ok: true, item: successItem() }, error: null });

    const result = await completePaymentThirdReviewReminder(
      { rpc } as never,
      'user-1',
      reviewId,
      { decision: 'buy', memo: '계속 필요해요' },
    );

    expect(rpc).toHaveBeenCalledWith('complete_payment_third_review_reminder', {
      p_review_id: reviewId,
      p_decision: 'buy',
      p_memo: '계속 필요해요',
    });
    expect(result).toMatchObject({
      ok: true,
      item: { decision: 'buy', status: 'hold_after_buy', outcomeType: 'buy' },
    });
  });

  it('returns the next reminder created by a rehold decision', async () => {
    rpc.mockResolvedValue({
      data: {
        ok: true,
        item: successItem({
          decision: 'hold',
          status: 'rehold_after_hold_scheduled',
          outcomeType: 'hold',
          nextFollowUpId,
        }),
      },
      error: null,
    });

    const result = await completePaymentThirdReviewReminder(
      { rpc } as never,
      'user-1',
      reviewId,
      { decision: 'hold', memo: '' },
    );

    expect(result).toMatchObject({
      ok: true,
      item: {
        decision: 'hold',
        status: 'rehold_after_hold_scheduled',
        nextFollowUpId,
      },
    });
  });

  it('loads the goal achievement created from a cancel saving entry', async () => {
    rpc.mockResolvedValue({
      data: {
        ok: true,
        item: successItem({
          decision: 'cancel',
          status: 'hold_after_save',
          outcomeType: 'save',
          savingEntryId,
        }),
      },
      error: null,
    });
    getGoalAchievementIdMock.mockResolvedValue(goalAchievementId);
    const supabase = { rpc } as never;

    const result = await completePaymentThirdReviewReminder(
      supabase,
      'user-1',
      reviewId,
      { decision: 'cancel', memo: '사지 않기로 했어요' },
    );

    expect(getGoalAchievementIdMock).toHaveBeenCalledWith(
      supabase,
      'user-1',
      savingEntryId,
    );
    expect(result).toMatchObject({
      ok: true,
      item: { savingEntryId, goalAchievementId },
    });
  });

  it.each(['not_ready', 'not_found', 'invalid_type', 'already_completed'] as const)(
    'returns the %s domain failure from the RPC',
    async (reason) => {
      rpc.mockResolvedValue({ data: { ok: false, reason }, error: null });

      const result = await completePaymentThirdReviewReminder(
        { rpc } as never,
        'user-1',
        reviewId,
        { decision: 'buy', memo: '' },
      );

      expect(result).toEqual({ ok: false, reason });
    },
  );

  it('returns a database failure without attempting a manual rollback', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'transaction failed' } });

    const result = await completePaymentThirdReviewReminder(
      { rpc } as never,
      'user-1',
      reviewId,
      { decision: 'hold', memo: '' },
    );

    expect(rpc).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: 'transaction failed',
    });
  });

  it('rejects an invalid RPC response', async () => {
    rpc.mockResolvedValue({ data: { ok: true, item: null }, error: null });

    const result = await completePaymentThirdReviewReminder(
      { rpc } as never,
      'user-1',
      reviewId,
      { decision: 'buy', memo: '' },
    );

    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: '리마인드 완료 응답 형식이 올바르지 않습니다.',
    });
  });
});
