"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { SeverityBadge } from '@/components/shared/severity-badge';
import type { Finding } from '@/types';

interface Props {
  findings: Finding[];
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export function RecentFindingsTable({ findings }: Props): React.JSX.Element {
  if (!findings || findings.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <div className="flex items-center justify-center mb-3">
          <CheckCircle size={28} className="text-primary" />
        </div>
        <div className="text-sm">No open findings. Your documents look clean.</div>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
            <th className="py-2">Severity</th>
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((f) => (
            <tr key={f.id} className="border-b border-border/40">
              <td className="py-3 align-top"><SeverityBadge severity={f.severity} /></td>
              <td className="py-3 align-top max-w-xl truncate">{f.title.length > 60 ? `${f.title.slice(0, 57)}...` : f.title}</td>
              <td className="py-3 align-top"><span className="text-sm capitalize">{f.status.replace('_', ' ')}</span></td>
              <td className="py-3 align-top text-sm">{formatDate(f.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

