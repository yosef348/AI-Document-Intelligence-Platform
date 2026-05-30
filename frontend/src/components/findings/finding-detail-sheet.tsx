'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { StatusSelect } from './status-select';
import { formatFindingType, formatConfidence, formatDate } from '@/lib/utils/format';
import type { Finding, FindingStatus } from '@/types';

interface FindingDetailSheetProps {
  finding: Finding | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => Promise<void>;
}

export function FindingDetailSheet({ finding, open, onClose, onStatusChange }: FindingDetailSheetProps): React.JSX.Element {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!finding) return <></>;

  const handleStatusChange = async (status: string): Promise<void> => {
    setIsUpdating(true);
    try {
      await onStatusChange(status);
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextActions = (): { label: string; status: FindingStatus }[] => {
    const actions: Record<FindingStatus, { label: string; status: FindingStatus }[]> = {
      open: [
        { label: 'Acknowledge', status: 'acknowledged' },
        { label: 'Dismiss', status: 'dismissed' },
      ],
      acknowledged: [
        { label: 'Mark In Review', status: 'in_review' },
        { label: 'Resolve', status: 'resolved' },
        { label: 'Dismiss', status: 'dismissed' },
      ],
      in_review: [
        { label: 'Resolve', status: 'resolved' },
        { label: 'Dismiss', status: 'dismissed' },
        { label: 'False Positive', status: 'false_positive' },
      ],
      resolved: [],
      dismissed: [],
      false_positive: [],
    };
    return actions[finding.status] || [];
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-full md:max-w-2xl overflow-y-auto">
        {/* Header */}
        <SheetHeader className="mb-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <SeverityBadge severity={finding.severity} />
            </div>
            <h2 className="text-2xl font-semibold">{finding.title}</h2>
            <p className="text-sm text-muted-foreground">
              {formatFindingType(finding.findingType)}
            </p>
          </div>
        </SheetHeader>

        {/* Status & Actions bar */}
        <div className="mb-6 pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Status:</span>
            <StatusSelect
              currentStatus={finding.status}
              onStatusChange={handleStatusChange}
              isLoading={isUpdating}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {getNextActions().map((action) => (
              <Button
                key={action.status}
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(action.status)}
                disabled={isUpdating}
              >
                {isUpdating && <Loader2 size={14} className="mr-1 animate-spin" />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {finding.summary}
          </p>
        </div>

        {/* Explanation section */}
        {finding.explanation && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Detailed Analysis</h3>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {finding.explanation}
            </div>
          </div>
        )}

        {/* Evidence section */}
        {finding.evidence?.extractedText && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Evidence</h3>
            <div className="bg-muted rounded p-4 font-mono text-xs leading-relaxed overflow-auto max-h-48">
              {finding.evidence.extractedText}
            </div>
          </div>
        )}

        {/* Location section */}
        {finding.location && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Location</h3>
            <div className="flex flex-wrap gap-2">
              {finding.location.section && (
                <Badge variant="outline">Section: {finding.location.section}</Badge>
              )}
              {finding.location.clause && (
                <Badge variant="outline">Clause: {finding.location.clause}</Badge>
              )}
              {finding.location.page && (
                <Badge variant="outline">Page {finding.location.page}</Badge>
              )}
            </div>
          </div>
        )}

        {/* AI Info section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Analysis Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {finding.modelVersion && (
              <div>
                <p className="text-xs text-muted-foreground">Model</p>
                <p className="text-sm font-medium">{finding.modelVersion}</p>
              </div>
            )}
            {finding.promptVersion && (
              <div>
                <p className="text-xs text-muted-foreground">Prompt</p>
                <p className="text-sm font-medium">{finding.promptVersion}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-sm font-medium">{formatConfidence(finding.confidence)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Detected</p>
              <p className="text-sm font-medium">{formatDate(finding.createdAt)}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}



