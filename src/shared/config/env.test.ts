import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getSiteEnv, getSupabaseEnv } from '@/shared/config/env';

const originalEnv = { ...process.env };

describe('environment configuration', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns validated Supabase variables', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'publishable-key';

    expect(getSupabaseEnv()).toEqual({
      url: 'https://example.supabase.co',
      publishableKey: 'publishable-key',
    });
  });

  it('fails closed when Supabase variables are missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => getSupabaseEnv()).toThrow('Supabase 환경변수 설정이 올바르지 않습니다.');
  });

  it('rejects an insecure remote Supabase URL', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'publishable-key';

    expect(() => getSupabaseEnv()).toThrow('Supabase URL은 HTTPS여야 합니다.');
  });

  it('uses an empty site URL when the optional variable is absent', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteEnv()).toEqual({ siteUrl: '' });
  });
});
