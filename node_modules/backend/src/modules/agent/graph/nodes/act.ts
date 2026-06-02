import { Logger } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { findings } from '../../../../database/schema/findings';
import { AgentStateType } from '../state';

const logger = new Logger('ActNode');

export async function actNode(
  state: AgentStateType,
  db: DatabaseService,
  aiRunId: string,
): Promise<Partial<AgentStateType>> {
  logger.log(`Starting act node for document ${state.documentId}`);

  if (state.findings.length === 0) {
    logger.log(
      `Completed act node for document ${state.documentId} with no findings to persist`,
    );
    return { status: 'completed' };
  }

  const findingRows = state.findings.map((finding) => ({
    organizationId: state.organizationId,
    documentId: state.documentId,
    aiRunId,
    findingType: finding.findingType,
    severity: finding.severity,
    confidence: finding.confidence.toString(),
    status: 'open',
    title: finding.title,
    summary: finding.summary,
    explanation: finding.explanation,
    evidence: finding.evidence,
    location: finding.location,
    promptVersion: 'v1.0',
    modelVersion: 'gpt-4o',
    modelProvider: 'openai',
  }));

  await db.db.insert(findings).values(findingRows);

  logger.log(
    `Completed act node for document ${state.documentId}; persisted ${findingRows.length} findings`,
  );

  return { status: 'completed' };
}
