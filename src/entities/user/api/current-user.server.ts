import "server-only";

import { Api } from '@/shared/lib/api/api';
import { getCookies } from '@/shared/lib/api/get-cookies';
import { getOrigin } from '@/shared/lib/supabase/server';

import { CurrentUserResponseSchema } from '../model/current-user.schemas';

export async function getCurrentUserServer() {
  const [cookie, origin] = await Promise.all([getCookies(), getOrigin()]);
  return Api.get('/profile', CurrentUserResponseSchema, {
    baseUrl: origin,
    cache: 'no-store',
    headers: { cookie },
  });
}
