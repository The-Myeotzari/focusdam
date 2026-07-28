import { NextResponse } from 'next/server';

import { getPaymentGoalAchievements } from '@/entities/payment-third-review/api/get-payment-goal-achievements';
import { apiError } from '@/shared/lib/api/api-error';
import { getUser } from '@/shared/lib/api/get-user';

export async function GET(request: Request) {
  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const result = await getPaymentGoalAchievements(auth.supabase, auth.user.id);

  if (!result.ok) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, result.errorMessage);
  }

  return NextResponse.json({ ok: true, items: result.items });
}
