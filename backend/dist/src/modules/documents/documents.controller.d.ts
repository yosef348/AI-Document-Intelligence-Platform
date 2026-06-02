import type { User } from '@supabase/supabase-js';
import { DocumentsService } from './documents.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import type { Document } from '../../database/schema/documents';
export declare class DocumentsController {
    private readonly documentsService;
    private readonly ingestionService;
    private readonly logger;
    constructor(documentsService: DocumentsService, ingestionService: IngestionService);
    private mapDocumentWithSignedUrl;
    upload(user: User, file: Express.Multer.File, dto: UploadDocumentDto): Promise<Document & {
        signedUrl: string;
    }>;
    findAll(organizationId: string): Promise<(Document & {
        signedUrl: string;
    })[]>;
    findById(id: string, organizationId: string): Promise<Document & {
        signedUrl: string;
    }>;
    softDelete(id: string, user: User, organizationId: string): Promise<void>;
}
