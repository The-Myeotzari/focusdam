import {
  ActivePaymentSavingGoalResponseSchema,
  SavePaymentSavingGoalResponseSchema,
  type SavePaymentSavingGoalRequest,
} from './payment-saving-goal.schema';
import { Api } from '@/shared/lib/api/api';

export function getActivePaymentSavingGoalClient() {
  return Api.get('/payment-third-reviews/goal', ActivePaymentSavingGoalResponseSchema, {
    credentials: 'include',
  });
}

export function savePaymentSavingGoalClient(
  input: SavePaymentSavingGoalRequest,
  mode: 'create' | 'update',
) {
  const request = mode === 'create' ? Api.post : Api.patch;

  return request('/payment-third-reviews/goal', SavePaymentSavingGoalResponseSchema, {
    body: JSON.stringify(input),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
}
