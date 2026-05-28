import { createClient, SupabaseClient } from '@supabase/supabase-js';

let storageClient: SupabaseClient | null = null;
let lastStorageUrl: string | null = null;
let lastServiceRoleKey: string | null = null;

export function getStorageClient(
  url: string,
  serviceRoleKey: string,
): SupabaseClient {
  // Recreate client if not initialized or credentials changed
  if (
    !storageClient ||
    lastStorageUrl !== url ||
    lastServiceRoleKey !== serviceRoleKey
  ) {
    storageClient = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastStorageUrl = url;
    lastServiceRoleKey = serviceRoleKey;
  }
  return storageClient;
}
