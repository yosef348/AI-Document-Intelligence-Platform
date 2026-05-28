import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { IngestionModule } from '../ingestion/ingestion.module';

@Module({
  providers: [DocumentsService],
  controllers: [DocumentsController],
  imports: [
    IngestionModule,
    // Multer configuration: memory storage, 50MB limit
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
