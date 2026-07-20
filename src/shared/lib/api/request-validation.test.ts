import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { parseJsonBody } from '@/shared/lib/api/request-validation';

const schema = z.object({ name: z.string().min(1) });

describe('parseJsonBody', () => {
  it('returns validated data', async () => {
    const request = new Request('http://localhost/api/example', {
      method: 'POST',
      body: JSON.stringify({ name: 'focusdam' }),
    });

    await expect(parseJsonBody(request, schema)).resolves.toEqual({
      success: true,
      data: { name: 'focusdam' },
    });
  });

  it('returns the standard error schema for invalid JSON', async () => {
    const request = new Request('http://localhost/api/example', {
      method: 'POST',
      body: '{',
    });
    const result = await parseJsonBody(request, schema);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.response.status).toBe(400);
      await expect(result.response.json()).resolves.toMatchObject({
        type: 'about:blank',
        title: 'INVALID_JSON',
        status: 400,
        path: '/api/example',
      });
    }
  });

  it('returns field validation details', async () => {
    const request = new Request('http://localhost/api/example', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const result = await parseJsonBody(request, schema);

    expect(result.success).toBe(false);
    if (!result.success) {
      await expect(result.response.json()).resolves.toMatchObject({
        title: 'VALIDATION_ERROR',
        status: 400,
      });
    }
  });
});
