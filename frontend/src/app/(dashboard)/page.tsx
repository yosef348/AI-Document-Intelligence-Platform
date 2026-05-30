'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, AlertTriangle, ShieldAlert, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import { useOrganization } from '../../hooks/use-organization';
import { StatCard } from '../../components/shared/stat-card';
import { RecentFindingsTable } from '../../components/dashboard/recent-findings-table';
import { CreateOrgPrompt } from '../../components/dashboard/create-org-prompt';
import type { Finding, FindingsStats } from '@/types';

export default function DashboardPage(): React.JSX.Element {
  const { session } = useAuth();
  const { hasOrganization, organizationId } = useOrganization();

  const [stats, setStats] = useState<FindingsStats | null>(null);
  const [recent, setRecent] = useState<Finding[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load(): Promise<void> {
      if (!session || !organizationId) return;
      setIsLoading(true);
      try {
        const token = session.access_token;

        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/findings/stats?organizationId=${organizationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;

        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData: FindingsStats = await statsRes.json();
        setStats(statsData);

        const listRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/findings?organizationId=${organizationId}&status=open&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!listRes.ok) throw new Error('Failed to fetch findings');
        const listData: Finding[] = await listRes.json();
        setRecent(listData.slice(0, 5));
      } catch (err) {
        setError((err as Error).message ?? 'Failed to load dashboard');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    if (hasOrganization) load();

    return () => {
      mounted = false;
    };
  }, [session, organizationId, hasOrganization]);

  const today = format(new Date(), 'MMMM d, yyyy');

  if (!hasOrganization) {
    return <CreateOrgPrompt />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Documents" value={0} icon={FileText} isLoading={isLoading} />
        <StatCard title="Total Findings" value={stats?.total ?? 0} icon={AlertTriangle} isLoading={isLoading} />
        <StatCard title="Critical" value={stats?.critical ?? 0} icon={ShieldAlert} isLoading={isLoading} variant="critical" />
        <StatCard title="Open Issues" value={stats?.open ?? 0} icon={Clock} isLoading={isLoading} variant="warning" />
      </div>

      <div className="bg-card p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Recent Findings</h3>
          <a href="/dashboard/findings" className="text-sm text-primary hover:underline">View all</a>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-muted/40 rounded animate-pulse" />
            <div className="h-8 bg-muted/40 rounded animate-pulse" />
            <div className="h-8 bg-muted/40 rounded animate-pulse" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          <RecentFindingsTable findings={recent ?? []} />
        )}
      </div>
    </div>
  );
}


