import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPaymentThirdReviewList } from '@/entities/payment-third-review/api/get-payment-third-review-list';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { GET } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({
  getUser: vi.fn(),
}));

vi.mock('@/entities/payment-third-review/api/get-payment-third-review-list', () => ({
  getPaymentThirdReviewList: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const getPaymentThirdReviewListMock = vi.mocked(getPaymentThirdReviewList);

const listItem = {
  id: '10000000-0000-0000-0000-000000000001',
  itemName: '무선 이어폰',
  amountKrw: 62000,
  impulseStrength: 'high' as const,
  outcomeType: 'buy' as const,
  status: 'buy_satisfaction_scheduled' as const,
  createdAt: '2026-07-22T09:00:00.000Z',
  followUp: {
    id: '30000000-0000-0000-0000-000000000001',
    type: 'satisfaction' as const,
    sequence: 1,
    status: 'scheduled' as const,
    scheduledAt: '2026-07-23T09:00:00.000Z',
    completedAt: null,
    reminderDecision: null,
    satisfactionScore: null,
    summary: null,
  },
};

describe('GET /api/payment-third-reviews', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getPaymentThirdReviewListMock.mockReset();
  });

  it('returns 400 before authentication when the query is invalid', async () => {
    const response = await GET(
      new Request('http://localhost/api/payment-third-reviews?page=0&outcomeType=unknown'),
    );

    expect(response.status).toBe(400);
    expect(getUserMock).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      title: 'VALIDATION_ERROR',
      status: 400,
      path: '/api/payment-third-reviews',
    });
  });

  it('returns the standard 401 response for an unauthenticated request', async () => {
    const request = new Request('http://localhost/api/payment-third-reviews');
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(request, 'UNAUTHORIZED', 401, '로그인이 필요한 요청입니다.'),
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(getPaymentThirdReviewListMock).not.toHaveBeenCalled();
  });

  it('passes the authenticated user, filter, and pagination to the list query', async () => {
    const supabase = { from: vi.fn() };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    getPaymentThirdReviewListMock.mockResolvedValue({
      ok: true,
      items: [listItem],
      pagination: {
        page: 2,
        size: 6,
        totalElements: 14,
        totalPages: 3,
      },
    });

    const response = await GET(
      new Request(
        'http://localhost/api/payment-third-reviews?outcomeType=buy&page=2&size=6',
      ),
    );

    expect(getPaymentThirdReviewListMock).toHaveBeenCalledWith(supabase, 'user-1', {
      outcomeType: 'buy',
      page: 2,
      size: 6,
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      items: [listItem],
      pagination: {
        page: 2,
        size: 6,
        totalElements: 14,
        totalPages: 3,
      },
    });
  });

  it('returns 500 when the database query fails', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    getPaymentThirdReviewListMock.mockResolvedValue({
      ok: false,
      errorMessage: 'database unavailable',
    });

    const response = await GET(new Request('http://localhost/api/payment-third-reviews'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      title: 'INTERNAL_SERVER_ERROR',
      status: 500,
      detail: 'database unavailable',
    });
  });
});
