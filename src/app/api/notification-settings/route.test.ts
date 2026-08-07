import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { GET, PATCH } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({ getUser: vi.fn() }));

const getUserMock = vi.mocked(getUser);
const settingsRow = {
  start_reminder: true,
  spend_hold: false,
  emotion_reset: true,
  quiet_hours: false,
};

function request(method: 'GET' | 'PATCH', body?: unknown) {
  return new Request('http://localhost/api/notification-settings', {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function mockGetQuery(data: unknown, error: unknown = null) {
  const maybeSingle = vi.fn().mockResolvedValue({ data, error });
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  getUserMock.mockResolvedValue({
    ok: true,
    supabase: { from },
    user: { id: 'user-1' },
  } as never);

  return { eq, from, select };
}

function mockPatchQuery(data: unknown, error: unknown = null) {
  const single = vi.fn().mockResolvedValue({ data, error });
  const select = vi.fn(() => ({ single }));
  const upsert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ upsert }));

  getUserMock.mockResolvedValue({
    ok: true,
    supabase: { from },
    user: { id: 'user-1' },
  } as never);

  return { from, select, single, upsert };
}

describe('/api/notification-settings', () => {
  beforeEach(() => {
    getUserMock.mockReset();
  });

  it('인증되지 않은 조회 요청에는 인증 오류를 반환한다', async () => {
    const apiRequest = request('GET');
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(apiRequest, 'UNAUTHORIZED', 401, '로그인이 필요합니다.'),
    });

    const response = await GET(apiRequest);

    expect(response.status).toBe(401);
  });

  it('저장된 설정이 없으면 기본 설정을 반환한다', async () => {
    mockGetQuery(null);

    const response = await GET(request('GET'));

    expect(response.headers.get('Cache-Control')).toBe('private, no-store, max-age=0');
    await expect(response.json()).resolves.toEqual({
      ok: true,
      settings: {
        startReminder: true,
        spendHold: true,
        emotionReset: false,
        quietHours: true,
      },
    });
  });

  it('인증 사용자에게 저장된 알림 설정을 반환한다', async () => {
    const query = mockGetQuery(settingsRow);

    const response = await GET(request('GET'));

    expect(query.from).toHaveBeenCalledWith('notification_settings');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    await expect(response.json()).resolves.toEqual({
      ok: true,
      settings: {
        startReminder: true,
        spendHold: false,
        emotionReset: true,
        quietHours: false,
      },
    });
  });

  it('잘못된 수정 요청은 인증 전에 거절한다', async () => {
    const response = await PATCH(
      request('PATCH', {
        startReminder: 'yes',
        spendHold: true,
        emotionReset: false,
        quietHours: true,
      }),
    );

    expect(response.status).toBe(400);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('사용자 소유 설정을 upsert하고 저장 결과를 반환한다', async () => {
    const query = mockPatchQuery(settingsRow);
    const input = {
      startReminder: true,
      spendHold: false,
      emotionReset: true,
      quietHours: false,
    };

    const response = await PATCH(request('PATCH', input));

    expect(query.from).toHaveBeenCalledWith('notification_settings');
    expect(query.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        start_reminder: true,
        spend_hold: false,
        emotion_reset: true,
        quiet_hours: false,
      }),
      { onConflict: 'user_id' },
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, settings: input });
  });

  it('Supabase 조회·저장 오류를 표준 500 응답으로 변환한다', async () => {
    mockGetQuery(null, { message: 'database unavailable' });
    const getResponse = await GET(request('GET'));

    expect(getResponse.status).toBe(500);
    await expect(getResponse.json()).resolves.toMatchObject({
      title: 'INTERNAL_SERVER_ERROR',
      detail: 'database unavailable',
    });

    mockPatchQuery(null, { message: 'write failed' });
    const patchResponse = await PATCH(
      request('PATCH', {
        startReminder: true,
        spendHold: true,
        emotionReset: false,
        quietHours: true,
      }),
    );

    expect(patchResponse.status).toBe(500);
    await expect(patchResponse.json()).resolves.toMatchObject({
      title: 'INTERNAL_SERVER_ERROR',
      detail: 'write failed',
    });
  });
});
