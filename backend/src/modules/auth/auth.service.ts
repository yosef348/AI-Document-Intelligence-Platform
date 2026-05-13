import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { profiles } from '../../database/schema/profiles';
import type { Config } from '../../config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly config: ConfigService<Config, true>,
  ) {}

  async getProfile(userId: string): Promise<typeof profiles.$inferSelect | null> {
    const db = this.dbService.db;
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId));
    return profile ?? null;
  }
}
