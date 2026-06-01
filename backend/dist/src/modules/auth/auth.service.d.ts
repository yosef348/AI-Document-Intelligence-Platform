import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { profiles } from '../../database/schema/profiles';
import type { Config } from '../../config/configuration';
export declare class AuthService {
    private readonly dbService;
    private readonly config;
    constructor(dbService: DatabaseService, config: ConfigService<Config, true>);
    getProfile(userId: string): Promise<typeof profiles.$inferSelect | null>;
}
