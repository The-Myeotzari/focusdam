import { NextResponse } from 'next/server';

import { createPaymentThirdReview } from '@/entities/payment-third-review/api/create-payment-third-review';
import { getPaymentThirdReviewList } from '@/entities/payment-third-review/api/get-payment-third-review-list';
import { CreatePaymentThirdReviewRequestSchema } from '@/entities/payment-third-review/api/payment-third-review-create.schema';
import { PaymentThirdReviewListQuerySchema } from '@/entities/payment-third-review/api/payment-third-review-list.schema';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { parseJsonBody } from '@/shared/lib/api/request-validation';

export async function POST(request: Request) {
  const body = await parseJsonBody(request, CreatePaymentThirdReviewRequestSchema);

  if (!body.success) {
    return body.response;
  }

  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const result = await createPaymentThirdReview(
    auth.supabase,
    auth.user.id,
    body.data,
  );

  if (!result.ok) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, result.errorMessage);
  }

  return NextResponse.json({ ok: true, item: result.item }, { status: 201 });
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const queryResult = PaymentThirdReviewListQuerySchema.safeParse({
    outcomeType: searchParams.get('outcomeType') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    size: searchParams.get('size') ?? undefined,
  });

  if (!queryResult.success) {
    return apiError(
      request,
      'VALIDATION_ERROR',
      400,
      queryResult.error.issues
        .map((issue) => `${issue.path.join('.') || 'query'}: ${issue.message}`)
        .join(', '),
    );
  }

  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const result = await getPaymentThirdReviewList(auth.supabase, auth.user.id, queryResult.data);

  if (!result.ok) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, result.errorMessage);
  }

  return NextResponse.json({
    ok: true,
    items: result.items,
    pagination: result.pagination,
  });
}
