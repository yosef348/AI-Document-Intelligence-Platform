import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading(): React.JSX.Element {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

