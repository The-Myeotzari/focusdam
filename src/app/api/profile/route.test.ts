import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { GET } from './route';

vi.mock('@/shared/lib/api/get-user', () => ({
  getUser: vi.fn(),
}));

const getUserMock = vi.mocked(getUser);

function createProfileQuery(profile: unknown, error: unknown = null) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: profile, error });
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  getUserMock.mockResolvedValue({
    ok: true,
    supabase: { from },
    user: { id: 'user-1' },
  } as never);

  return { eq, from, maybeSingle, select };
}

describe('GET /api/profile', () => {
  beforeEach(() => {
    getUserMock.mockReset();
  });

  it('returns the standard 401 response for an unauthenticated request', async () => {
    const request = new Request('http://localhost/api/profile');
    getUserMock.mockResolvedValue({
      ok: false,
      response: apiError(request, 'UNAUTHORIZED', 401, '로그인이 필요한 요청입니다.'),
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      title: 'UNAUTHORIZED',
      status: 401,
      path: '/api/profile',
    });
  });

  it('queries only the authenticated user profile', async () => {
    const query = createProfileQuery({
      display_name: '포커스',
      email: 'focus@example.com',
      social_provider: 'kakao',
    });

    const response = await GET(new Request('http://localhost/api/profile'));

    expect(query.from).toHaveBeenCalledWith('profiles');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      user: {
        name: '포커스',
        email: 'focus@example.com',
        socialProvider: 'kakao',
      },
    });
  });

  it('returns 404 when the authenticated user has no profile', async () => {
    createProfileQuery(null);

    const response = await GET(new Request('http://localhost/api/profile'));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      title: 'PROFILE_NOT_FOUND',
      status: 404,
    });
  });

  it('returns the standard 500 response when Supabase fails', async () => {
    createProfileQuery(null, { message: 'database unavailable' });

    const response = await GET(new Request('http://localhost/api/profile'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      title: 'INTERNAL_SERVER_ERROR',
      status: 500,
      detail: 'database unavailable',
    });
  });
});
