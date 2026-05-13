import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import type { Config } from '../../config/configuration';

export function getStorageClient(configService: ConfigService<Config, true>): SupabaseClient {
  const url = configService.get('supabase.url', { infer: true });
  const serviceRoleKey = configService.get('supabase.serviceRoleKey', { infer: true });

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase storage configuration is missing');
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
