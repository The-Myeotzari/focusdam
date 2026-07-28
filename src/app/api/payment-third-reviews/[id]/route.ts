import { NextResponse } from 'next/server';

import { getPaymentThirdReviewDetail } from '@/entities/payment-third-review/api/get-payment-third-review-detail';
import { PaymentThirdReviewIdSchema } from '@/entities/payment-third-review/api/payment-third-review-detail.schema';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const idResult = PaymentThirdReviewIdSchema.safeParse(id);

  if (!idResult.success) {
    return apiError(request, 'VALIDATION_ERROR', 400, idResult.error.issues[0]?.message);
  }

  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const result = await getPaymentThirdReviewDetail(auth.supabase, auth.user.id, idResult.data);

  if (!result.ok && result.reason === 'not_found') {
    return apiError(request, 'NOT_FOUND', 404, '결제 3심 내역을 찾을 수 없습니다.');
  }

  if (!result.ok) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, result.errorMessage);
  }

  return NextResponse.json({ ok: true, item: result.item });
}
