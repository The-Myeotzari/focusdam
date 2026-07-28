import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getActivePaymentSavingGoal } from '@/entities/payment-third-review/api/get-active-payment-saving-goal';
import {
  createPaymentSavingGoal,
  updateActivePaymentSavingGoal,
} from '@/entities/payment-third-review/api/save-payment-saving-goal';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { GET, PATCH, POST } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({
  getUser: vi.fn(),
}));

vi.mock('@/entities/payment-third-review/api/get-active-payment-saving-goal', () => ({
  getActivePaymentSavingGoal: vi.fn(),
}));

vi.mock('@/entities/payment-third-review/api/save-payment-saving-goal', () => ({
  createPaymentSavingGoal: vi.fn(),
  updateActivePaymentSavingGoal: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);
const getActivePaymentSavingGoalMock = vi.mocked(getActivePaymentSavingGoal);
const createPaymentSavingGoalMock = vi.mocked(createPaymentSavingGoal);
const updateActivePaymentSavingGoalMock = vi.mocked(updateActivePaymentSavingGoal);

function saveRequest(method: 'PATCH' | 'POST', body: unknown) {
  return new Request('http://localhost/api/payment-third-reviews/goal', {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('GET /api/payment-third-reviews/goal', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getActivePaymentSavingGoalMock.mockReset();
    createPaymentSavingGoalMock.mockReset();
    updateActivePaymentSavingGoalMock.mockReset();
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

describe('POST /api/payment-third-reviews/goal', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    createPaymentSavingGoalMock.mockReset();
  });

  it('올바르지 않은 목표 입력에는 400을 반환한다', async () => {
    const response = await POST(saveRequest('POST', { name: '', targetAmountKrw: 500 }));

    expect(response.status).toBe(400);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('새 활성 목표를 생성한다', async () => {
    const supabase = { from: vi.fn() };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    createPaymentSavingGoalMock.mockResolvedValue({
      ok: true,
      item: {
        id: '20000000-0000-0000-0000-000000000001',
        name: '여행비',
        currentSavedAmountKrw: 0,
        targetAmountKrw: 1000000,
      },
    });

    const response = await POST(
      saveRequest('POST', { name: '여행비', targetAmountKrw: 1000000 }),
    );

    expect(createPaymentSavingGoalMock).toHaveBeenCalledWith(supabase, 'user-1', {
      name: '여행비',
      targetAmountKrw: 1000000,
    });
    expect(response.status).toBe(201);
  });

  it('이미 활성 목표가 있으면 409를 반환한다', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    createPaymentSavingGoalMock.mockResolvedValue({
      ok: false,
      reason: 'already_exists',
      errorMessage: 'duplicate key',
    });

    const response = await POST(
      saveRequest('POST', { name: '여행비', targetAmountKrw: 1000000 }),
    );

    expect(response.status).toBe(409);
  });
});

describe('PATCH /api/payment-third-reviews/goal', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    updateActivePaymentSavingGoalMock.mockReset();
  });

  it('기존 활성 목표를 수정한다', async () => {
    const supabase = { from: vi.fn() };
    getUserMock.mockResolvedValue({
      ok: true,
      supabase,
      user: { id: 'user-1' },
    } as never);
    updateActivePaymentSavingGoalMock.mockResolvedValue({
      ok: true,
      item: {
        id: '20000000-0000-0000-0000-000000000001',
        name: '비상금',
        currentSavedAmountKrw: 580000,
        targetAmountKrw: 1500000,
      },
    });

    const response = await PATCH(
      saveRequest('PATCH', { name: '비상금', targetAmountKrw: 1500000 }),
    );

    expect(updateActivePaymentSavingGoalMock).toHaveBeenCalledWith(supabase, 'user-1', {
      name: '비상금',
      targetAmountKrw: 1500000,
    });
    expect(response.status).toBe(200);
  });

  it('활성 목표가 없으면 404를 반환한다', async () => {
    getUserMock.mockResolvedValue({
      ok: true,
      supabase: { from: vi.fn() },
      user: { id: 'user-1' },
    } as never);
    updateActivePaymentSavingGoalMock.mockResolvedValue({
      ok: false,
      reason: 'not_found',
      errorMessage: '수정할 활성 목표를 찾을 수 없습니다.',
    });

    const response = await PATCH(
      saveRequest('PATCH', { name: '비상금', targetAmountKrw: 1500000 }),
    );

    expect(response.status).toBe(404);
  });
});
