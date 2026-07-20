import { z } from 'zod';

import { apiError } from '@/shared/lib/api/api-error';

function getValidationDetail(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'request'}: ${issue.message}`)
    .join(', ');
}

export async function parseJsonBody<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      success: false as const,
      response: apiError(request, 'INVALID_JSON', 400, '요청 본문이 올바른 JSON이 아닙니다.'),
    } as const;
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    return {
      success: false as const,
      response: apiError(request, 'VALIDATION_ERROR', 400, getValidationDetail(result.error)),
    } as const;
  }

  return { success: true as const, data: result.data };
}
