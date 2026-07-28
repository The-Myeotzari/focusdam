import { NextResponse } from 'next/server';

import { getActivePaymentSavingGoal } from '@/entities/payment-third-review/api/get-active-payment-saving-goal';
import {
  createPaymentSavingGoal,
  updateActivePaymentSavingGoal,
} from '@/entities/payment-third-review/api/save-payment-saving-goal';
import { SavePaymentSavingGoalRequestSchema } from '@/entities/payment-third-review/api/payment-saving-goal.schema';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';
import { parseJsonBody } from '@/shared/lib/api/request-validation';

export async function GET(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const result = await getActivePaymentSavingGoal(auth.supabase, auth.user.id);

  if (!result.ok) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, result.errorMessage);
  }

  return NextResponse.json({ ok: true, item: result.item });
}

export async function POST(request: Request) {
  return saveGoal(request, 'create');
}

export async function PATCH(request: Request) {
  return saveGoal(request, 'update');
}

async function saveGoal(request: Request, mode: 'create' | 'update') {
  const body = await parseJsonBody(request, SavePaymentSavingGoalRequestSchema);

  if (!body.success) {
    return body.response;
  }

  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const result =
    mode === 'create'
      ? await createPaymentSavingGoal(auth.supabase, auth.user.id, body.data)
      : await updateActivePaymentSavingGoal(auth.supabase, auth.user.id, body.data);

  if (!result.ok) {
    if (result.reason === 'already_exists') {
      return apiError(request, 'CONFLICT', 409, '이미 활성 목표가 있습니다.');
    }

    if (result.reason === 'not_found') {
      return apiError(request, 'NOT_FOUND', 404, result.errorMessage);
    }

    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, result.errorMessage);
  }

  return NextResponse.json(
    { ok: true, item: result.item },
    { status: mode === 'create' ? 201 : 200 },
  );
}
