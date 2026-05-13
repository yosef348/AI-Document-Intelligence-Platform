export type Config = {
  supabase: {
    url: string;
    anonKey: string;
  };
};

export default (): Config => ({
  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    anonKey: process.env.SUPABASE_ANON_KEY ?? '',
  },
});
