"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const chunks_1 = require("./chunks");
const organizations_1 = require("./organizations");
const vector = (0, pg_core_1.customType)({
    dataType(config) {
        const dim = config?.dimensions;
        return dim != null ? `vector(${dim})` : 'vector';
    },
    toDriver(value) {
        return `[${value.join(',')}]`;
    },
    fromDriver(value) {
        return value.slice(1, -1).split(',').map(Number);
    },
});
exports.embeddings = (0, pg_core_1.pgTable)('embeddings', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)('organization_id')
        .notNull()
        .references(() => organizations_1.organizations.id, { onDelete: 'cascade' }),
    chunkId: (0, pg_core_1.uuid)('chunk_id')
        .notNull()
        .references(() => chunks_1.chunks.id, { onDelete: 'cascade' }),
    model: (0, pg_core_1.text)('model').notNull(),
    modelVersion: (0, pg_core_1.text)('model_version').notNull().default('latest'),
    provider: (0, pg_core_1.text)('provider').notNull().default('openai'),
    dimensions: (0, pg_core_1.integer)('dimensions').notNull().default(1536),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    embeddingLatencyMs: (0, pg_core_1.integer)('embedding_latency_ms'),
    tokenCount: (0, pg_core_1.integer)('token_count'),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => ({
    chunkModelUnique: (0, pg_core_1.uniqueIndex)('embeddings_chunk_model_unique').on(table.chunkId, table.model, table.modelVersion),
}));
//# sourceMappingURL=embeddings.js.map