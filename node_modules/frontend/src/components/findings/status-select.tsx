'use client';

import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { FindingStatus } from '@/types';

interface StatusSelectProps {
  currentStatus: FindingStatus;
  onStatusChange: (status: string) => Promise<void>;
  isLoading?: boolean;
}

const statusColors: Record<FindingStatus, string> = {
  open: 'bg-blue-500/10 text-blue-700 border-blue-200',
  acknowledged: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  in_review: 'bg-purple-500/10 text-purple-700 border-purple-200',
  resolved: 'bg-green-500/10 text-green-700 border-green-200',
  dismissed: 'bg-slate-500/10 text-slate-700 border-slate-200',
  false_positive: 'bg-red-500/10 text-red-700 border-red-200',
};

const statusLabels: Record<FindingStatus, string> = {
  open: 'Open',
  acknowledged: 'Acknowledged',
  in_review: 'In Review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
  false_positive: 'False Positive',
};

const statusTransitions: Record<FindingStatus, FindingStatus[]> = {
  open: ['acknowledged', 'dismissed'],
  acknowledged: ['in_review', 'resolved', 'dismissed'],
  in_review: ['resolved', 'dismissed', 'false_positive'],
  resolved: [],
  dismissed: [],
  false_positive: [],
};

export function StatusSelect({ currentStatus, onStatusChange, isLoading = false }: StatusSelectProps): React.JSX.Element {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const canTransition = statusTransitions[currentStatus] && statusTransitions[currentStatus].length > 0;
  const possibleTransitions = statusTransitions[currentStatus] || [];

  const handleStatusChange = async (newStatus: FindingStatus): Promise<void> => {
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!canTransition) {
    return (
      <Badge className={statusColors[currentStatus]}>
        {statusLabels[currentStatus]}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          disabled={isLoading || isUpdating}
        >
          {isUpdating && <Loader2 size={14} className="animate-spin" />}
          <Badge className={statusColors[currentStatus]}>
            {statusLabels[currentStatus]}
          </Badge>
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {possibleTransitions.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={isUpdating}
          >
            {statusLabels[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



