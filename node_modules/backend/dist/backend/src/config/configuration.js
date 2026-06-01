"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    supabase: {
        url: process.env.SUPABASE_URL ?? '',
        anonKey: process.env.SUPABASE_ANON_KEY ?? '',
    },
});
//# sourceMappingURL=configuration.js.map