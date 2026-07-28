import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPaymentThirdReviewDetail } from '@/entities/payment-third-review/api/get-payment-third-review-detail';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { GET } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({ getUser: vi.fn() }));
vi.mock('@/entities/payment-third-review/api/get-payment-third-review-detail', () => ({
  getPaymentThirdReviewDetail: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const getPaymentThirdReviewDetailMock = vi.mocked(getPaymentThirdReviewDetail);
const reviewId = '10000000-0000-0000-0000-000000000001';

function context(id = reviewId) {
  return { params: Promise.resolve({ id }) };
}

describe('GET /api/payment-third-reviews/[id]', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getPaymentThirdReviewDetailMock.mockReset();
  });

  it('returns 400 before authentication when the id is invalid', async () => {
    const response = await GET(
      new Request('http://localhost/api/payment-third-reviews/not-a-uuid'),
      context('not-a-uuid'),
    );

    expect(response.status).toBe(400);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('returns the authentication response for an unauthenticated request', async () => {
    const request = new Request(`http://localhost/api/payment-third-reviews/${reviewId}`);
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(request, 'UNAUTHORIZED', 401, '로그인이 필요합니다.'),
    });

    const response = await GET(request, context());

    expect(response.status).toBe(401);
    expect(getPaymentThirdReviewDetailMock).not.toHaveBeenCalled();
  });

  it('returns an owner-scoped detail response', async () => {
    const supabase = { from: vi.fn() };
    const item = {
      id: reviewId,
      itemName: '무선 이어폰',
      amountKrw: 62000,
      impulseStrength: 'high' as const,
      initialDecision: 'buy' as const,
      outcomeType: 'buy' as const,
      status: 'buy_satisfaction_scheduled' as const,
      reason: '업무에 필요',
      buyReason: null,
      createdAt: '2026-07-22T09:00:00.000Z',
      decidedAt: '2026-07-22T09:10:00.000Z',
      goal: null,
      followUps: [],
    };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    getPaymentThirdReviewDetailMock.mockResolvedValue({ ok: true, item });

    const response = await GET(
      new Request(`http://localhost/api/payment-third-reviews/${reviewId}`),
      context(),
    );

    expect(getPaymentThirdReviewDetailMock).toHaveBeenCalledWith(
      supabase,
      'user-1',
      reviewId,
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, item });
  });

  it('returns 404 when the review does not belong to the user', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    getPaymentThirdReviewDetailMock.mockResolvedValue({ ok: false, reason: 'not_found' });

    const response = await GET(
      new Request(`http://localhost/api/payment-third-reviews/${reviewId}`),
      context(),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({ title: 'NOT_FOUND', status: 404 });
  });
});
