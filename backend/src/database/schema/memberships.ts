import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const memberships = pgTable(
  'memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull(),
    role: text('role').notNull().default('analyst'),
    invitedBy: uuid('invited_by'),
    inviteToken: text('invite_token').unique(),
    inviteExpiresAt: timestamp('invite_expires_at', { withTimezone: true }),
    joinedAt: timestamp('joined_at', { withTimezone: true }),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userOrgUnique: uniqueIndex('memberships_user_org_unique').on(
      table.userId,
      table.organizationId,
    ),
  }),
);

export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
