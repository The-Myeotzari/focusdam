import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createServerClient } from '@supabase/ssr';
import { updateSession } from '@/shared/lib/supabase/proxy';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

const createServerClientMock = vi.mocked(createServerClient);

function mockClaims(claims: Record<string, unknown> | null) {
  createServerClientMock.mockReturnValue({
    auth: {
      getClaims: vi.fn().mockResolvedValue({ data: { claims } }),
    },
  } as never);
}

describe('updateSession', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'publishable-key';
    createServerClientMock.mockReset();
  });

  it('allows an unauthenticated public onboarding route', async () => {
    mockClaims(null);

    const response = await updateSession(new NextRequest('http://localhost/onboarding/account'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('redirects an unauthenticated protected page', async () => {
    mockClaims(null);

    const response = await updateSession(new NextRequest('http://localhost/settings?tab=account'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/onboarding/account?next=%2Fsettings%3Ftab%3Daccount',
    );
  });

  it('lets unauthenticated API requests reach their standard 401 handler', async () => {
    mockClaims(null);

    const response = await updateSession(new NextRequest('http://localhost/api/profile'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('allows an authenticated user to access a protected page', async () => {
    mockClaims({ sub: 'user-1' });

    const response = await updateSession(new NextRequest('http://localhost/settings'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });
});
