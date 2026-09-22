import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

/**
 * Service-role client. Bypasses RLS — server-only, never import from
 * a Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createAdminClient() {
  logger.warn("supabase:admin", "service-role client created (bypasses RLS)");

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
