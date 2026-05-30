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
    port: number;
    frontendUrl: string;
  };
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === null || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnv(name: string, defaultValue?: string): string {
  const value = process.env[name];
  return (value && value.trim()) || defaultValue || '';
}

export default (): Config => {
  const url = requireEnv('SUPABASE_URL');
  const anonKey = requireEnv('SUPABASE_ANON_KEY');
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const databaseUrl = requireEnv('DATABASE_URL');
  const nodeEnv = requireEnv('NODE_ENV');
  const openAiApiKey = requireEnv('OPENAI_API_KEY');
  const port = parseInt(getOptionalEnv('PORT', '3001'), 10);
  const frontendUrl = getOptionalEnv('FRONTEND_URL', 'http://localhost:3000');

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
      port,
      frontendUrl,
    },
  };
};
