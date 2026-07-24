import { describe, expect, it, vi } from 'vitest';

import {
  getPaymentGoalAchievement,
  getPaymentGoalAchievementIdBySavingEntryId,
  getPaymentGoalAchievements,
} from './get-payment-goal-achievements';

const achievementRow = {
  id: '40000000-0000-0000-0000-000000000001',
  goal_id: '20000000-0000-0000-0000-000000000001',
  target_amount_krw: 100000,
  achieved_amount_krw: 110000,
  saved_review_count: 3,
  achieved_at: '2026-07-24T06:00:00.000Z',
  trigger_review_id: '10000000-0000-0000-0000-000000000001',
  payment_saving_goals: { name: '여행비' },
  payment_saving_entries: { amount_krw: 30000 },
  payment_reviews: { status: 'save_completed' },
};

function createListQuery(result: unknown) {
  const query = {
    eq: vi.fn(),
    order: vi.fn(),
    select: vi.fn(),
  };

  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.order.mockResolvedValue(result);

  return query;
}

function createDetailQuery(result: unknown) {
  const query = {
    eq: vi.fn(),
    maybeSingle: vi.fn(),
    select: vi.fn(),
  };

  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.maybeSingle.mockResolvedValue(result);

  return query;
}

describe('getPaymentGoalAchievements', () => {
  it('사용자 소유 달성 기록을 최신순으로 조회해 화면 모델로 변환한다', async () => {
    const query = createListQuery({ data: [achievementRow], error: null });
    const from = vi.fn().mockReturnValue(query);

    const result = await getPaymentGoalAchievements({ from } as never, 'user-1');

    expect(from).toHaveBeenCalledWith('payment_goal_achievements');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.order).toHaveBeenCalledWith('achieved_at', { ascending: false });
    expect(result).toEqual({
      ok: true,
      items: [
        {
          id: achievementRow.id,
          goalId: achievementRow.goal_id,
          goalName: '여행비',
          targetAmount: 100000,
          achievedAmount: 110000,
          savedAmount: 20000,
          savedReviewCount: 3,
          achievedAt: achievementRow.achieved_at,
          triggerReviewId: achievementRow.trigger_review_id,
          triggerStatus: 'save_completed',
        },
      ],
    });
  });

  it('DB 오류를 반환한다', async () => {
    const query = createListQuery({
      data: null,
      error: { message: 'database unavailable' },
    });

    await expect(
      getPaymentGoalAchievements(
        { from: vi.fn().mockReturnValue(query) } as never,
        'user-1',
      ),
    ).resolves.toEqual({
      ok: false,
      errorMessage: 'database unavailable',
    });
  });
});

describe('getPaymentGoalAchievement', () => {
  it('사용자와 id가 일치하는 달성 상세를 반환한다', async () => {
    const query = createDetailQuery({ data: achievementRow, error: null });

    const result = await getPaymentGoalAchievement(
      { from: vi.fn().mockReturnValue(query) } as never,
      'user-1',
      achievementRow.id,
    );

    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.eq).toHaveBeenCalledWith('id', achievementRow.id);
    expect(result).toMatchObject({
      ok: true,
      item: { id: achievementRow.id, goalName: '여행비' },
    });
  });

  it('소유한 달성 기록이 없으면 not_found를 반환한다', async () => {
    const query = createDetailQuery({ data: null, error: null });

    const result = await getPaymentGoalAchievement(
      { from: vi.fn().mockReturnValue(query) } as never,
      'user-1',
      achievementRow.id,
    );

    expect(result).toMatchObject({ ok: false, reason: 'not_found' });
  });
});

describe('getPaymentGoalAchievementIdBySavingEntryId', () => {
  it('저축 기록으로 생성된 달성 기록 id를 반환한다', async () => {
    const query = createDetailQuery({
      data: { id: achievementRow.id },
      error: null,
    });

    const result = await getPaymentGoalAchievementIdBySavingEntryId(
      { from: vi.fn().mockReturnValue(query) } as never,
      'user-1',
      '50000000-0000-0000-0000-000000000001',
    );

    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.eq).toHaveBeenCalledWith(
      'trigger_saving_entry_id',
      '50000000-0000-0000-0000-000000000001',
    );
    expect(result).toBe(achievementRow.id);
  });
});
