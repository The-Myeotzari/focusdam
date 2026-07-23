import { NextResponse } from 'next/server';

import { completePaymentThirdReviewReminder } from '@/entities/payment-third-review/api/complete-payment-third-review-reminder';
import { PaymentThirdReviewIdSchema } from '@/entities/payment-third-review/api/payment-third-review-detail.schema';
import { CompletePaymentThirdReviewReminderRequestSchema } from '@/entities/payment-third-review/api/payment-third-review-reminder.schema';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { parseJsonBody } from '@/shared/lib/api/request-validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const idResult = PaymentThirdReviewIdSchema.safeParse(id);

  if (!idResult.success) {
    return apiError(request, 'VALIDATION_ERROR', 400, idResult.error.issues[0]?.message ?? '');
  }

  const bodyResult = await parseJsonBody(request, CompletePaymentThirdReviewReminderRequestSchema);

  if (!bodyResult.success) {
    return bodyResult.response;
  }

  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const result = await completePaymentThirdReviewReminder(
    auth.supabase,
    auth.user.id,
    idResult.data,
    bodyResult.data,
  );

  if (!result.ok) {
    if (result.reason === 'not_found' || result.reason === 'invalid_type') {
      return apiError(request, 'NOT_FOUND', 404, '리마인드 대상을 찾을 수 없습니다.');
    }

    if (result.reason === 'already_completed') {
      return apiError(request, 'ALREADY_COMPLETED', 409, '이미 리마인드 판단을 완료했습니다.');
    }

    if (result.reason === 'not_ready') {
      return apiError(request, 'NOT_READY', 409, '아직 리마인드 판단을 진행할 수 없습니다.');
    }

    if (result.reason === 'database_error') {
      return apiError(request, 'INTERNAL_SERVER_ERROR', 500, result.errorMessage);
    }

    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, '알 수 없는 오류가 발생했습니다.');
  }

  return NextResponse.json({ ok: true, item: result.item });
}
