import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { IngestionModule } from '../ingestion/ingestion.module';

@Module({
  providers: [DocumentsService],
  controllers: [DocumentsController],
  imports: [IngestionModule],
  exports: [DocumentsService],
})
export class DocumentsModule {}
