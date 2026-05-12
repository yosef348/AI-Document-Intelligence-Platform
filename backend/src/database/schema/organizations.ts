import {
    pgTable,
    uuid,
    text,
    boolean,
    integer,
    jsonb,
    timestamp,
  } from 'drizzle-orm/pg-core';
  
  export const organizations = pgTable('organizations', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    plan: text('plan').notNull().default('starter'),
    status: text('status').notNull().default('active'),
    stripeCustomerId: text('stripe_customer_id').unique(),
    billingEmail: text('billing_email'),
    trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
    ssoEnabled: boolean('sso_enabled').notNull().default(false),
    ssoProvider: text('sso_provider'),
    allowedEmailDomains: text('allowed_email_domains').array().notNull().default([]),
    maxMembers: integer('max_members').notNull().default(10),
    maxDocuments: integer('max_documents').notNull().default(500),
    settings: jsonb('settings').notNull().default({}),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  });
  
  export type Organization = typeof organizations.$inferSelect;
  export type NewOrganization = typeof organizations.$inferInsert;