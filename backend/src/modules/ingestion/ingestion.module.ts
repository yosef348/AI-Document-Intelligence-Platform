import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { DatabaseModule } from '../../database/database.module';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [DatabaseModule, EmbeddingsModule],

@Module({
  imports: [DatabaseModule],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
