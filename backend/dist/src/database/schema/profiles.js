"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profiles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.profiles = (0, pg_core_1.pgTable)('profiles', {
    id: (0, pg_core_1.uuid)('id').primaryKey(),
    email: (0, pg_core_1.text)('email'),
    fullName: (0, pg_core_1.text)('full_name'),
    avatarUrl: (0, pg_core_1.text)('avatar_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});
//# sourceMappingURL=profiles.js.map