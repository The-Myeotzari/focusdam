import { beforeEach, describe, expect, it, vi } from 'vitest';

import { completePaymentThirdReviewReminder } from '@/entities/payment-third-review/api/complete-payment-third-review-reminder';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { PATCH } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({ getUser: vi.fn() }));
vi.mock('@/entities/payment-third-review/api/complete-payment-third-review-reminder', () => ({
  completePaymentThirdReviewReminder: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const completeReminderMock = vi.mocked(completePaymentThirdReviewReminder);
const reviewId = '10000000-0000-0000-0000-000000000001';

function request(body: unknown = { decision: 'hold', memo: '조금 더 고민할게요' }) {
  return new Request(`http://localhost/api/payment-third-reviews/${reviewId}/reminder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function context(id = reviewId) {
  return { params: Promise.resolve({ id }) };
}

describe('PATCH /api/payment-third-reviews/[id]/reminder', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    completeReminderMock.mockReset();
  });

  it('returns 400 before authentication for an invalid decision', async () => {
    const response = await PATCH(request({ decision: 'unknown', memo: '' }), context());

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
    expect(completeReminderMock).not.toHaveBeenCalled();
  });

  it('returns a completed reminder result', async () => {
    const supabase = { from: vi.fn() };
    const item = {
      reviewId,
      followUpId: '30000000-0000-0000-0000-000000000001',
      decision: 'hold' as const,
      status: 'hold_after_hold_scheduled' as const,
      outcomeType: 'hold' as const,
      completedAt: '2026-07-23T09:00:00.000Z',
      nextFollowUpId: '30000000-0000-0000-0000-000000000002',
      savingEntryId: null,
      goalAchievementId: null,
    };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    completeReminderMock.mockResolvedValue({ ok: true, item });

    const response = await PATCH(request(), context());

    expect(completeReminderMock).toHaveBeenCalledWith(supabase, 'user-1', reviewId, {
      decision: 'hold',
      memo: '조금 더 고민할게요',
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
    completeReminderMock.mockResolvedValue({ ok: false, reason });

    const response = await PATCH(request(), context());

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({ title, status: 409 });
  });

  it.each(['not_found', 'invalid_type'] as const)(
    'maps %s to a 404 response',
    async (reason) => {
      getUserMock.mockResolvedValue({
        ok: true,
        supabase: { from: vi.fn() },
        user: { id: 'user-1' },
      } as never);
      completeReminderMock.mockResolvedValue({ ok: false, reason });

      const response = await PATCH(request(), context());

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toMatchObject({ title: 'NOT_FOUND', status: 404 });
    },
  );

  it('maps a database failure to a 500 response', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    completeReminderMock.mockResolvedValue({
      ok: false,
      reason: 'database_error',
      errorMessage: 'database unavailable',
    });

    const response = await PATCH(request(), context());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      title: 'INTERNAL_SERVER_ERROR',
      detail: 'database unavailable',
      status: 500,
    });
  });
});
