import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPaymentThirdReview } from '@/entities/payment-third-review/api/create-payment-third-review';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { POST } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({
  getUser: vi.fn(),
}));

vi.mock('@/entities/payment-third-review/api/create-payment-third-review', () => ({
  createPaymentThirdReview: vi.fn(),
}));

vi.mock('@/entities/payment-third-review/api/get-payment-third-review-list', () => ({
  getPaymentThirdReviewList: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const createPaymentThirdReviewMock = vi.mocked(createPaymentThirdReview);

const validBody = {
  itemName: '무선 이어폰',
  amount: 62000,
  impulseStrength: 'high',
  needTiming: 'tomorrow',
  alternativeStatus: 'similar',
  decision: 'buy',
  reward: '따뜻한 음료',
  satisfactionReminder: true,
  budgetCategory: '생활비',
  buyReason: '이동 중 업무에 필요해요',
  savingTarget: 'goal',
};

function createRequest(body: unknown) {
  return new Request('http://localhost/api/payment-third-reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/payment-third-reviews', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    createPaymentThirdReviewMock.mockReset();
  });

  it('인증 전에 요청 본문을 검증한다', async () => {
    const response = await POST(createRequest({ ...validBody, amount: 0 }));

    expect(response.status).toBe(400);
    expect(getUserMock).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      title: 'VALIDATION_ERROR',
      status: 400,
    });
  });

  it('비로그인 요청에는 표준 401 응답을 반환한다', async () => {
    const request = createRequest(validBody);
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(request, 'UNAUTHORIZED', 401, '로그인이 필요한 요청입니다.'),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(createPaymentThirdReviewMock).not.toHaveBeenCalled();
  });

  it('인증 사용자 소유의 결제 3심을 생성하고 201을 반환한다', async () => {
    const supabase = { from: vi.fn() };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    createPaymentThirdReviewMock.mockResolvedValue({
      ok: true,
      item: {
        id: '10000000-0000-0000-0000-000000000001',
        status: 'buy_satisfaction_scheduled',
        outcomeType: 'buy',
        followUpId: '30000000-0000-0000-0000-000000000001',
        goalId: null,
        savingEntryId: null,
      },
    });

    const response = await POST(createRequest(validBody));

    expect(createPaymentThirdReviewMock).toHaveBeenCalledWith(
      supabase,
      'user-1',
      validBody,
    );
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      item: { outcomeType: 'buy' },
    });
  });

  it('DB 저장 실패를 500 응답으로 변환한다', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    createPaymentThirdReviewMock.mockResolvedValue({
      ok: false,
      reason: 'database_error',
      errorMessage: 'database unavailable',
    });

    const response = await POST(createRequest(validBody));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      title: 'INTERNAL_SERVER_ERROR',
      detail: 'database unavailable',
    });
  });
});
