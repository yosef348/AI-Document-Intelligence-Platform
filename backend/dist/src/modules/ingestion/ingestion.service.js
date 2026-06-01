"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var IngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_service_1 = require("../../database/database.service");
const documents_1 = require("../../database/schema/documents");
const chunks_1 = require("../../database/schema/chunks");
const drizzle_orm_1 = require("drizzle-orm");
const supabase_storage_helper_1 = require("../../common/helpers/supabase-storage.helper");
const mammoth = __importStar(require("mammoth"));
const embeddings_service_1 = require("../embeddings/embeddings.service");
const pdfParse = require('pdf-parse');
let IngestionService = IngestionService_1 = class IngestionService {
    db;
    configService;
    embeddingsService;
    logger = new common_1.Logger(IngestionService_1.name);
    constructor(db, configService, embeddingsService) {
        this.db = db;
        this.configService = configService;
        this.embeddingsService = embeddingsService;
    }
    async processDocument(documentId, organizationId) {
        try {
            await this.updateDocumentParsingStatus(documentId, 'parsing');
            const [document] = await this.db.db
                .select()
                .from(documents_1.documents)
                .where((0, drizzle_orm_1.eq)(documents_1.documents.id, documentId));
            if (!document) {
                throw new Error(`Document ${documentId} not found`);
            }
            if (document.organizationId !== organizationId) {
                throw new Error(`Organization mismatch: document belongs to ${document.organizationId}, ` +
                    `not ${organizationId}`);
            }
            const text = await this.extractText(document);
            const textChunks = this.chunkText(text, documentId, document.organizationId);
            await this.saveChunks(documentId, textChunks);
            void this.embeddingsService
                .generateForDocument(documentId, document.organizationId)
                .catch((err) => this.logger.error('Embedding generation failed for document', {
                documentId,
                err,
            }));
            await this.updateDocumentParsingStatus(documentId, 'parsed');
            await this.updateDocumentProcessingStatus(documentId, 'indexing');
            this.logger.log(`Document ${documentId} ingestion completed successfully`);
        }
        catch (error) {
            this.logger.error(`Document ingestion failed for ${documentId}`, error);
            try {
                await this.updateDocumentParsingStatus(documentId, 'failed');
                await this.updateDocumentProcessingStatus(documentId, 'failed');
            }
            catch (statusError) {
                this.logger.error(`Failed to update document status for ${documentId}`, statusError);
            }
            throw error;
        }
    }
    async extractText(document) {
        const storageClient = (0, supabase_storage_helper_1.getStorageClient)(this.configService);
        const { data: signedUrlData, error: signedUrlError } = await storageClient.storage
            .from('documents')
            .createSignedUrl(document.storagePath, 3600);
        if (signedUrlError || !signedUrlData) {
            throw new Error(`Failed to create signed URL for document: ${signedUrlError?.message}`);
        }
        const response = await fetch(signedUrlData.signedUrl);
        if (!response.ok) {
            throw new Error(`Failed to download document: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        if (document.mimeType === 'application/pdf') {
            const pdfData = await pdfParse(buffer);
            return pdfData.text;
        }
        else if (document.mimeType.includes('wordprocessingml')) {
            const result = await mammoth.extractRawText({ arrayBuffer: buffer });
            return result.value;
        }
        else {
            throw new Error(`Unsupported document type: ${document.mimeType}`);
        }
    }
    chunkText(text, documentId, organizationId) {
        const normalizedText = text.trim();
        if (!normalizedText) {
            return [];
        }
        const words = normalizedText.split(/\s+/).filter((word) => word.length > 0);
        if (words.length === 0) {
            return [];
        }
        const targetTokens = 512;
        const overlapTokens = 50;
        const tokensPerWord = 1.3;
        const chunks = [];
        let chunkIndex = 0;
        let startIndex = 0;
        while (startIndex < words.length) {
            const targetWords = Math.ceil(targetTokens / tokensPerWord);
            const endIndex = Math.min(startIndex + targetWords, words.length);
            const chunkWords = words.slice(startIndex, endIndex);
            const chunkText = chunkWords.join(' ');
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
            const overlapWords = Math.ceil(overlapTokens / tokensPerWord);
            startIndex = endIndex - overlapWords;
            if (startIndex <= 0) {
                startIndex = endIndex;
            }
            chunkIndex++;
        }
        return chunks;
    }
    async saveChunks(documentId, chunkList) {
        if (chunkList.length === 0) {
            return;
        }
        await this.db.db.transaction(async (tx) => {
            const batchSize = 100;
            for (let i = 0; i < chunkList.length; i += batchSize) {
                const batch = chunkList.slice(i, i + batchSize);
                await tx.insert(chunks_1.chunks).values(batch);
            }
        });
    }
    async updateDocumentParsingStatus(id, status) {
        await this.db.db
            .update(documents_1.documents)
            .set({
            parsingStatus: status,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(documents_1.documents.id, id));
    }
    async updateDocumentProcessingStatus(id, status) {
        await this.db.db
            .update(documents_1.documents)
            .set({
            processingStatus: status,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(documents_1.documents.id, id));
    }
};
exports.IngestionService = IngestionService;
exports.IngestionService = IngestionService = IngestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        config_1.ConfigService,
        embeddings_service_1.EmbeddingsService])
], IngestionService);
//# sourceMappingURL=ingestion.service.js.map