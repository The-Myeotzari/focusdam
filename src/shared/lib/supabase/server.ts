import type { Database } from '@/shared/types/database.types';
import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { getSiteEnv, getSupabaseEnv } from '@/shared/config/env';

export async function createServer() {
  const { publishableKey, url } = getSupabaseEnv();

  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Route Handlers can.
        }
      },
    },
  });
}

export const createClient = createServer;

export async function getOrigin() {
  const headerStore = await headers();
  const protocol = headerStore.get('x-forwarded-proto') ?? 'http';
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host');

  if (host) {
    return `${protocol}://${host}`;
  }

  return getSiteEnv().siteUrl;
}
