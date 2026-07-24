import { ActivePaymentSavingGoalResponseSchema } from './payment-saving-goal.schema';
import { Api } from '@/shared/lib/api/api';

export function getActivePaymentSavingGoalClient() {
  return Api.get('/payment-third-reviews/goal', ActivePaymentSavingGoalResponseSchema, {
    credentials: 'include',
  });
}
