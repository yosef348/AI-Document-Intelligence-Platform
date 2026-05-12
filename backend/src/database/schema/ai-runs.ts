import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { documents } from './documents';

export const aiRuns = pgTable('ai_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  documentId: uuid('document_id').references(() => documents.id, {
    onDelete: 'set null',
  }),
  triggeredBy: uuid('triggered_by'),
  modelName: text('model_name').notNull(),
  modelProvider: text('model_provider').notNull().default('openai'),
  promptVersion: text('prompt_version').notNull(),
  status: text('status').notNull().default('queued'),
  tokenInput: integer('token_input'),
  tokenOutput: integer('token_output'),
  tokenCached: integer('token_cached'),
  costTotal: numeric('cost_total', { precision: 12, scale: 6 }),
  costCurrency: text('cost_currency').notNull().default('USD'),
  latencyMs: integer('latency_ms'),
  traceId: text('trace_id'),
  graphState: jsonb('graph_state').notNull().default({}),
  currentNode: text('current_node'),
  rawOutput: jsonb('raw_output'),
  error: text('error'),
  attemptNumber: integer('attempt_number').notNull().default(1),
  maxAttempts: integer('max_attempts').notNull().default(3),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export type AiRun = typeof aiRuns.$inferSelect;
export type NewAiRun = typeof aiRuns.$inferInsert;
