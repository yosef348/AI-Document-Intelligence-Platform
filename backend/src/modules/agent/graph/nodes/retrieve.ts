import { Logger } from '@nestjs/common';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { DatabaseService } from '../../../../database/database.service';
import { chunks } from '../../../../database/schema/chunks';
import { AgentStateType } from '../state';

const logger = new Logger('RetrieveNode');

export async function retrieveNode(
  state: AgentStateType,
  db: DatabaseService,
): Promise<Partial<AgentStateType>> {
  logger.log(`Starting retrieve node for document ${state.documentId}`);

  const chunkRows = await db.db
    .select({
      chunkId: chunks.id,
      chunkText: chunks.chunkText,
      pageNumber: chunks.pageNumber,
    })
    .from(chunks)
    .where(
      and(
        eq(chunks.organizationId, state.organizationId),
        eq(chunks.documentId, state.documentId),
        isNull(chunks.deletedAt),
      ),
    )
    .orderBy(asc(chunks.chunkIndex))
    .limit(50);

  const retrievedChunks = chunkRows.map((chunk) => ({
    chunkId: chunk.chunkId,
    chunkText: chunk.chunkText,
    pageNumber: chunk.pageNumber,
    score: 1,
  }));

  logger.log(
    `Completed retrieve node for document ${state.documentId} with ${retrievedChunks.length} chunks`,
  );

  return {
    retrievedChunks,
    status: 'retrieved',
    error: null,
  };
}
