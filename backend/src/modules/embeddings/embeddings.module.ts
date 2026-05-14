import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { DatabaseModule } from '../../database/database.module';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [DatabaseModule, AgentModule],
  providers: [EmbeddingsService],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}
