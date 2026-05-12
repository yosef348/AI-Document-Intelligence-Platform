import {
  pgTable,
  uuid,
  text,
  bigint,
  integer,
  jsonb,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const documents = pgTable(
  'documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    uploadedBy: uuid('uploaded_by').notNull(),
    deletedBy: uuid('deleted_by'),
    type: text('type').notNull(),
    filename: text('filename').notNull(),
    originalFilename: text('original_filename').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    pageCount: integer('page_count'),
    storageProvider: text('storage_provider').notNull().default('supabase'),
    storageBucket: text('storage_bucket').notNull().default('documents'),
    storagePath: text('storage_path').notNull(),
    storageVersion: text('storage_version'),
    checksum: text('checksum').notNull(),
    checksumAlgorithm: text('checksum_algorithm').notNull().default('sha256'),
    parsingStatus: text('parsing_status').notNull().default('pending'),
    processingStatus: text('processing_status').notNull().default('pending'),
    extractedMetadata: jsonb('extracted_metadata').notNull().default({}),
    metadata: jsonb('metadata').notNull().default({}),
    idempotencyKey: text('idempotency_key'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    retentionUntil: timestamp('retention_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    idempotencyKeyUnique: uniqueIndex('documents_idempotency_key_unique').on(
      table.idempotencyKey,
    ),
  }),
);

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
