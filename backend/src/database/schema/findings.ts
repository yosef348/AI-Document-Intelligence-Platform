import {
    pgTable,
    uuid,
    text,
    numeric,
    jsonb,
    timestamp,
  } from 'drizzle-orm/pg-core';
  import { organizations } from './organizations';
  import { documents } from './documents';
  import { aiRuns } from './ai-runs';
  
  export const findings = pgTable('findings', {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    documentId: uuid('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    aiRunId: uuid('ai_run_id')
      .references(() => aiRuns.id, { onDelete: 'set null' }),
    findingType: text('finding_type').notNull(),
    category: text('category'),
    severity: text('severity').notNull(),
    confidence: numeric('confidence', { precision: 4, scale: 3 }).notNull(),
    status: text('status').notNull().default('open'),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    explanation: text('explanation'),
    evidence: jsonb('evidence').notNull().default({}),
    location: jsonb('location'),
    promptVersion: text('prompt_version'),
    modelVersion: text('model_version'),
    modelProvider: text('model_provider'),
    createdBy: uuid('created_by'),
    acknowledgedBy: uuid('acknowledged_by'),
    resolvedBy: uuid('resolved_by'),
    deletedBy: uuid('deleted_by'),
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  });
  
  export type Finding = typeof findings.$inferSelect;
  export type NewFinding = typeof findings.$inferInsert;