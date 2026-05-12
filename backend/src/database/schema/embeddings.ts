import {
    pgTable,
    uuid,
    text,
    integer,
    boolean,
    timestamp,
    uniqueIndex,
    customType,
  } from 'drizzle-orm/pg-core';
  import { chunks } from './chunks';
  import { organizations } from './organizations';
  
  // pgvector custom type
  const vector = customType<{ data: number[]; driverData: string }>({
    dataType(config) {
      return config ? `vector(${config})` : 'vector';
    },
    toDriver(value: number[]): string {
      return `[${value.join(',')}]`;
    },
    fromDriver(value: string): number[] {
      return value
        .slice(1, -1)
        .split(',')
        .map(Number);
    },
  });
  
  export const embeddings = pgTable('embeddings', {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    chunkId: uuid('chunk_id')
      .notNull()
      .references(() => chunks.id, { onDelete: 'cascade' }),
    model: text('model').notNull(),
    modelVersion: text('model_version').notNull().default('latest'),
    provider: text('provider').notNull().default('openai'),
    dimensions: integer('dimensions').notNull().default(1536),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    embeddingLatencyMs: integer('embedding_latency_ms'),
    tokenCount: integer('token_count'),
    isActive: boolean('is_active').notNull().default(true),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  }, (table) => ({
    chunkModelUnique: uniqueIndex('embeddings_chunk_model_unique')
      .on(table.chunkId, table.model, table.modelVersion),
  }));
  
  export type Embedding = typeof embeddings.$inferSelect;
  export type NewEmbedding = typeof embeddings.$inferInsert;