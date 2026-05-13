import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import type { Config } from '../config/configuration';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private client?: ReturnType<typeof postgres>;
  public db!: PostgresJsDatabase<typeof schema>;

  constructor(private readonly config: ConfigService<Config, true>) {}

  async onModuleInit(): Promise<void> {
    const url = this.config.get('database.url', { infer: true });

    this.client = postgres(url, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    try {
      await this.client`SELECT 1`;
    } catch (err) {
      this.logger.error('Database connectivity probe failed', err);
      await this.client.end({ timeout: 5 }).catch(() => undefined);
      this.client = undefined;
      throw err;
    }

    this.db = drizzle(this.client, {
      schema,
      logger: this.config.get('app.nodeEnv', { infer: true }) === 'development',
    });

    this.logger.log('Database connection established');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.logger.log('Database connection closed');
    }
  }
}
