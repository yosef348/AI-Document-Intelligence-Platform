'use client';

import React from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { StatusSelect } from './status-select';
import { formatFindingType, formatConfidence, formatRelativeTime } from '@/lib/utils/format';
import type { Finding } from '@/types';

interface FindingsTableProps {
  findings: Finding[];
  isLoading: boolean;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onViewDetail: (finding: Finding) => void;
}

export function FindingsTable({ findings, isLoading, onStatusChange, onViewDetail }: FindingsTableProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
              <th className="py-2 px-4">Severity</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Document</th>
              <th className="py-2 px-4">Confidence</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                <td className="py-3 px-4"><Skeleton className="h-4 w-64" /></td>
                <td className="py-3 px-4"><Skeleton className="h-4 w-40" /></td>
                <td className="py-3 px-4"><Skeleton className="h-4 w-12" /></td>
                <td className="py-3 px-4"><Skeleton className="h-6 w-20" /></td>
                <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                <td className="py-3 px-4"><Skeleton className="h-8 w-8" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!findings || findings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle size={48} className="mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">No findings match your filters</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
            <th className="py-2 px-4">Severity</th>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Document</th>
            <th className="py-2 px-4">Confidence</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((finding) => (
            <tr key={finding.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4">
                <SeverityBadge severity={finding.severity} />
              </td>
              <td className="py-3 px-4">
                <div className="max-w-xs">
                  <button
                    onClick={() => onViewDetail(finding)}
                    className="text-sm font-medium text-primary hover:underline text-left truncate"
                  >
                    {finding.title}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    {formatFindingType(finding.findingType)}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-muted-foreground truncate max-w-xs">
                  Document
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${parseFloat(finding.confidence) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatConfidence(finding.confidence)}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <StatusSelect
                  currentStatus={finding.status}
                  onStatusChange={(status) => onStatusChange(finding.id, status)}
                />
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(finding.createdAt)}
                </span>
              </td>
              <td className="py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetail(finding)}
                >
                  <Eye size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



