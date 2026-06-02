"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function requireEnv(name) {
    const value = process.env[name];
    if (value === undefined || value === null || value.trim() === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
exports.default = () => {
    const url = requireEnv('SUPABASE_URL');
    const anonKey = requireEnv('SUPABASE_ANON_KEY');
    const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
    const databaseUrl = requireEnv('DATABASE_URL');
    const nodeEnv = requireEnv('NODE_ENV');
    const openAiApiKey = requireEnv('OPENAI_API_KEY');
    return {
        supabase: {
            url,
            anonKey,
            serviceRoleKey,
        },
        database: {
            url: databaseUrl,
        },
        openai: {
            apiKey: openAiApiKey,
        },
        app: {
            nodeEnv,
        },
    };
};
//# sourceMappingURL=configuration.js.map