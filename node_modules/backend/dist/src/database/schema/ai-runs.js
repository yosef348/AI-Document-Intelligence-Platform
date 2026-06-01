"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRuns = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const organizations_1 = require("./organizations");
const documents_1 = require("./documents");
exports.aiRuns = (0, pg_core_1.pgTable)('ai_runs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)('organization_id')
        .notNull()
        .references(() => organizations_1.organizations.id, { onDelete: 'cascade' }),
    documentId: (0, pg_core_1.uuid)('document_id').references(() => documents_1.documents.id, {
        onDelete: 'set null',
    }),
    triggeredBy: (0, pg_core_1.uuid)('triggered_by'),
    modelName: (0, pg_core_1.text)('model_name').notNull(),
    modelProvider: (0, pg_core_1.text)('model_provider').notNull().default('openai'),
    promptVersion: (0, pg_core_1.text)('prompt_version').notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('queued'),
    tokenInput: (0, pg_core_1.integer)('token_input'),
    tokenOutput: (0, pg_core_1.integer)('token_output'),
    tokenCached: (0, pg_core_1.integer)('token_cached'),
    costTotal: (0, pg_core_1.numeric)('cost_total', { precision: 12, scale: 6 }),
    costCurrency: (0, pg_core_1.text)('cost_currency').notNull().default('USD'),
    latencyMs: (0, pg_core_1.integer)('latency_ms'),
    traceId: (0, pg_core_1.text)('trace_id'),
    graphState: (0, pg_core_1.jsonb)('graph_state').notNull().default({}),
    currentNode: (0, pg_core_1.text)('current_node'),
    rawOutput: (0, pg_core_1.jsonb)('raw_output'),
    error: (0, pg_core_1.text)('error'),
    attemptNumber: (0, pg_core_1.integer)('attempt_number').notNull().default(1),
    maxAttempts: (0, pg_core_1.integer)('max_attempts').notNull().default(3),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    startedAt: (0, pg_core_1.timestamp)('started_at', { withTimezone: true }),
    completedAt: (0, pg_core_1.timestamp)('completed_at', { withTimezone: true }),
});
//# sourceMappingURL=ai-runs.js.map