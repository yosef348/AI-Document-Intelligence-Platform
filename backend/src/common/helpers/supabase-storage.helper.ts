import { createClient, SupabaseClient } from '@supabase/supabase-js';

let storageClient: SupabaseClient | null = null;

export function getStorageClient(
  url: string,
  serviceRoleKey: string,
): SupabaseClient {
  if (!storageClient) {
    storageClient = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return storageClient;
}
