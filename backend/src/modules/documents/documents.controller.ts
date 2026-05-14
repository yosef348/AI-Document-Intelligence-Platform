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
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
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
      storage: memoryStorage(),
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

    // Validate file content
    const buffer = file.buffer;
    let isValidContent = false;
    if (buffer.length >= 4) {
      const header = buffer.slice(0, 4).toString();
      if (header === '%PDF') {
        isValidContent = true; // PDF
      } else if (header.startsWith('PK')) {
        // Check for DOCX (ZIP with specific content)
        // For simplicity, assume ZIP is DOCX; in production, check for [Content_Types].xml
        isValidContent = true; // DOCX
      }
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
