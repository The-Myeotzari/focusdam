import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  PaymentSavingGoal,
  SavePaymentSavingGoalRequest,
} from './payment-saving-goal.schema';
import type { Database, Tables } from '@/shared/types/database.types';

type PaymentSavingGoalRow = Pick<
  Tables<'payment_saving_goals'>,
  'id' | 'name' | 'current_saved_amount_krw' | 'target_amount_krw'
>;

type SavePaymentSavingGoalResult =
  | { ok: true; item: PaymentSavingGoal }
  | {
      ok: false;
      reason: 'already_exists' | 'database_error' | 'not_found';
      errorMessage: string;
    };

const paymentSavingGoalColumns =
  'id,name,current_saved_amount_krw,target_amount_krw' as const;

export async function createPaymentSavingGoal(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: SavePaymentSavingGoalRequest,
): Promise<SavePaymentSavingGoalResult> {
  const { data, error } = await supabase
    .from('payment_saving_goals')
    .insert({
      user_id: userId,
      name: input.name,
      target_amount_krw: input.targetAmountKrw,
      status: 'active',
    })
    .select(paymentSavingGoalColumns)
    .single();

  if (error) {
    return {
      ok: false,
      reason: error.code === '23505' ? 'already_exists' : 'database_error',
      errorMessage: error.message,
    };
  }

  return { ok: true, item: mapPaymentSavingGoal(data satisfies PaymentSavingGoalRow) };
}

export async function updateActivePaymentSavingGoal(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: SavePaymentSavingGoalRequest,
): Promise<SavePaymentSavingGoalResult> {
  const { data, error } = await supabase
    .from('payment_saving_goals')
    .update({
      name: input.name,
      target_amount_krw: input.targetAmountKrw,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('status', 'active')
    .select(paymentSavingGoalColumns)
    .maybeSingle();

  if (error) {
    return { ok: false, reason: 'database_error', errorMessage: error.message };
  }

  if (!data) {
    return {
      ok: false,
      reason: 'not_found',
      errorMessage: '수정할 활성 목표를 찾을 수 없습니다.',
    };
  }

  return { ok: true, item: mapPaymentSavingGoal(data satisfies PaymentSavingGoalRow) };
}

function mapPaymentSavingGoal(goal: PaymentSavingGoalRow): PaymentSavingGoal {
  return {
    id: goal.id,
    name: goal.name,
    currentSavedAmountKrw: goal.current_saved_amount_krw,
    targetAmountKrw: goal.target_amount_krw,
  };
}
