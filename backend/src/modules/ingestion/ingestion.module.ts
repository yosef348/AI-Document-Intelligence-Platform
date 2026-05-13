import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
