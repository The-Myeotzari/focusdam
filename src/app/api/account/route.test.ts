import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';

import { DELETE } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({
  getUser: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);

function createRequest(confirmation: unknown = '계정 삭제') {
  return new Request('http://localhost/api/account', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ confirmation }),
  });
}

function createAuthenticatedSupabase(options?: {
  listError?: string;
  removeError?: string;
  rpcError?: string;
  rpcErrorCode?: string;
}) {
  const list = vi.fn(async (prefix: string) => {
    if (options?.listError) {
      return { data: null, error: { message: options.listError } };
    }

    if (prefix === 'user-1') {
      return {
        data: [
          { id: 'file-1', name: 'export.csv' },
          { id: null, name: 'reports' },
        ],
        error: null,
      };
    }

    return {
      data: [{ id: 'file-2', name: 'weekly.pdf' }],
      error: null,
    };
  });
  const remove = vi.fn().mockResolvedValue({
    data: [],
    error: options?.removeError ? { message: options.removeError } : null,
  });
  const fromStorage = vi.fn(() => ({ list, remove }));
  const rpc = vi.fn().mockResolvedValue({
    data: null,
    error: options?.rpcError
      ? { code: options.rpcErrorCode, message: options.rpcError }
      : null,
  });
  const signOut = vi.fn().mockResolvedValue({ error: null });
  const supabase = {
    storage: { from: fromStorage },
    rpc,
    auth: { signOut },
  };

  getUserMock.mockResolvedValue({
    ok: true,
    supabase,
    user: { id: 'user-1' },
  } as never);

  return { fromStorage, list, remove, rpc, signOut };
}

describe('DELETE /api/account', () => {
  beforeEach(() => {
    getUserMock.mockReset();
  });

  it('정확한 확인 문구가 아니면 인증과 삭제를 시작하지 않는다', async () => {
    const response = await DELETE(createRequest('삭제'));

    expect(response.status).toBe(400);
    expect(getUserMock).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      title: 'VALIDATION_ERROR',
    });
  });

  it('비로그인 요청에는 401을 반환한다', async () => {
    const request = createRequest();
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(request, 'UNAUTHORIZED', 401, '로그인이 필요합니다.'),
    });

    const response = await DELETE(request);

    expect(response.status).toBe(401);
  });

  it('내보내기 파일을 재귀적으로 삭제한 뒤 계정 RPC와 로그아웃을 실행한다', async () => {
    const mocks = createAuthenticatedSupabase();

    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.remove).toHaveBeenCalledWith([
      'user-1/export.csv',
      'user-1/reports/weekly.pdf',
    ]);
    expect(mocks.rpc).toHaveBeenCalledWith('delete_current_user_account');
    expect(mocks.signOut).toHaveBeenCalledOnce();
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it('Storage 삭제 실패 시 DB 계정 삭제를 실행하지 않는다', async () => {
    const mocks = createAuthenticatedSupabase({ removeError: 'storage unavailable' });

    const response = await DELETE(createRequest());

    expect(response.status).toBe(500);
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('DB 계정 삭제 실패를 500으로 반환하고 로그아웃하지 않는다', async () => {
    const mocks = createAuthenticatedSupabase({ rpcError: 'foreign key violation' });

    const response = await DELETE(createRequest());

    expect(response.status).toBe(500);
    expect(mocks.signOut).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      title: 'ACCOUNT_DELETE_FAILED',
      detail: 'foreign key violation',
    });
  });

  it('계정 삭제 RPC가 적용되지 않은 경우 사용자용 503 안내를 반환한다', async () => {
    const mocks = createAuthenticatedSupabase({
      rpcError: 'function is missing from schema cache',
      rpcErrorCode: 'PGRST202',
    });

    const response = await DELETE(createRequest());

    expect(response.status).toBe(503);
    expect(mocks.signOut).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      title: 'ACCOUNT_DELETE_NOT_CONFIGURED',
      detail: '계정 삭제용 데이터베이스 설정이 아직 적용되지 않았습니다.',
    });
  });
});
