import {
    pgTable,
    uuid,
    text,
    integer,
    jsonb,
    timestamp,
  } from 'drizzle-orm/pg-core';
  import { documents } from './documents';
  import { organizations } from './organizations';
  
  export const chunks = pgTable('chunks', {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    documentId: uuid('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    chunkIndex: integer('chunk_index').notNull(),
    pageNumber: integer('page_number'),
    sectionTitle: text('section_title'),
    chunkText: text('chunk_text').notNull(),
    tokenCount: integer('token_count').notNull(),
    chunkStrategy: text('chunk_strategy').notNull().default('fixed_512_overlap_50'),
    overlapTokens: integer('overlap_tokens').notNull().default(50),
    metadata: jsonb('metadata').notNull().default({}),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  });
  
  export type Chunk = typeof chunks.$inferSelect;
  export type NewChunk = typeof chunks.$inferInsert;