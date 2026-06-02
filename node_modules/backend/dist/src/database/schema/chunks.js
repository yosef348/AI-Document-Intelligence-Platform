"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunks = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const documents_1 = require("./documents");
const organizations_1 = require("./organizations");
exports.chunks = (0, pg_core_1.pgTable)('chunks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)('organization_id')
        .notNull()
        .references(() => organizations_1.organizations.id, { onDelete: 'cascade' }),
    documentId: (0, pg_core_1.uuid)('document_id')
        .notNull()
        .references(() => documents_1.documents.id, { onDelete: 'cascade' }),
    chunkIndex: (0, pg_core_1.integer)('chunk_index').notNull(),
    pageNumber: (0, pg_core_1.integer)('page_number'),
    sectionTitle: (0, pg_core_1.text)('section_title'),
    chunkText: (0, pg_core_1.text)('chunk_text').notNull(),
    tokenCount: (0, pg_core_1.integer)('token_count').notNull(),
    chunkStrategy: (0, pg_core_1.text)('chunk_strategy')
        .notNull()
        .default('fixed_512_overlap_50'),
    overlapTokens: (0, pg_core_1.integer)('overlap_tokens').notNull().default(50),
    metadata: (0, pg_core_1.jsonb)('metadata').notNull().default({}),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => ({
    documentChunkIndexUnique: (0, pg_core_1.uniqueIndex)('chunks_document_id_chunk_index_unique').on(table.documentId, table.chunkIndex),
}));
//# sourceMappingURL=chunks.js.map