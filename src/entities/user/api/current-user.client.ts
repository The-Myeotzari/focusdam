import { Api } from '@/shared/lib/api/api';

import { CurrentUserResponseSchema } from '../model/current-user.schemas';

export async function getCurrentUserClient() {
  return Api.get('/profile', CurrentUserResponseSchema, {
    credentials: 'include',
  });
}
