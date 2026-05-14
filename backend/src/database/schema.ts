import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable, primaryKey, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Drizzle table definitions for organizations and memberships
// Exporting actual table/column objects so callers can use eq(), isNotNull(), etc.

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  name: varchar('name', { length: 256 }).notNull(),
  createdBy: varchar('created_by', { length: 64 }).notNull(),
  updatedBy: varchar('updated_by', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const memberships = pgTable(
  'memberships',
  {
    organizationId: uuid('organization_id').notNull(),
    userId: varchar('user_id', { length: 64 }).notNull(),
    role: varchar('role', { length: 16 }).notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.organizationId, t.userId],
      name: 'memberships_pk',
    }),
    pk: primaryKey({ columns: [t.organizationId, t.userId], name: 'memberships_pk' }),
  }),
);

// Exported types inferred from the tables
export type Organization = typeof organizations.$inferSelect;
export type Membership = typeof memberships.$inferSelect;
