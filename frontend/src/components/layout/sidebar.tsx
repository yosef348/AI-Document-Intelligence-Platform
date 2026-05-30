"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { useAuthStore } from '@/store/auth.store';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<any>; label: string }): React.JSX.Element {
  const pathname = usePathname();

  const isActive = pathname === href || pathname?.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        isActive ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'hover:bg-muted/50',
      )}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

export function Sidebar(): React.JSX.Element {
  const router = useRouter();
  const supabase = createClient();
  const user = useAuthStore((s) => s.user);
  const org = useAuthStore((s) => s.organization);
  const setOrganization = useAuthStore((s) => s.setOrganization);
  const clear = useAuthStore((s) => s.clear);

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    clear();
    router.push('/login');
  };

  const handleOrgChange = async (orgId: string): Promise<void> => {
    // fetch org by id from API
    const session = useAuthStore.getState().session;
    if (!session) return;
    try {
      const res = await fetch(`/api/organizations/${orgId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrganization(data);
      }
    } catch {}
  };

  return (
    <aside className="w-64 bg-sidebar-gradient border-r border-border/50 h-screen flex flex-col">
      <div className="p-6">
        <Logo size="md" />
      </div>

      <div className="px-4 pb-4">
        <div className="text-xs text-muted-foreground">Organization</div>
        <div className="mt-2">
          {org ? (
            <div className="flex items-center justify-between">
              <div className="font-medium">{org.name}</div>
              {/* simple select for switching orgs could be added */}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No organization</div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" />
        <NavItem href="/dashboard/documents" icon={FileText} label="Documents" />
        <NavItem href="/dashboard/findings" icon={AlertTriangle} label="Findings" />
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
              {user?.email?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="text-sm">
              <div className="font-medium truncate w-36">{user?.email ?? 'Unknown'}</div>
            </div>
          </div>

          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

