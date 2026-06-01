import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import type { Config } from '../config/configuration';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly logger;
    private client?;
    db: PostgresJsDatabase<typeof schema>;
    constructor(config: ConfigService<Config, true>);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
