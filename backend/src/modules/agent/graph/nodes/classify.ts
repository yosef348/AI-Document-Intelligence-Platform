import { Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { AgentFinding, AgentStateType } from '../state';

const logger = new Logger('ClassifyNode');
const validSeverities = new Set(['info', 'low', 'medium', 'high', 'critical']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toStringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function toConfidence(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

function toEvidence(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function toLocation(value: unknown): Record<string, unknown> | null {
  if (value === null) {
    return null;
  }
  return isRecord(value) ? value : null;
}

function toSeverity(value: unknown): string {
  if (typeof value !== 'string') {
    return 'low';
  }
  return validSeverities.has(value) ? value : 'low';
}

function normalizeFinding(value: unknown): AgentFinding {
  if (!isRecord(value)) {
    return {
      findingType: 'unknown_finding',
      severity: 'low',
      confidence: 0,
      title: 'Unclassified finding',
      summary: '',
      explanation: '',
      evidence: {},
      location: null,
    };
  }

  return {
    findingType: toStringValue(value.findingType, 'unknown_finding'),
    severity: toSeverity(value.severity),
    confidence: toConfidence(value.confidence),
    title: toStringValue(value.title, 'Untitled finding'),
    summary: toStringValue(value.summary, ''),
    explanation: toStringValue(value.explanation, ''),
    evidence: toEvidence(value.evidence),
    location: toLocation(value.location),
  };
}

export async function classifyNode(
  state: AgentStateType,
  openaiApiKey: string,
): Promise<Partial<AgentStateType>> {
  logger.log(`Starting classify node for document ${state.documentId}`);

  const prompt = `Based on this document analysis, extract structured findings.
Analysis: ${state.analysisResult}
Return a JSON array of findings. Each finding must have:
- findingType: string (e.g. 'short_termination_clause', 'duplicate_invoice', 'missing_liability_clause')
- severity: one of 'info', 'low', 'medium', 'high', 'critical'
- confidence: number between 0 and 1
- title: short one-line description
- summary: 2-3 sentence explanation
- explanation: detailed explanation
- evidence: { extractedText: string, pageRefs: number[] }
- location: { section: string, clause: string } or null
Return ONLY valid JSON array, no markdown.`;

  let rawContent: string;

  try {
    const model = new ChatOpenAI({
      apiKey: openaiApiKey,
      model: 'gpt-4o',
      temperature: 0,
    });

    const response = await model.invoke(prompt);
    rawContent =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown classify node error';
    logger.error(
      `Classify node failed for document ${state.documentId}: ${errorMessage}`,
    );
    throw error instanceof Error ? error : new Error(errorMessage);
  }

  try {
    const parsed = JSON.parse(rawContent) as unknown;

    if (!Array.isArray(parsed)) {
      throw new Error('Findings response was not an array');
    }

    const findings = parsed.map((finding) => normalizeFinding(finding));

    logger.log(
      `Completed classify node for document ${state.documentId} with ${findings.length} findings`,
    );

    return {
      findings,
      status: 'classified',
      error: null,
    };
  } catch (_parseError: unknown) {
    logger.warn(
      `Failed to parse findings response for document ${state.documentId}`,
    );
    return {
      findings: [],
      error: 'Failed to parse findings',
      status: 'classified',
    };
  }
}
