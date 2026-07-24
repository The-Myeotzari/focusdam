import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPaymentThirdReviewHome } from '@/entities/payment-third-review/api/get-payment-third-review-home';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { GET } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({
  getUser: vi.fn(),
}));

vi.mock('@/entities/payment-third-review/api/get-payment-third-review-home', () => ({
  getPaymentThirdReviewHome: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const getPaymentThirdReviewHomeMock = vi.mocked(getPaymentThirdReviewHome);

describe('GET /api/payment-third-reviews/home', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getPaymentThirdReviewHomeMock.mockReset();
  });

  it('비로그인 요청에는 401을 반환한다', async () => {
    const request = new Request('http://localhost/api/payment-third-reviews/home');
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(request, 'UNAUTHORIZED', 401, '로그인이 필요한 요청입니다.'),
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(getPaymentThirdReviewHomeMock).not.toHaveBeenCalled();
  });

  it('인증 사용자의 홈 요약과 최근 내역을 반환한다', async () => {
    const supabase = { from: vi.fn() };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    getPaymentThirdReviewHomeMock.mockResolvedValue({
      ok: true,
      data: {
        ok: true,
        stats: {
          totalCount: 3,
          buyCount: 1,
          saveCount: 1,
          holdCount: 1,
          savedAmountKrw: 86000,
        },
        activeGoal: null,
        latestGoalAchievement: null,
        recentItems: [],
      },
    });

    const response = await GET(
      new Request('http://localhost/api/payment-third-reviews/home'),
    );

    expect(getPaymentThirdReviewHomeMock).toHaveBeenCalledWith(supabase, 'user-1');
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe(
      'private, no-store, max-age=0',
    );
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      stats: { totalCount: 3, savedAmountKrw: 86000 },
      recentItems: [],
    });
  });

  it('홈 데이터 조회 실패를 500으로 변환한다', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    getPaymentThirdReviewHomeMock.mockResolvedValue({
      ok: false,
      errorMessage: 'database unavailable',
    });

    const response = await GET(
      new Request('http://localhost/api/payment-third-reviews/home'),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      title: 'INTERNAL_SERVER_ERROR',
      detail: 'database unavailable',
    });
  });
});
