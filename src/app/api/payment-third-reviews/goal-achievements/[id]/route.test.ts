import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPaymentGoalAchievement } from '@/entities/payment-third-review/api/get-payment-goal-achievements';
import { getUser } from '@/shared/lib/api/get-user';
import { GET } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({ getUser: vi.fn() }));
vi.mock('@/entities/payment-third-review/api/get-payment-goal-achievements', () => ({
  getPaymentGoalAchievement: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const getPaymentGoalAchievementMock = vi.mocked(getPaymentGoalAchievement);
const achievementId = '40000000-0000-0000-0000-000000000001';

function context(id = achievementId) {
  return { params: Promise.resolve({ id }) };
}

describe('GET /api/payment-third-reviews/goal-achievements/[id]', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getPaymentGoalAchievementMock.mockReset();
  });

  it('잘못된 id는 인증 전에 400을 반환한다', async () => {
    const response = await GET(
      new Request(
        'http://localhost/api/payment-third-reviews/goal-achievements/not-a-uuid',
      ),
      context('not-a-uuid'),
    );

    expect(response.status).toBe(400);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('소유하지 않은 달성 기록은 404를 반환한다', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    getPaymentGoalAchievementMock.mockResolvedValue({
      ok: false,
      reason: 'not_found',
      errorMessage: '목표 달성 기록을 찾을 수 없습니다.',
    });

    const response = await GET(
      new Request(
        `http://localhost/api/payment-third-reviews/goal-achievements/${achievementId}`,
      ),
      context(),
    );

    expect(response.status).toBe(404);
  });
});
