const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

const DEFAULT_PORT = 3001;

const parsePort = (raw: string | undefined): number => {
  if (raw === undefined || raw.trim() === '') return DEFAULT_PORT;
  const n = Number.parseInt(raw, 10);
  if (!Number.isInteger(n) || n <= 0) return DEFAULT_PORT;
  return n;
};

export default () => ({
  app: {
    port: parsePort(process.env.PORT),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    jwtSecret: required('JWT_SECRET'),
  },
  database: {
    url: required('DATABASE_URL'),
  },
  supabase: {
    url: required('SUPABASE_URL'),
    anonKey: required('SUPABASE_ANON_KEY'),
    serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  },
  openai: {
    apiKey: required('OPENAI_API_KEY'),
  },
});

export type Config = ReturnType<(typeof import('./configuration'))['default']>;
