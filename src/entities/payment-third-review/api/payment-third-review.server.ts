import 'server-only';

import { getPaymentThirdReviewDetail } from './get-payment-third-review-detail';
import { getPaymentThirdReviewHome } from './get-payment-third-review-home';
import { getPaymentThirdReviewList } from './get-payment-third-review-list';
import { getActivePaymentSavingGoal } from './get-active-payment-saving-goal';
import type { PaymentThirdReviewListQuery } from './payment-third-review-list.schema';
import { createServer } from '@/shared/lib/supabase/server';

export async function getPaymentThirdReviewDetailServer(id: string) {
  const { supabase, userId } = await getAuthenticatedPaymentReviewClient();
  const result = await getPaymentThirdReviewDetail(supabase, userId, id);

  if (!result.ok) {
    if (result.reason === 'not_found') {
      return null;
    }

    throw new Error(result.errorMessage);
  }

  return { ok: true as const, item: result.item };
}

export async function getPaymentThirdReviewListServer(query: PaymentThirdReviewListQuery) {
  const { supabase, userId } = await getAuthenticatedPaymentReviewClient();
  const result = await getPaymentThirdReviewList(supabase, userId, query);

  if (!result.ok) {
    throw new Error(result.errorMessage);
  }

  return {
    ok: true as const,
    items: result.items,
    pagination: result.pagination,
  };
}

export async function getPaymentThirdReviewHomeServer() {
  const { supabase, userId } = await getAuthenticatedPaymentReviewClient();
  const result = await getPaymentThirdReviewHome(supabase, userId);

  if (!result.ok) {
    throw new Error(result.errorMessage);
  }

  return result.data;
}

export async function getActivePaymentSavingGoalServer() {
  const { supabase, userId } = await getAuthenticatedPaymentReviewClient();
  const result = await getActivePaymentSavingGoal(supabase, userId);

  if (!result.ok) {
    throw new Error(result.errorMessage);
  }

  return { ok: true as const, item: result.item };
}

async function getAuthenticatedPaymentReviewClient() {
  const supabase = await createServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('로그인이 필요한 요청입니다.');
  }

  return { supabase, userId: data.user.id };
}
