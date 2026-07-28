import type { SupabaseClient } from '@supabase/supabase-js';

import type { PaymentSavingGoal } from './payment-saving-goal.schema';
import type { Database, Tables } from '@/shared/types/database.types';

type PaymentSavingGoalRow = Pick<
  Tables<'payment_saving_goals'>,
  'id' | 'name' | 'current_saved_amount_krw' | 'target_amount_krw'
>;

type GetActivePaymentSavingGoalResult =
  | { ok: true; item: PaymentSavingGoal | null }
  | { ok: false; errorMessage: string };

export async function getActivePaymentSavingGoal(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<GetActivePaymentSavingGoalResult> {
  const { data, error } = await supabase
    .from('payment_saving_goals')
    .select('id,name,current_saved_amount_krw,target_amount_krw')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { ok: false, errorMessage: error.message };
  }

  if (!data) {
    return { ok: true, item: null };
  }

  const goal = data satisfies PaymentSavingGoalRow;

  return {
    ok: true,
    item: {
      id: goal.id,
      name: goal.name,
      currentSavedAmountKrw: goal.current_saved_amount_krw,
      targetAmountKrw: goal.target_amount_krw,
    },
  };
}
