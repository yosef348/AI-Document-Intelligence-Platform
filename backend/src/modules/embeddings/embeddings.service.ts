import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { chunks } from '../../database/schema/chunks';
import { embeddings } from '../../database/schema/embeddings';
import type { Chunk } from '../../database/schema/chunks';
import type { NewEmbedding } from '../../database/schema/embeddings';
import { eq, isNull, and } from 'drizzle-orm';
import OpenAI from 'openai';
import type { Config } from '../../config/configuration';

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService<Config, true>,
  ) {
    const apiKey = this.configService.get('openai.apiKey', { infer: true });
    this.openai = new OpenAI({ apiKey });
  }

  async generateForDocument(
    documentId: string,
    organizationId: string,
  ): Promise<void> {
    try {
      // Update document processing status to 'processing'
      await this.updateDocumentProcessingStatus(documentId, 'processing');

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
        return;
      }

      // Filter out chunks that already have active embeddings
      const chunksWithoutEmbeddings: Chunk[] = [];
      for (const chunk of documentChunks) {
        const hasEmbedding = await this.hasActiveEmbedding(chunk.id);
        if (!hasEmbedding) {
          chunksWithoutEmbeddings.push(chunk);
        }
      }

      if (chunksWithoutEmbeddings.length === 0) {
        this.logger.log(
          `All chunks for document ${documentId} already have embeddings`,
        );
        await this.updateDocumentProcessingStatus(documentId, 'completed');
        return;
      }

      // Generate embeddings in batches of 20
      const batchSize = 20;
      for (let i = 0; i < chunksWithoutEmbeddings.length; i += batchSize) {
        const batch = chunksWithoutEmbeddings.slice(i, i + batchSize);

        // Generate embeddings for this batch
        const newEmbeddings = await this.generateEmbeddings(batch);

        // Save embeddings to DB
        await this.saveEmbeddings(newEmbeddings);

        // Rate limiting: 100ms delay between batches
        if (i + batchSize < chunksWithoutEmbeddings.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Update document processing status to 'completed'
      await this.updateDocumentProcessingStatus(documentId, 'completed');

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

  private async generateEmbeddings(chunks: Chunk[]): Promise<NewEmbedding[]> {
    const startTime = Date.now();

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunks.map((c) => c.chunkText),
    });

    const latency = Date.now() - startTime;

    return chunks.map((chunk, index) => ({
      organizationId: chunk.organizationId,
      chunkId: chunk.id,
      model: 'text-embedding-3-small',
      modelVersion: 'latest',
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

  private async hasActiveEmbedding(chunkId: string): Promise<boolean> {
    const [existing] = await this.db.db
      .select()
      .from(embeddings)
      .where(
        and(
          eq(embeddings.chunkId, chunkId),
          eq(embeddings.isActive, true),
          isNull(embeddings.deletedAt),
        ),
      );

    return !!existing;
  }

  private async updateDocumentProcessingStatus(
    documentId: string,
    status: string,
  ): Promise<void> {
    // Import documents here to avoid circular dependency
    const { documents } = await import('../../database/schema/documents.js');

    await this.db.db
      .update(documents)
      .set({
        processingStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId));
  }
}
