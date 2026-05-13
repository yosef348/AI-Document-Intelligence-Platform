export type Config = {
  supabase: {
    url: string;
    anonKey: string;
  };
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === null || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export default (): Config => {
  const url = requireEnv('SUPABASE_URL');
  const anonKey = requireEnv('SUPABASE_ANON_KEY');

  return {
    supabase: {
      url,
      anonKey,
    },
  };
};
