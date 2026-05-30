export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'pro' | 'enterprise' | 'custom';
  status: string;
  maxMembers: number;
  maxDocuments: number;
  createdAt: string;
}

export interface Document {
  id: string;
  organizationId: string;
  type: 'contract' | 'invoice' | 'report' | 'email' | 'other';
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  parsingStatus: 'pending' | 'parsing' | 'parsed' | 'failed';
  processingStatus:
    | 'pending'
    | 'indexing'
    | 'processing'
    | 'completed'
    | 'failed';
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type FindingSeverity =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'info';

export type FindingStatus =
  | 'open'
  | 'acknowledged'
  | 'in_review'
  | 'resolved'
  | 'dismissed'
  | 'false_positive';

export interface Finding {
  id: string;
  organizationId: string;
  documentId: string;
  aiRunId: string | null;
  findingType: string;
  category: string | null;
  severity: FindingSeverity;
  confidence: string;
  status: FindingStatus;
  title: string;
  summary: string;
  explanation: string | null;
  evidence: {
    extractedText?: string;
    pageRefs?: number[];
  };
  location: {
    section?: string;
    clause?: string;
    page?: number;
  } | null;
  promptVersion: string | null;
  modelVersion: string | null;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FindingsStats {
  total: number;
  open: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

