import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getActivePaymentSavingGoal } from '@/entities/payment-third-review/api/get-active-payment-saving-goal';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { GET } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({
  getUser: vi.fn(),
}));

vi.mock('@/entities/payment-third-review/api/get-active-payment-saving-goal', () => ({
  getActivePaymentSavingGoal: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const getActivePaymentSavingGoalMock = vi.mocked(getActivePaymentSavingGoal);

describe('GET /api/payment-third-reviews/goal', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getActivePaymentSavingGoalMock.mockReset();
  });

  it('비로그인 요청에는 401을 반환한다', async () => {
    const request = new Request('http://localhost/api/payment-third-reviews/goal');
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(request, 'UNAUTHORIZED', 401, '로그인이 필요한 요청입니다.'),
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(getActivePaymentSavingGoalMock).not.toHaveBeenCalled();
  });

  it('인증 사용자의 활성 목표를 반환한다', async () => {
    const supabase = { from: vi.fn() };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    getActivePaymentSavingGoalMock.mockResolvedValue({
      ok: true,
      item: {
        id: '20000000-0000-0000-0000-000000000001',
        name: '여행비',
        currentSavedAmountKrw: 580000,
        targetAmountKrw: 1000000,
      },
    });

    const response = await GET(
      new Request('http://localhost/api/payment-third-reviews/goal'),
    );

    expect(getActivePaymentSavingGoalMock).toHaveBeenCalledWith(supabase, 'user-1');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      item: { name: '여행비', currentSavedAmountKrw: 580000 },
    });
  });

  it('DB 조회 실패를 500으로 변환한다', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    getActivePaymentSavingGoalMock.mockResolvedValue({
      ok: false,
      errorMessage: 'database unavailable',
    });

    const response = await GET(
      new Request('http://localhost/api/payment-third-reviews/goal'),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      title: 'INTERNAL_SERVER_ERROR',
      detail: 'database unavailable',
    });
  });
});
