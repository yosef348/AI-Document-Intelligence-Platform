"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documents = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const organizations_1 = require("./organizations");
exports.documents = (0, pg_core_1.pgTable)('documents', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)('organization_id')
        .notNull()
        .references(() => organizations_1.organizations.id, { onDelete: 'cascade' }),
    uploadedBy: (0, pg_core_1.uuid)('uploaded_by').notNull(),
    deletedBy: (0, pg_core_1.uuid)('deleted_by'),
    type: (0, pg_core_1.text)('type').notNull(),
    filename: (0, pg_core_1.text)('filename').notNull(),
    originalFilename: (0, pg_core_1.text)('original_filename').notNull(),
    mimeType: (0, pg_core_1.text)('mime_type').notNull(),
    sizeBytes: (0, pg_core_1.bigint)('size_bytes', { mode: 'number' }).notNull(),
    pageCount: (0, pg_core_1.integer)('page_count'),
    storageProvider: (0, pg_core_1.text)('storage_provider').notNull().default('supabase'),
    storageBucket: (0, pg_core_1.text)('storage_bucket').notNull().default('documents'),
    storagePath: (0, pg_core_1.text)('storage_path').notNull(),
    storageVersion: (0, pg_core_1.text)('storage_version'),
    checksum: (0, pg_core_1.text)('checksum').notNull(),
    checksumAlgorithm: (0, pg_core_1.text)('checksum_algorithm').notNull().default('sha256'),
    parsingStatus: (0, pg_core_1.text)('parsing_status').notNull().default('pending'),
    processingStatus: (0, pg_core_1.text)('processing_status').notNull().default('pending'),
    extractedMetadata: (0, pg_core_1.jsonb)('extracted_metadata').notNull().default({}),
    metadata: (0, pg_core_1.jsonb)('metadata').notNull().default({}),
    idempotencyKey: (0, pg_core_1.text)('idempotency_key'),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at', { withTimezone: true }),
    archivedAt: (0, pg_core_1.timestamp)('archived_at', { withTimezone: true }),
    retentionUntil: (0, pg_core_1.timestamp)('retention_until', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => ({
    idempotencyKeyUnique: (0, pg_core_1.uniqueIndex)('documents_idempotency_key_unique').on(table.idempotencyKey),
}));
//# sourceMappingURL=documents.js.map