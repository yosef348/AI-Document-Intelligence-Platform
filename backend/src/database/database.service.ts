import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import type { Config } from '../config/configuration';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private client: ReturnType<typeof postgres>;
  public db: PostgresJsDatabase<typeof schema>;

  constructor(private readonly config: ConfigService<Config, true>) {}

  onModuleInit(): void {
    const url = this.config.get('database.url', { infer: true });

    this.client = postgres(url, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    this.db = drizzle(this.client, {
      schema,
      logger: this.config.get('app.nodeEnv', { infer: true }) === 'development',
    });

    this.logger.log('Database connection established');
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.end();
    this.logger.log('Database connection closed');
  }
}