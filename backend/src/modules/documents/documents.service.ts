import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { randomUUID } from 'crypto';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { documents } from '../../database/schema/documents';
import type { Document } from '../../database/schema/documents';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { getStorageClient } from '../../common/helpers/supabase-storage.helper';
import type { Config } from '../../config/configuration';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService<Config, true>,
  ) {}

  async upload(
    userId: string,
    dto: UploadDocumentDto,
    file: Express.Multer.File,
  ): Promise<Document> {
    // Generate checksum
    const checksum = createHash('sha256').update(file.buffer).digest('hex');

    // Generate storage path
    const uuid = randomUUID();
    const sanitizedFilename = file.originalname
      .replace(/\s+/g, '-')
      .toLowerCase();
    const storagePath = `organizations/${dto.organizationId}/documents/${uuid}/${sanitizedFilename}`;

    // Upload file to Supabase Storage
    const storageClient = getStorageClient(this.configService);
    const { error } = await storageClient.storage
      .from('documents')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        duplex: 'half',
      });

    if (error) {
      throw new InternalServerErrorException(
        'Failed to upload file to storage',
      );
    }

    // Insert document record
    let created: Document[];
    try {
      created = await this.db.db
        .insert(documents)
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
    } catch (dbError) {
      // Cleanup orphaned file
      try {
        await storageClient.storage.from('documents').remove([storagePath]);
      } catch (removeError) {
        // Log but don't swallow the original error
        console.error('Failed to remove orphaned file:', removeError);
      }
      throw new InternalServerErrorException(
        'Failed to persist document metadata',
      );
    }

    return created[0];
  }

  async findAll(organizationId: string): Promise<Document[]> {
    const result = await this.db.db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.organizationId, organizationId),
          isNull(documents.deletedAt),
        ),
      )
      .orderBy(desc(documents.createdAt));

    return result;
  }

  async findById(id: string, organizationId: string): Promise<Document> {
    const [document] = await this.db.db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.id, id),
          eq(documents.organizationId, organizationId),
          isNull(documents.deletedAt),
        ),
      );

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async getSignedUrl(storagePath: string): Promise<string> {
    const storageClient = getStorageClient(this.configService);
    const { data, error } = await storageClient.storage
      .from('documents')
      .createSignedUrl(storagePath, 3600);

    if (error || !data) {
      throw new InternalServerErrorException('Failed to generate signed URL');
    }

    return data.signedUrl;
  }

  async softDelete(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<void> {
    // Verify document exists and belongs to org
    await this.findById(id, organizationId);

    // Update: deletedAt = new Date(), deletedBy = userId
    await this.db.db
      .update(documents)
      .set({
        deletedAt: new Date(),
        deletedBy: userId,
      })
      .where(
        and(eq(documents.id, id), eq(documents.organizationId, organizationId)),
      );
  }
}
