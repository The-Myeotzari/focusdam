import { beforeEach, describe, expect, it, vi } from 'vitest';

import { completePaymentThirdReviewSatisfaction } from '@/entities/payment-third-review/api/complete-payment-third-review-satisfaction';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { PATCH } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({ getUser: vi.fn() }));
vi.mock('@/entities/payment-third-review/api/complete-payment-third-review-satisfaction', () => ({
  completePaymentThirdReviewSatisfaction: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const completeSatisfactionMock = vi.mocked(completePaymentThirdReviewSatisfaction);
const reviewId = '10000000-0000-0000-0000-000000000001';

function request(body: unknown = { score: 4, summary: '만족', memo: '잘 사용하고 있어요' }) {
  return new Request(`http://localhost/api/payment-third-reviews/${reviewId}/satisfaction`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function context(id = reviewId) {
  return { params: Promise.resolve({ id }) };
}

describe('PATCH /api/payment-third-reviews/[id]/satisfaction', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    completeSatisfactionMock.mockReset();
  });

  it('returns 400 before authentication for an invalid payload', async () => {
    const response = await PATCH(request({ score: 7, summary: '', memo: '' }), context());

    expect(response.status).toBe(400);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('returns the authentication response for an unauthenticated request', async () => {
    const apiRequest = request();
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(apiRequest, 'UNAUTHORIZED', 401, '로그인이 필요합니다.'),
    });

    const response = await PATCH(apiRequest, context());

    expect(response.status).toBe(401);
    expect(completeSatisfactionMock).not.toHaveBeenCalled();
  });

  it('completes an authenticated satisfaction check', async () => {
    const supabase = { from: vi.fn() };
    const item = {
      reviewId,
      followUpId: '30000000-0000-0000-0000-000000000001',
      status: 'completed' as const,
      score: 4,
      summary: '만족',
      memo: '잘 사용하고 있어요',
      completedAt: '2026-07-23T09:00:00.000Z',
    };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    completeSatisfactionMock.mockResolvedValue({ ok: true, item });

    const response = await PATCH(request(), context());

    expect(completeSatisfactionMock).toHaveBeenCalledWith(supabase, 'user-1', reviewId, {
      score: 4,
      summary: '만족',
      memo: '잘 사용하고 있어요',
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, item });
  });

  it.each([
    ['already_completed', 'ALREADY_COMPLETED'],
    ['not_ready', 'NOT_READY'],
  ] as const)('maps %s to a 409 response', async (reason, title) => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    completeSatisfactionMock.mockResolvedValue({ ok: false, reason });

    const response = await PATCH(request(), context());

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({ title, status: 409 });
  });
});
