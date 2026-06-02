import { ConfigService } from '@nestjs/config';
import type { Config } from '../../config/configuration';
import { DatabaseService } from '../../database/database.service';
export declare class AgentService {
    private readonly db;
    private readonly configService;
    private readonly logger;
    constructor(db: DatabaseService, configService: ConfigService<Config, true>);
    analyzeDocument(documentId: string, organizationId: string, documentType: string): Promise<void>;
}
