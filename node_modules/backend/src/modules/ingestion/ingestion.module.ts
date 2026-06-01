import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [EmbeddingsModule],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
