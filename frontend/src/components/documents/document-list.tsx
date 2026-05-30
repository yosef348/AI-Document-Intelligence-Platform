'use client';

import React from 'react';
import { FileText, FileJson } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './status-badge';
import { DocumentActions } from './document-actions';
import { formatBytes, formatRelativeTime } from '@/lib/utils/format';
import type { Document } from '@/types';

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
}

function getFileIcon(mimeType: string): React.ReactNode {
  if (mimeType === 'application/pdf') {
    return <FileText size={16} className="text-red-500" />;
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return <FileText size={16} className="text-blue-500" />;
  }
  return <FileJson size={16} className="text-muted-foreground" />;
}

export function DocumentList({ documents, isLoading, onDelete }: DocumentListProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Size</th>
              <th className="py-2 px-4">Parse Status</th>
              <th className="py-2 px-4">AI Status</th>
              <th className="py-2 px-4">Uploaded</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-3 px-4"><Skeleton className="h-4 w-48" /></td>
                <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                <td className="py-3 px-4"><Skeleton className="h-4 w-12" /></td>
                <td className="py-3 px-4"><Skeleton className="h-6 w-20" /></td>
                <td className="py-3 px-4"><Skeleton className="h-6 w-24" /></td>
                <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                <td className="py-3 px-4"><Skeleton className="h-8 w-8" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText size={48} className="mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">No documents yet</h3>
        <p className="text-sm text-muted-foreground">
          Upload a contract or invoice to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Size</th>
            <th className="py-2 px-4">Parse Status</th>
            <th className="py-2 px-4">AI Status</th>
            <th className="py-2 px-4">Uploaded</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {getFileIcon(doc.mimeType)}
                  <span className="truncate text-sm font-medium max-w-xs">
                    {doc.originalFilename}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className="capitalize">
                  {doc.type}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm">{formatBytes(doc.sizeBytes)}</span>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={doc.parsingStatus} type="parsing" />
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={doc.processingStatus} type="processing" />
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(doc.createdAt)}
                </span>
              </td>
              <td className="py-3 px-4">
                <DocumentActions
                  document={doc}
                  onDelete={() => onDelete(doc.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


