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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const crypto_2 = require("crypto");
const drizzle_orm_1 = require("drizzle-orm");
const database_service_1 = require("../../database/database.service");
const documents_1 = require("../../database/schema/documents");
const supabase_storage_helper_1 = require("../../common/helpers/supabase-storage.helper");
let DocumentsService = class DocumentsService {
    db;
    configService;
    constructor(db, configService) {
        this.db = db;
        this.configService = configService;
    }
    async upload(userId, dto, file) {
        const checksum = (0, crypto_1.createHash)('sha256').update(file.buffer).digest('hex');
        const uuid = (0, crypto_2.randomUUID)();
        const sanitizedFilename = file.originalname
            .replace(/\s+/g, '-')
            .toLowerCase();
        const storagePath = `organizations/${dto.organizationId}/documents/${uuid}/${sanitizedFilename}`;
        const storageClient = (0, supabase_storage_helper_1.getStorageClient)(this.configService);
        const { error } = await storageClient.storage
            .from('documents')
            .upload(storagePath, file.buffer, {
            contentType: file.mimetype,
            duplex: 'half',
        });
        if (error) {
            throw new common_1.InternalServerErrorException('Failed to upload file to storage');
        }
        let created;
        try {
            created = await this.db.db
                .insert(documents_1.documents)
                .values({
                organizationId: dto.organizationId,
                uploadedBy: userId,
                type: dto.type,
                filename: sanitizedFilename,
                originalFilename: file.originalname,
                mimeType: file.mimetype,
                sizeBytes: file.size,
                storageProvider: 'supabase',
                storageBucket: 'documents',
                storagePath,
                checksum,
                parsingStatus: 'pending',
                processingStatus: 'pending',
            })
                .returning();
        }
        catch (dbError) {
            try {
                await storageClient.storage.from('documents').remove([storagePath]);
            }
            catch (removeError) {
                console.error('Failed to remove orphaned file:', removeError);
            }
            throw new common_1.InternalServerErrorException('Failed to persist document metadata');
        }
        return created[0];
    }
    async findAll(organizationId) {
        const result = await this.db.db
            .select()
            .from(documents_1.documents)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(documents_1.documents.organizationId, organizationId), (0, drizzle_orm_1.isNull)(documents_1.documents.deletedAt)))
            .orderBy((0, drizzle_orm_1.desc)(documents_1.documents.createdAt));
        return result;
    }
    async findById(id, organizationId) {
        const [document] = await this.db.db
            .select()
            .from(documents_1.documents)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(documents_1.documents.id, id), (0, drizzle_orm_1.eq)(documents_1.documents.organizationId, organizationId), (0, drizzle_orm_1.isNull)(documents_1.documents.deletedAt)));
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        return document;
    }
    async getSignedUrl(storagePath) {
        const storageClient = (0, supabase_storage_helper_1.getStorageClient)(this.configService);
        const { data, error } = await storageClient.storage
            .from('documents')
            .createSignedUrl(storagePath, 3600);
        if (error || !data) {
            throw new common_1.InternalServerErrorException('Failed to generate signed URL');
        }
        return data.signedUrl;
    }
    async softDelete(id, organizationId, userId) {
        await this.findById(id, organizationId);
        await this.db.db
            .update(documents_1.documents)
            .set({
            deletedAt: new Date(),
            deletedBy: userId,
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(documents_1.documents.id, id), (0, drizzle_orm_1.eq)(documents_1.documents.organizationId, organizationId)));
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        config_1.ConfigService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map