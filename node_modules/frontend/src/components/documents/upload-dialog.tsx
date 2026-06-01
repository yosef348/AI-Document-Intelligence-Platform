'use client';

import React, { useState } from 'react';
import { Cloud, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { useOrganization } from '@/hooks/use-organization';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils/format';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = ['.pdf', '.docx'];

export function UploadDialog({ open, onOpenChange, onSuccess }: UploadDialogProps): React.JSX.Element {
  const { session } = useAuth();
  const { organizationId } = useOrganization();

  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (): void => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  const handleFileSelect = (selectedFile: File): void => {
    setError(null);

    // Validate file type
    const fileExtension = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
    if (!ACCEPTED_TYPES.includes(fileExtension)) {
      setError(`Invalid file type. Only ${ACCEPTED_TYPES.join(', ')} are supported.`);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${formatBytes(MAX_FILE_SIZE)}.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file || !documentType || !session || !organizationId) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', organizationId);
      formData.append('type', documentType);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Upload failed');
        setIsUploading(false);
        return;
      }

      onSuccess();
      onOpenChange(false);
      setFile(null);
      setDocumentType('');
      setIsUploading(false);
    } catch (err) {
      setError((err as Error).message ?? 'Upload failed');
      setIsUploading(false);
    }
  };

  const handleClose = (): void => {
    if (!isUploading) {
      onOpenChange(false);
      setFile(null);
      setDocumentType('');
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a PDF or DOCX document for analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
              dragOver ? 'border-primary bg-primary/5' : 'border-border',
              file ? 'border-solid border-primary/30 bg-muted/30' : ''
            )}
          >
            {file ? (
              <div className="flex w-full items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <Cloud size={32} className="mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF and DOCX up to 50MB
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleInputChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </>
            )}
          </div>

          {/* Document type selector */}
          <div>
            <Label htmlFor="doc-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="doc-type" className="mt-1">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !documentType || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


