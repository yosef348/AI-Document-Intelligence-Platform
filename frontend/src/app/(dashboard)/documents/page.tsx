
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadDialog } from '@/components/documents/upload-dialog';
import { DocumentList } from '@/components/documents/document-list';
import { useAuth } from '@/hooks/use-auth';
import { useOrganization } from '@/hooks/use-organization';
import type { Document } from '@/types';

export default function DocumentsPage(): React.JSX.Element {
  const { session } = useAuth();
  const { organizationId } = useOrganization();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [pollingActive, setPollingActive] = useState<boolean>(false);

  const fetchDocuments = useCallback(async (): Promise<void> => {
    if (!session || !organizationId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/documents?organizationId=${organizationId}`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (res.ok) {
        const data: Document[] = await res.json();
        setDocuments(data);

        // Check if any documents need polling
        const needsPolling = data.some(
          (doc) =>
            (doc.parsingStatus !== 'parsed' && doc.parsingStatus !== 'failed') ||
            (doc.processingStatus !== 'completed' &&
              doc.processingStatus !== 'failed')
        );
        setPollingActive(needsPolling);
      }
    } catch {}
  }, [session, organizationId]);

  const handleDelete = async (docId: string): Promise<void> => {
    if (!session || !organizationId) return;

    // Optimistic delete
    setDocuments((prev) => prev.filter((d) => d.id !== docId));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (!res.ok) {
        // Restore on error
        await fetchDocuments();
      }
    } catch {
      // Restore on error
      await fetchDocuments();
    }
  };

  // Initial fetch
  useEffect(() => {
    let mounted = true;

    async function init(): Promise<void> {
      if (!session || !organizationId) return;
      setIsLoading(true);
      await fetchDocuments();
      if (mounted) setIsLoading(false);
    }

    init();

    return () => {
      mounted = false;
    };
  }, [session, organizationId, fetchDocuments]);

  // Polling for document status updates
  useEffect(() => {
    if (!pollingActive) return;

    const pollingInterval = setInterval(() => {
      fetchDocuments();
    }, 5000); // 5 second polling

    return () => clearInterval(pollingInterval);
  }, [pollingActive, fetchDocuments]);

  const handleUploadSuccess = (): void => {
    fetchDocuments();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Documents</h2>
          <Badge variant="secondary">{documents.length}</Badge>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload size={16} className="mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={handleUploadSuccess}
      />

      {/* Document List */}
      <div className="bg-card rounded-lg border border-border/50">
        <DocumentList
          documents={documents}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}


