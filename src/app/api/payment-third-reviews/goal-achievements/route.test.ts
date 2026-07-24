import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPaymentGoalAchievements } from '@/entities/payment-third-review/api/get-payment-goal-achievements';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { GET } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({ getUser: vi.fn() }));
vi.mock('@/entities/payment-third-review/api/get-payment-goal-achievements', () => ({
  getPaymentGoalAchievements: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const getPaymentGoalAchievementsMock = vi.mocked(getPaymentGoalAchievements);

describe('GET /api/payment-third-reviews/goal-achievements', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getPaymentGoalAchievementsMock.mockReset();
  });

  it('비로그인 요청에는 401을 반환한다', async () => {
    const request = new Request(
      'http://localhost/api/payment-third-reviews/goal-achievements',
    );
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(request, 'UNAUTHORIZED', 401, '로그인이 필요합니다.'),
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(getPaymentGoalAchievementsMock).not.toHaveBeenCalled();
  });

  it('인증 사용자의 달성 기록 목록을 반환한다', async () => {
    const supabase = { from: vi.fn() };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    getPaymentGoalAchievementsMock.mockResolvedValue({ ok: true, items: [] });

    const response = await GET(
      new Request('http://localhost/api/payment-third-reviews/goal-achievements'),
    );

    expect(getPaymentGoalAchievementsMock).toHaveBeenCalledWith(supabase, 'user-1');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, items: [] });
  });
});
