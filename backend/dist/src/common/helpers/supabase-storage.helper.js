"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageClient = getStorageClient;
const supabase_js_1 = require("@supabase/supabase-js");
function getStorageClient(configService) {
    const url = configService.get('supabase.url', { infer: true });
    const serviceRoleKey = configService.get('supabase.serviceRoleKey', {
        infer: true,
    });
    if (!url || !serviceRoleKey) {
        throw new Error('Supabase storage configuration is missing');
    }
    return (0, supabase_js_1.createClient)(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
//# sourceMappingURL=supabase-storage.helper.js.map