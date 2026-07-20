import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createServer } from '@/shared/lib/supabase/server';
import { getUser } from '@/shared/lib/api/get-user';

vi.mock('@/shared/lib/supabase/server', () => ({
  createServer: vi.fn(),
}));

const createServerMock = vi.mocked(createServer);

describe('getUser', () => {
  beforeEach(() => {
    createServerMock.mockReset();
  });

  it('returns an authenticated user and scoped Supabase client', async () => {
    const user = { id: 'user-1' };
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
      },
    };
    createServerMock.mockResolvedValue(supabase as never);

    const result = await getUser(new Request('http://localhost/api/example'));

    expect(result).toEqual({ ok: true, supabase, user });
  });

  it('returns a standard 401 response when no session exists', async () => {
    createServerMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as never);

    const result = await getUser(new Request('http://localhost/api/example'));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(401);
      await expect(result.response.json()).resolves.toMatchObject({
        title: 'UNAUTHORIZED',
        status: 401,
        path: '/api/example',
      });
    }
  });

  it('returns 401 when Supabase rejects an invalid token', async () => {
    createServerMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'invalid JWT' },
        }),
      },
    } as never);

    const result = await getUser(new Request('http://localhost/api/example'));

    expect(result.ok || result.response.status).toBe(401);
  });
});
