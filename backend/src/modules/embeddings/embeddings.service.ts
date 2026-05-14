import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { chunks } from '../../database/schema/chunks';
import { embeddings } from '../../database/schema/embeddings';
import { documents } from '../../database/schema/documents';
import type { Chunk } from '../../database/schema/chunks';
import type { NewEmbedding } from '../../database/schema/embeddings';
import { eq, isNull, and } from 'drizzle-orm';
import OpenAI from 'openai';
import type { Config } from '../../config/configuration';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService<Config, true>,
    private readonly agentService: AgentService,
  ) {
    const apiKey = this.configService.get('openai.apiKey', { infer: true });
    this.openai = new OpenAI({ apiKey, maxRetries: 2 });
  }

  async generateForDocument(
    documentId: string,
    organizationId: string,
  ): Promise<void> {
    try {
      // Update document processing status to 'processing'
      await this.updateDocumentProcessingStatus(documentId, 'processing');
      const documentType = await this.getDocumentType(
        documentId,
        organizationId,
      );

      // Fetch all chunks for documentId where deletedAt is null
      const documentChunks = await this.db.db
        .select()
        .from(chunks)
        .where(
          and(
            eq(chunks.documentId, documentId),
            eq(chunks.organizationId, organizationId),
            isNull(chunks.deletedAt),
          ),
        );

      if (documentChunks.length === 0) {
        this.logger.warn(`No chunks found for document ${documentId}`);
        await this.updateDocumentProcessingStatus(documentId, 'completed');
        this.triggerAgentAnalysis(documentId, organizationId, documentType);
        return;
      }

      // Filter out chunks that already have active embeddings (batched query, not N+1)
      const existingEmbeddingChunkIds = await this.db.db
        .selectDistinct({ chunkId: embeddings.chunkId })
        .from(embeddings)
        .where(and(eq(embeddings.isActive, true), isNull(embeddings.deletedAt)))
        .then((rows) => new Set(rows.map((r) => r.chunkId)));

      const chunksWithoutEmbeddings = documentChunks.filter(
        (chunk) => !existingEmbeddingChunkIds.has(chunk.id),
      );

      if (chunksWithoutEmbeddings.length === 0) {
        this.logger.log(
          `All chunks for document ${documentId} already have embeddings`,
        );
        await this.updateDocumentProcessingStatus(documentId, 'completed');
        this.triggerAgentAnalysis(documentId, organizationId, documentType);
        return;
      }

      // Generate embeddings in batches of 20
      const batchSize = 20;

      for (let i = 0; i < chunksWithoutEmbeddings.length; i += batchSize) {
        const batch = chunksWithoutEmbeddings.slice(i, i + batchSize);

        try {
          // Generate embeddings for this batch
          const newEmbeddings = await this.generateEmbeddings(batch);

          // Save embeddings to DB
          await this.saveEmbeddings(newEmbeddings);

          // Rate limiting: 100ms delay between batches
          if (i + batchSize < chunksWithoutEmbeddings.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (batchError: unknown) {
          // Check if error is transient (retryable)
          const isTransientError =
            (batchError instanceof Error &&
              (batchError.message.includes('429') ||
                batchError.message.includes('5') ||
                batchError.message.includes('timeout') ||
                batchError.message.includes('ECONNREFUSED'))) ||
            (typeof batchError === 'object' &&
              batchError !== null &&
              'status' in batchError &&
              ((batchError as { status: number }).status === 429 ||
                (batchError as { status: number }).status >= 500));

          if (isTransientError) {
            // Log transient error but allow resumption
            this.logger.warn(
              `Transient error in batch for document ${documentId}, will retry on next run`,
              batchError,
            );
            break; // Exit loop to allow resumption later
          } else {
            // Non-transient error, rethrow for document failure
            throw batchError;
          }
        }
      }

      // Update document processing status to 'completed'
      await this.updateDocumentProcessingStatus(documentId, 'completed');
      this.triggerAgentAnalysis(documentId, organizationId, documentType);

      this.logger.log(`Embeddings generated for document ${documentId}`);
    } catch (error) {
      this.logger.error(
        `Embedding generation failed for document ${documentId}`,
        error,
      );
      // Set processing status to 'failed'
      try {
        await this.updateDocumentProcessingStatus(documentId, 'failed');
      } catch (statusError) {
        this.logger.error(
          `Failed to update document status for ${documentId}`,
          statusError,
        );
      }
      throw error;
    }
  }

  private async generateEmbeddings(
    inputChunks: Chunk[],
  ): Promise<NewEmbedding[]> {
    const startTime = Date.now();

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: inputChunks.map((c) => c.chunkText),
    });

    // Validate response has correct number of embeddings
    if (!response.data || response.data.length !== inputChunks.length) {
      throw new Error(
        `OpenAI embedding response mismatch: expected ${inputChunks.length} embeddings, got ${response.data?.length ?? 0}`,
      );
    }

    const latency = Date.now() - startTime;

    return inputChunks.map((chunk, index) => ({
      organizationId: chunk.organizationId,
      chunkId: chunk.id,
      model: 'text-embedding-3-small',
      modelVersion: response.model,
      provider: 'openai',
      dimensions: 1536,
      embedding: response.data[index].embedding,
      embeddingLatencyMs: latency,
      tokenCount: chunk.tokenCount,
      isActive: true,
    }));
  }

  private async saveEmbeddings(newEmbeddings: NewEmbedding[]): Promise<void> {
    const batchSize = 50;

    for (let i = 0; i < newEmbeddings.length; i += batchSize) {
      const batch = newEmbeddings.slice(i, i + batchSize);
      await this.db.db.insert(embeddings).values(batch).onConflictDoNothing();
    }
  }

  private async updateDocumentProcessingStatus(
    documentId: string,
    status: 'processing' | 'completed' | 'failed',
  ): Promise<void> {
    await this.db.db
      .update(documents)
      .set({
        processingStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId));
  }

  private async getDocumentType(
    documentId: string,
    organizationId: string,
  ): Promise<string> {
    const [document] = await this.db.db
      .select({ type: documents.type })
      .from(documents)
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.organizationId, organizationId),
          isNull(documents.deletedAt),
        ),
      );

    if (!document) {
      throw new Error(
        `Document ${documentId} not found for organization ${organizationId}`,
      );
    }

    return document.type;
  }

  private triggerAgentAnalysis(
    documentId: string,
    organizationId: string,
    documentType: string,
  ): void {
    void this.agentService
      .analyzeDocument(documentId, organizationId, documentType)
      .catch((error: unknown) => {
        const errorTrace = error instanceof Error ? error.stack : undefined;
        this.logger.error(
          `Agent analysis failed for document ${documentId}`,
          errorTrace,
        );
      });
  }
}
