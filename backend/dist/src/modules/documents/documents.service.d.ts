import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import type { Document } from '../../database/schema/documents';
import { UploadDocumentDto } from './dto/upload-document.dto';
import type { Config } from '../../config/configuration';
export declare class DocumentsService {
    private readonly db;
    private readonly configService;
    constructor(db: DatabaseService, configService: ConfigService<Config, true>);
    upload(userId: string, dto: UploadDocumentDto, file: Express.Multer.File): Promise<Document>;
    findAll(organizationId: string): Promise<Document[]>;
    findById(id: string, organizationId: string): Promise<Document>;
    getSignedUrl(storagePath: string): Promise<string>;
    softDelete(id: string, organizationId: string, userId: string): Promise<void>;
}
