import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/shared/config/env";
import type { Database } from "@/shared/types/database.types";

export function createClient() {
  const { publishableKey, url } = getSupabaseEnv();

  return createBrowserClient<Database>(url, publishableKey);
}
