import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import type { Config } from '../../config/configuration';
import { EmbeddingsService } from '../embeddings/embeddings.service';
export declare class IngestionService {
    private readonly db;
    private readonly configService;
    private readonly embeddingsService;
    private readonly logger;
    constructor(db: DatabaseService, configService: ConfigService<Config, true>, embeddingsService: EmbeddingsService);
    processDocument(documentId: string, organizationId: string): Promise<void>;
    private extractText;
    private chunkText;
    private saveChunks;
    private updateDocumentParsingStatus;
    private updateDocumentProcessingStatus;
}
