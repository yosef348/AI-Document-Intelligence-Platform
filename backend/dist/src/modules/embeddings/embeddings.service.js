"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmbeddingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_service_1 = require("../../database/database.service");
const chunks_1 = require("../../database/schema/chunks");
const embeddings_1 = require("../../database/schema/embeddings");
const documents_1 = require("../../database/schema/documents");
const drizzle_orm_1 = require("drizzle-orm");
const openai_1 = __importDefault(require("openai"));
const agent_service_1 = require("../agent/agent.service");
let EmbeddingsService = EmbeddingsService_1 = class EmbeddingsService {
    db;
    configService;
    agentService;
    logger = new common_1.Logger(EmbeddingsService_1.name);
    openai;
    constructor(db, configService, agentService) {
        this.db = db;
        this.configService = configService;
        this.agentService = agentService;
        const apiKey = this.configService.get('openai.apiKey', { infer: true });
        this.openai = new openai_1.default({ apiKey, maxRetries: 2 });
    }
    async generateForDocument(documentId, organizationId) {
        try {
            await this.updateDocumentProcessingStatus(documentId, 'processing');
            const documentType = await this.getDocumentType(documentId, organizationId);
            const documentChunks = await this.db.db
                .select()
                .from(chunks_1.chunks)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(chunks_1.chunks.documentId, documentId), (0, drizzle_orm_1.eq)(chunks_1.chunks.organizationId, organizationId), (0, drizzle_orm_1.isNull)(chunks_1.chunks.deletedAt)));
            if (documentChunks.length === 0) {
                this.logger.warn(`No chunks found for document ${documentId}`);
                await this.updateDocumentProcessingStatus(documentId, 'completed');
                this.triggerAgentAnalysis(documentId, organizationId, documentType);
                return;
            }
            const chunkIds = documentChunks.map((c) => c.id);
            const existingEmbeddingChunkIds = await this.db.db
                .selectDistinct({ chunkId: embeddings_1.embeddings.chunkId })
                .from(embeddings_1.embeddings)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(embeddings_1.embeddings.isActive, true), (0, drizzle_orm_1.isNull)(embeddings_1.embeddings.deletedAt), (0, drizzle_orm_1.inArray)(embeddings_1.embeddings.chunkId, chunkIds)))
                .then((rows) => new Set(rows.map((r) => r.chunkId)));
            const chunksWithoutEmbeddings = documentChunks.filter((chunk) => !existingEmbeddingChunkIds.has(chunk.id));
            if (chunksWithoutEmbeddings.length === 0) {
                this.logger.log(`All chunks for document ${documentId} already have embeddings`);
                await this.updateDocumentProcessingStatus(documentId, 'completed');
                this.triggerAgentAnalysis(documentId, organizationId, documentType);
                return;
            }
            const batchSize = 20;
            for (let i = 0; i < chunksWithoutEmbeddings.length; i += batchSize) {
                const batch = chunksWithoutEmbeddings.slice(i, i + batchSize);
                try {
                    const newEmbeddings = await this.generateEmbeddings(batch);
                    await this.saveEmbeddings(newEmbeddings);
                    if (i + batchSize < chunksWithoutEmbeddings.length) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                }
                catch (batchError) {
                    const isTransientError = (batchError instanceof Error &&
                        (batchError.message.includes('429') ||
                            /\b5\d{2}\b/.test(batchError.message) ||
                            batchError.message.includes('timeout') ||
                            batchError.message.includes('ECONNREFUSED'))) ||
                        (typeof batchError === 'object' &&
                            batchError !== null &&
                            'status' in batchError &&
                            (batchError.status === 429 ||
                                batchError.status >= 500));
                    if (isTransientError) {
                        this.logger.warn(`Transient error in batch for document ${documentId}, will retry on next run`, batchError);
                        break;
                    }
                    else {
                        throw batchError;
                    }
                }
            }
            await this.updateDocumentProcessingStatus(documentId, 'completed');
            this.triggerAgentAnalysis(documentId, organizationId, documentType);
            this.logger.log(`Embeddings generated for document ${documentId}`);
        }
        catch (error) {
            this.logger.error(`Embedding generation failed for document ${documentId}`, error);
            try {
                await this.updateDocumentProcessingStatus(documentId, 'failed');
            }
            catch (statusError) {
                this.logger.error(`Failed to update document status for ${documentId}`, statusError);
            }
            throw error;
        }
    }
    async generateEmbeddings(inputChunks) {
        const startTime = Date.now();
        const response = await this.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: inputChunks.map((c) => c.chunkText),
        });
        if (!response.data || response.data.length !== inputChunks.length) {
            throw new Error(`OpenAI embedding response mismatch: expected ${inputChunks.length} embeddings, got ${response.data?.length ?? 0}`);
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
    async saveEmbeddings(newEmbeddings) {
        const batchSize = 50;
        for (let i = 0; i < newEmbeddings.length; i += batchSize) {
            const batch = newEmbeddings.slice(i, i + batchSize);
            await this.db.db.insert(embeddings_1.embeddings).values(batch).onConflictDoNothing();
        }
    }
    async updateDocumentProcessingStatus(documentId, status) {
        await this.db.db
            .update(documents_1.documents)
            .set({
            processingStatus: status,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(documents_1.documents.id, documentId));
    }
    async getDocumentType(documentId, organizationId) {
        const [document] = await this.db.db
            .select({ type: documents_1.documents.type })
            .from(documents_1.documents)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(documents_1.documents.id, documentId), (0, drizzle_orm_1.eq)(documents_1.documents.organizationId, organizationId), (0, drizzle_orm_1.isNull)(documents_1.documents.deletedAt)));
        if (!document) {
            throw new Error(`Document ${documentId} not found for organization ${organizationId}`);
        }
        return document.type;
    }
    triggerAgentAnalysis(documentId, organizationId, documentType) {
        void this.agentService
            .analyzeDocument(documentId, organizationId, documentType)
            .catch((error) => {
            const errorTrace = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Agent analysis failed for document ${documentId}`, errorTrace);
        });
    }
};
exports.EmbeddingsService = EmbeddingsService;
exports.EmbeddingsService = EmbeddingsService = EmbeddingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        config_1.ConfigService,
        agent_service_1.AgentService])
], EmbeddingsService);
//# sourceMappingURL=embeddings.service.js.map