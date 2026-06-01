"use client";

import React, { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth.store';
import type { Organization } from '@/types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const supabase = createClient();
  const setUser = useAuthStore((s) => s.setUser);
  const setSession = useAuthStore((s) => s.setSession);
  const setOrganization = useAuthStore((s) => s.setOrganization);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);

  useEffect(() => {
    let mounted = true;

    async function init(): Promise<void> {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session ?? null);
        setUser(session?.user ?? null);

        if (session) {
          // fetch organizations from API
          try {
            const res = await fetch('/api/organizations', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            if (res.ok) {
              const orgs: Organization[] = await res.json();
              if (orgs && orgs.length > 0) {
                setOrganization(orgs[0]);
              }
            }
          } catch {
            // ignore org fetch errors silently
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);

      if (session) {
        // refresh organizations when auth changes
        (async () => {
          try {
            const res = await fetch('/api/organizations', {
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (res.ok) {
              const orgs: Organization[] = await res.json();
              if (orgs && orgs.length > 0) setOrganization(orgs[0]);
            }
          } catch {}
        })();
      } else {
        setOrganization(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

