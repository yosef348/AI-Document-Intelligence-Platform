"use client";

import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth.store';

export function useAuth() {
  const store = useAuthStore();
  const supabase = createClient();

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    store.clear();
  };

  return {
    user: store.user,
    session: store.session,
    organization: store.organization,
    isLoading: store.isLoading,
    signOut,
  };
}

