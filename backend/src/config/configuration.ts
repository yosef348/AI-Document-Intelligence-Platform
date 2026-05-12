import { resolve } from 'path';

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3001', 10),
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

export type Config = ReturnType<typeof import('./configuration')['default']>;