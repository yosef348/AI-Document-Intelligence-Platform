"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.organizations = (0, pg_core_1.pgTable)('organizations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    plan: (0, pg_core_1.text)('plan').notNull().default('starter'),
    status: (0, pg_core_1.text)('status').notNull().default('active'),
    stripeCustomerId: (0, pg_core_1.text)('stripe_customer_id').unique(),
    billingEmail: (0, pg_core_1.text)('billing_email'),
    trialEndsAt: (0, pg_core_1.timestamp)('trial_ends_at', { withTimezone: true }),
    ssoEnabled: (0, pg_core_1.boolean)('sso_enabled').notNull().default(false),
    ssoProvider: (0, pg_core_1.text)('sso_provider'),
    allowedEmailDomains: (0, pg_core_1.text)('allowed_email_domains')
        .array()
        .notNull()
        .default([]),
    maxMembers: (0, pg_core_1.integer)('max_members').notNull().default(10),
    maxDocuments: (0, pg_core_1.integer)('max_documents').notNull().default(500),
    settings: (0, pg_core_1.jsonb)('settings').notNull().default({}),
    createdBy: (0, pg_core_1.uuid)('created_by'),
    updatedBy: (0, pg_core_1.uuid)('updated_by'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});
//# sourceMappingURL=organizations.js.map