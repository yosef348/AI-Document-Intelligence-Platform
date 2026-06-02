"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findings = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const organizations_1 = require("./organizations");
const documents_1 = require("./documents");
const ai_runs_1 = require("./ai-runs");
exports.findings = (0, pg_core_1.pgTable)('findings', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)('organization_id')
        .notNull()
        .references(() => organizations_1.organizations.id, { onDelete: 'cascade' }),
    documentId: (0, pg_core_1.uuid)('document_id')
        .notNull()
        .references(() => documents_1.documents.id, { onDelete: 'cascade' }),
    aiRunId: (0, pg_core_1.uuid)('ai_run_id').references(() => ai_runs_1.aiRuns.id, {
        onDelete: 'set null',
    }),
    findingType: (0, pg_core_1.text)('finding_type').notNull(),
    category: (0, pg_core_1.text)('category'),
    severity: (0, pg_core_1.text)('severity').notNull(),
    confidence: (0, pg_core_1.numeric)('confidence', { precision: 4, scale: 3 }).notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('open'),
    title: (0, pg_core_1.text)('title').notNull(),
    summary: (0, pg_core_1.text)('summary').notNull(),
    explanation: (0, pg_core_1.text)('explanation'),
    evidence: (0, pg_core_1.jsonb)('evidence').notNull().default({}),
    location: (0, pg_core_1.jsonb)('location'),
    promptVersion: (0, pg_core_1.text)('prompt_version'),
    modelVersion: (0, pg_core_1.text)('model_version'),
    modelProvider: (0, pg_core_1.text)('model_provider'),
    createdBy: (0, pg_core_1.uuid)('created_by'),
    acknowledgedBy: (0, pg_core_1.uuid)('acknowledged_by'),
    resolvedBy: (0, pg_core_1.uuid)('resolved_by'),
    deletedBy: (0, pg_core_1.uuid)('deleted_by'),
    acknowledgedAt: (0, pg_core_1.timestamp)('acknowledged_at', { withTimezone: true }),
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at', { withTimezone: true }),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, () => [
    (0, pg_core_1.check)('findings_confidence_range_check', drizzle_orm_1.sql.raw('confidence >= 0 AND confidence <= 1')),
]);
//# sourceMappingURL=findings.js.map