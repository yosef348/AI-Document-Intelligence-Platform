export type Config = {
    supabase: {
        url: string;
        anonKey: string;
        serviceRoleKey: string;
    };
    database: {
        url: string;
    };
    openai: {
        apiKey: string;
    };
    app: {
        nodeEnv: string;
    };
};
declare const _default: () => Config;
export default _default;
