"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberships = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const organizations_1 = require("./organizations");
exports.memberships = (0, pg_core_1.pgTable)('memberships', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)('organization_id')
        .notNull()
        .references(() => organizations_1.organizations.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id').notNull(),
    role: (0, pg_core_1.text)('role').notNull().default('analyst'),
    invitedBy: (0, pg_core_1.uuid)('invited_by'),
    inviteToken: (0, pg_core_1.text)('invite_token').unique(),
    inviteExpiresAt: (0, pg_core_1.timestamp)('invite_expires_at', { withTimezone: true }),
    joinedAt: (0, pg_core_1.timestamp)('joined_at', { withTimezone: true }),
    createdBy: (0, pg_core_1.uuid)('created_by'),
    updatedBy: (0, pg_core_1.uuid)('updated_by'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => ({
    userOrgUnique: (0, pg_core_1.uniqueIndex)('memberships_user_org_unique').on(table.userId, table.organizationId),
}));
//# sourceMappingURL=memberships.js.map