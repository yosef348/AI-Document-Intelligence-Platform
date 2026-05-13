import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly ingestionService: IngestionService,
  ) {}

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

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF and DOCX are allowed');
    }

    const document = await this.documentsService.upload(user.id, dto, file);

    // Trigger ingestion
    await this.ingestionService.processDocument(document.id, dto.organizationId);

    // Replace storagePath with signedUrl and never return storagePath
    const signedUrl = await this.documentsService.getSignedUrl(document.storagePath);
    const { storagePath: _omit, ...rest } = document as Document & { storagePath?: string };
    return { ...rest, signedUrl } as unknown as Document & { signedUrl: string };
  }

  @Get()
  async findAll(@OrganizationId() organizationId: string): Promise<(Document & { signedUrl: string })[]> {
    const documents = await this.documentsService.findAll(organizationId);

    // Add signed URLs
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const signedUrl = await this.documentsService.getSignedUrl(doc.storagePath);
        const { storagePath: _omit, ...rest } = doc as Document & { storagePath?: string };
        return { ...rest, signedUrl } as Document & { signedUrl: string };
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
    const signedUrl = await this.documentsService.getSignedUrl(document.storagePath);
    const { storagePath: _omit, ...rest } = document as Document & { storagePath?: string };
    return { ...rest, signedUrl } as Document & { signedUrl: string };
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
