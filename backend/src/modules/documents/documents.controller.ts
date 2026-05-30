import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as os from 'os';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrganizationId } from '../../common/decorators/organization-id.decorator';
import type { User } from '@supabase/supabase-js';
import { DocumentsService } from './documents.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import type { Document } from '../../database/schema/documents';

@Controller('documents')
@UseGuards(SupabaseAuthGuard)
@ApiTags('documents')
@ApiBearerAuth()
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(
    private readonly documentsService: DocumentsService,
    private readonly ingestionService: IngestionService,
  ) {}

  private mapDocumentWithSignedUrl(
    document: Document,
    signedUrl: string,
  ): Document & { signedUrl: string } {
    const { storagePath: _omit, ...rest } = document as Document & {
      storagePath?: string;
    };
    return { ...rest, signedUrl } as Document & { signedUrl: string };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, os.tmpdir()),
        filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  ) // 50MB limit
  async upload(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
  ): Promise<Document & { signedUrl: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Validate file content by reading first 4 bytes from disk
    let isValidContent = false;
    const fd = fs.openSync(file.path, 'r');
    try {
      const headerBuf = Buffer.alloc(4);
      const bytesRead = fs.readSync(fd, headerBuf, 0, 4, 0);
      if (bytesRead === 4) {
        const header = headerBuf.toString();
        if (header === '%PDF') {
          isValidContent = true; // PDF
        } else if (header.startsWith('PK')) {
          // For simplicity, treat ZIP header as DOCX
          isValidContent = true; // DOCX
        }
      }
    } finally {
      fs.closeSync(fd);
    }
    if (!isValidContent) {
      throw new BadRequestException(
        'Invalid file content. Only PDF and DOCX files are allowed',
      );
    }

    const document = await this.documentsService.upload(user.id, dto, file);

    // Trigger ingestion (fire-and-forget)
    void this.ingestionService
      .processDocument(document.id, dto.organizationId)
      .catch((err) =>
        this.logger.error('Ingestion failed for document', {
          documentId: document.id,
          err,
        }),
      );

    // Replace storagePath with signedUrl and never return storagePath
    const signedUrl = await this.documentsService.getSignedUrl(
      document.storagePath,
    );
    // Clean up temporary file created by Multer
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (e) {
      this.logger.warn(`Failed to remove temp file: ${file.path}`);
    }
    return this.mapDocumentWithSignedUrl(document, signedUrl);
  }

  @Get()
  async findAll(
    @OrganizationId() organizationId: string,
  ): Promise<(Document & { signedUrl: string })[]> {
    const documents = await this.documentsService.findAll(organizationId);

    // Add signed URLs
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const signedUrl = await this.documentsService.getSignedUrl(
          doc.storagePath,
        );
        return this.mapDocumentWithSignedUrl(doc, signedUrl);
      }),
    );

    return documentsWithUrls;
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @OrganizationId() organizationId: string,
  ): Promise<Document & { signedUrl: string }> {
    const document = await this.documentsService.findById(id, organizationId);
    const signedUrl = await this.documentsService.getSignedUrl(
      document.storagePath,
    );
    return this.mapDocumentWithSignedUrl(document, signedUrl);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @OrganizationId() organizationId: string,
  ): Promise<void> {
    await this.documentsService.softDelete(id, organizationId, user.id);
  }
}
