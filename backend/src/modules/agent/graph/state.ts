import { Annotation } from '@langchain/langgraph';

export type RetrievedChunk = {
  chunkId: string;
  chunkText: string;
  pageNumber: number | null;
  score: number;
};

export type AgentFinding = {
  findingType: string;
  severity: string;
  confidence: number;
  title: string;
  summary: string;
  explanation: string;
  evidence: Record<string, unknown>;
  location: Record<string, unknown> | null;
};

export const AgentState = Annotation.Root({
  documentId: Annotation<string>,
  organizationId: Annotation<string>,
  documentType: Annotation<string>,
  retrievedChunks: Annotation<RetrievedChunk[]>,
  analysisResult: Annotation<string>,
  findings: Annotation<AgentFinding[]>,
  error: Annotation<string | null>,
  status: Annotation<string>,
});

export type AgentStateType = typeof AgentState.State;
