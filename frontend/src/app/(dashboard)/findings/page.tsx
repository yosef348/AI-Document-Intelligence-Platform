'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { FindingsFilter } from '@/components/findings/findings-filter';
import { FindingsTable } from '@/components/findings/findings-table';
import { FindingDetailSheet } from '@/components/findings/finding-detail-sheet';
import { useAuth } from '@/hooks/use-auth';
import { useOrganization } from '@/hooks/use-organization';
import type { Finding, FindingsStats } from '@/types';

export default function FindingsPage(): React.JSX.Element {
  const { session } = useAuth();
  const { organizationId } = useOrganization();

  const [findings, setFindings] = useState<Finding[]>([]);
  const [stats, setStats] = useState<FindingsStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<{ severity: string; status: string; search: string }>({
    severity: 'all',
    status: 'all',
    search: '',
  });

  const fetchStats = useCallback(async (): Promise<void> => {
    if (!session || !organizationId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/findings/stats?organizationId=${organizationId}`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (res.ok) {
        const data: FindingsStats = await res.json();
        setStats(data);
      }
    } catch {}
  }, [session, organizationId]);

  const fetchFindings = useCallback(async (): Promise<void> => {
    if (!session || !organizationId) return;

    try {
      const params = new URLSearchParams();
      params.append('organizationId', organizationId);

      if (filters.severity !== 'all') {
        params.append('severity', filters.severity);
      }
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/findings?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (res.ok) {
        const data: Finding[] = await res.json();
        setFindings(data);
      }
    } catch {}
  }, [session, organizationId, filters]);

  // Initial fetch
  useEffect(() => {
    let mounted = true;

    async function init(): Promise<void> {
      if (!session || !organizationId) return;
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchFindings()]);
      if (mounted) setIsLoading(false);
    }

    init();

    return () => {
      mounted = false;
    };
  }, [session, organizationId, fetchStats, fetchFindings]);

  const handleStatusChange = async (findingId: string, newStatus: string): Promise<void> => {
    if (!session || !organizationId) return;

    // Optimistic update
    setFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: newStatus as Finding['status'] } : f))
    );

    if (selectedFinding?.id === findingId) {
      setSelectedFinding({ ...selectedFinding, status: newStatus as Finding['status'] });
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/findings/${findingId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        // Refetch on error
        await fetchFindings();
        await fetchStats();
      }
    } catch {
      // Refetch on error
      await fetchFindings();
      await fetchStats();
    }
  };

  const handleViewDetail = (finding: Finding): void => {
    setSelectedFinding(finding);
    setDetailSheetOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Findings</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Critical"
          value={stats?.critical ?? 0}
          icon={ShieldAlert}
          isLoading={isLoading}
          variant="critical"
        />
        <StatCard
          title="High"
          value={stats?.high ?? 0}
          icon={AlertTriangle}
          isLoading={isLoading}
          variant="default"
        />
        <StatCard
          title="Medium"
          value={stats?.medium ?? 0}
          icon={AlertCircle}
          isLoading={isLoading}
          variant="default"
        />
        <StatCard
          title="Open"
          value={stats?.open ?? 0}
          icon={Clock}
          isLoading={isLoading}
          variant="warning"
        />
      </div>

      {/* Filter */}
      <FindingsFilter
        filters={filters}
        onChange={setFilters}
        totalCount={findings.length}
      />

      {/* Findings table */}
      <div className="mt-6 bg-card rounded-lg border border-border/50">
        <FindingsTable
          findings={findings}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onViewDetail={handleViewDetail}
        />
      </div>

      {/* Finding detail sheet */}
      <FindingDetailSheet
        finding={selectedFinding}
        open={detailSheetOpen}
        onClose={() => {
          setDetailSheetOpen(false);
          setSelectedFinding(null);
        }}
        onStatusChange={(status) =>
          selectedFinding ? handleStatusChange(selectedFinding.id, status) : Promise.resolve()
        }
      />
    </div>
  );
}


