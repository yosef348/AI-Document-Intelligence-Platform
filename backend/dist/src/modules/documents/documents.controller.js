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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DocumentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const supabase_auth_guard_1 = require("../../common/guards/supabase-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const organization_id_decorator_1 = require("../../common/decorators/organization-id.decorator");
const documents_service_1 = require("./documents.service");
const ingestion_service_1 = require("../ingestion/ingestion.service");
const upload_document_dto_1 = require("./dto/upload-document.dto");
let DocumentsController = DocumentsController_1 = class DocumentsController {
    documentsService;
    ingestionService;
    logger = new common_1.Logger(DocumentsController_1.name);
    constructor(documentsService, ingestionService) {
        this.documentsService = documentsService;
        this.ingestionService = ingestionService;
    }
    mapDocumentWithSignedUrl(document, signedUrl) {
        const { storagePath: _omit, ...rest } = document;
        return { ...rest, signedUrl };
    }
    async upload(user, file, dto) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const buffer = file.buffer;
        let isValidContent = false;
        if (buffer.length >= 4) {
            const header = buffer.slice(0, 4).toString();
            if (header === '%PDF') {
                isValidContent = true;
            }
            else if (header.startsWith('PK')) {
                isValidContent = true;
            }
        }
        if (!isValidContent) {
            throw new common_1.BadRequestException('Invalid file content. Only PDF and DOCX files are allowed');
        }
        const document = await this.documentsService.upload(user.id, dto, file);
        void this.ingestionService
            .processDocument(document.id, dto.organizationId)
            .catch((err) => this.logger.error('Ingestion failed for document', {
            documentId: document.id,
            err,
        }));
        const signedUrl = await this.documentsService.getSignedUrl(document.storagePath);
        return this.mapDocumentWithSignedUrl(document, signedUrl);
    }
    async findAll(organizationId) {
        const documents = await this.documentsService.findAll(organizationId);
        const documentsWithUrls = await Promise.all(documents.map(async (doc) => {
            const signedUrl = await this.documentsService.getSignedUrl(doc.storagePath);
            return this.mapDocumentWithSignedUrl(doc, signedUrl);
        }));
        return documentsWithUrls;
    }
    async findById(id, organizationId) {
        const document = await this.documentsService.findById(id, organizationId);
        const signedUrl = await this.documentsService.getSignedUrl(document.storagePath);
        return this.mapDocumentWithSignedUrl(document, signedUrl);
    }
    async softDelete(id, user, organizationId) {
        await this.documentsService.softDelete(id, organizationId, user.id);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, upload_document_dto_1.UploadDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, organization_id_decorator_1.OrganizationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, organization_id_decorator_1.OrganizationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, organization_id_decorator_1.OrganizationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "softDelete", null);
exports.DocumentsController = DocumentsController = DocumentsController_1 = __decorate([
    (0, common_1.Controller)('documents'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService,
        ingestion_service_1.IngestionService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map