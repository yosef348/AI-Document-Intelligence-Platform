import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import type { Config } from '../../config/configuration';
export declare function getStorageClient(configService: ConfigService<Config, true>): SupabaseClient;
