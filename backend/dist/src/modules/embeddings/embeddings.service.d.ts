import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import type { Config } from '../../config/configuration';
import { AgentService } from '../agent/agent.service';
export declare class EmbeddingsService {
    private readonly db;
    private readonly configService;
    private readonly agentService;
    private readonly logger;
    private readonly openai;
    constructor(db: DatabaseService, configService: ConfigService<Config, true>, agentService: AgentService);
    generateForDocument(documentId: string, organizationId: string): Promise<void>;
    private generateEmbeddings;
    private saveEmbeddings;
    private updateDocumentProcessingStatus;
    private getDocumentType;
    private triggerAgentAnalysis;
}
