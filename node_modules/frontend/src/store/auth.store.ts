'use client';

import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  maxMembers: number;
  maxDocuments: number;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  organization: Organization | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setOrganization: (org: Organization | null) => void;
  setIsLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  organization: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setOrganization: (organization) => set({ organization }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clear: () =>
    set({ user: null, session: null, organization: null, isLoading: false }),
}));

