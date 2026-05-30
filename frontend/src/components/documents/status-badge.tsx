'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type: 'parsing' | 'processing';
  className?: string;
}

const parsingConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; isLoading: boolean }> = {
  pending: { label: 'Pending', variant: 'secondary', isLoading: false },
  parsing: { label: 'Parsing...', variant: 'default', isLoading: true },
  parsed: { label: 'Parsed', variant: 'default', isLoading: false },
  failed: { label: 'Failed', variant: 'destructive', isLoading: false },
};

const processingConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; isLoading: boolean }> = {
  pending: { label: 'Pending', variant: 'secondary', isLoading: false },
  indexing: { label: 'Indexing...', variant: 'default', isLoading: true },
  processing: { label: 'Analyzing...', variant: 'outline', isLoading: true },
  completed: { label: 'Completed', variant: 'default', isLoading: false },
  failed: { label: 'Failed', variant: 'destructive', isLoading: false },
};

export function StatusBadge({ status, type, className }: StatusBadgeProps): React.JSX.Element {
  const config = type === 'parsing' ? parsingConfig[status] : processingConfig[status];

  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }

  return (
    <Badge variant={config.variant} className={cn('font-medium', className)}>
      {config.isLoading && <Loader2 size={14} className="mr-1.5 animate-spin" />}
      {config.label}
    </Badge>
  );
}

