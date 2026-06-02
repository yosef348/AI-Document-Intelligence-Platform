import type { Document } from '../../database/schema/documents';

/**
 * Sanitizes a document response by removing sensitive storage path and adding signed URL
 * @param doc The document record from the database
 * @param signedUrl Optional signed URL for download
 * @returns Document without storagePath, with downloadUrl added
 */
export function sanitizeDocument(
  doc: Document,
  signedUrl?: string,
): Omit<Document, 'storagePath' | 'storageVersion'> & { downloadUrl: string | null } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { storagePath: _omit1, storageVersion: _omit2, ...safe } = doc as Document & {
    storagePath?: string;
    storageVersion?: string;
  };
  return { ...safe, downloadUrl: signedUrl ?? null };
}

