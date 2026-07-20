import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Api, ApiRequestError } from '@/shared/lib/api/api';

const responseSchema = z.object({ ok: z.literal(true) });

describe('Api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('validates and returns a successful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(Api.get('/example', responseSchema)).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith('/api/example', { method: 'GET' });
  });

  it('preserves a valid standard error response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            type: 'about:blank',
            title: 'UNAUTHORIZED',
            status: 401,
            detail: '로그인이 필요합니다.',
            timestamp: '2026-07-20T00:00:00.000Z',
            path: '/api/example',
          }),
          { status: 401, statusText: 'Unauthorized' },
        ),
      ),
    );

    const error = await Api.get('/example', responseSchema).catch((caught) => caught);

    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.body).toMatchObject({ title: 'UNAUTHORIZED', status: 401 });
  });

  it('normalizes a malformed upstream error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('not-json', { status: 502, statusText: 'Bad Gateway' })),
    );

    const error = await Api.get('/example', responseSchema).catch((caught) => caught);

    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.body).toMatchObject({
      type: 'about:blank',
      title: 'HTTP_ERROR',
      status: 502,
      detail: 'Bad Gateway',
      path: '/example',
    });
  });
});
