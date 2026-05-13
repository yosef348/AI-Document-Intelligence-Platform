import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { documents } from '../../database/schema/documents';
import type { Document } from '../../database/schema/documents';
import { chunks } from '../../database/schema/chunks';
import type { NewChunk } from '../../database/schema/chunks';
import { eq } from 'drizzle-orm';
import { getStorageClient } from '../../common/helpers/supabase-storage.helper';
import type { Config } from '../../config/configuration';
import * as mammoth from 'mammoth';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService<Config, true>,
  ) {}

  async processDocument(documentId: string, organizationId: string): Promise<void> {
    try {
      // Step 1: Update parsing status
      await this.updateDocumentParsingStatus(documentId, 'parsing');

      // Step 2: Get document record
      const [document] = await this.db.db
        .select()
        .from(documents)
        .where(eq(documents.id, documentId));

      if (!document) {
        throw new Error(`Document ${documentId} not found`);
      }

      // Step 3: Extract text
      const text = await this.extractText(document as Document);

      // Step 4: Split into chunks
      const textChunks = this.chunkText(text, documentId, organizationId);

      // Step 5: Save chunks
      await this.saveChunks(textChunks);

      // Step 6: Update parsing status to parsed
      await this.updateDocumentParsingStatus(documentId, 'parsed');

      // Step 7: Update processing status to indexing
      await this.updateDocumentProcessingStatus(documentId, 'indexing');

      this.logger.log(`Document ${documentId} ingestion completed successfully`);
    } catch (error) {
      this.logger.error(`Document ingestion failed for ${documentId}`, error);
      // Set both statuses to failed
      try {
        await this.updateDocumentParsingStatus(documentId, 'failed');
        await this.updateDocumentProcessingStatus(documentId, 'failed');
      } catch (statusError) {
        this.logger.error(`Failed to update document status for ${documentId}`, statusError);
      }
    }
  }

  private async extractText(document: Document): Promise<string> {
    const storageClient = getStorageClient(this.configService);

    // Create signed URL to download file
    const { data: signedUrlData, error: signedUrlError } = await storageClient.storage
      .from('documents')
      .createSignedUrl(document.storagePath, 3600);

    if (signedUrlError || !signedUrlData) {
      throw new Error(`Failed to create signed URL for document: ${signedUrlError?.message}`);
    }

    // Download file
    const response = await fetch(signedUrlData.signedUrl);
    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();

    // Extract text based on MIME type
    if (document.mimeType === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      return pdfData.text;
    } else if (document.mimeType.includes('wordprocessingml')) {
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      return result.value;
    } else {
      throw new Error(`Unsupported document type: ${document.mimeType}`);
    }
  }

  private chunkText(text: string, documentId: string, organizationId: string): NewChunk[] {
    const words = text.split(/\s+/);
    const targetTokens = 512;
    const overlapTokens = 50;
    const tokensPerWord = 1.3; // Simple approximation

    const chunks: NewChunk[] = [];
    let chunkIndex = 0;
    let startIndex = 0;

    while (startIndex < words.length) {
      // Calculate how many words to include in this chunk
      const targetWords = Math.ceil(targetTokens / tokensPerWord);
      const endIndex = Math.min(startIndex + targetWords, words.length);

      // Extract chunk text
      const chunkWords = words.slice(startIndex, endIndex);
      const chunkText = chunkWords.join(' ');

      // Calculate token count
      const tokenCount = Math.ceil(chunkWords.length * tokensPerWord);

      chunks.push({
        organizationId,
        documentId,
        chunkIndex,
        chunkText,
        tokenCount,
        chunkStrategy: 'fixed_512_overlap_50',
        overlapTokens,
        metadata: {},
      });

      // Move start index for next chunk (with overlap)
      const overlapWords = Math.ceil(overlapTokens / tokensPerWord);
      startIndex = endIndex - overlapWords;

      // Ensure we don't go backwards
      if (startIndex <= 0) {
        startIndex = endIndex;
      }

      chunkIndex++;
    }

    return chunks;
  }

  private async saveChunks(chunkList: NewChunk[]): Promise<void> {
    const batchSize = 100;

    for (let i = 0; i < chunkList.length; i += batchSize) {
      const batch = chunkList.slice(i, i + batchSize);
      await this.db.db.insert(chunks).values(batch);
    }
  }

  private async updateDocumentParsingStatus(id: string, status: string): Promise<void> {
    await this.db.db
      .update(documents)
      .set({
        parsingStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id));
  }

  private async updateDocumentProcessingStatus(id: string, status: string): Promise<void> {
    await this.db.db
      .update(documents)
      .set({
        processingStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id));
  }
}
