import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DocumentsLoading(): React.JSX.Element {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="bg-card rounded-lg border border-border/50">
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="py-2 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-2 px-4"><Skeleton className="h-4 w-32" /></th>
                <th className="py-2 px-4"><Skeleton className="h-4 w-16" /></th>
                <th className="py-2 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-2 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-2 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-2 px-4"><Skeleton className="h-4 w-8" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-48" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-12" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-6 w-20" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-8 w-8" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

