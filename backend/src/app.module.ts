import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import configuration from './config/configuration';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { EmbeddingsModule } from './modules/embeddings/embeddings.module';
import { AgentModule } from './modules/agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(process.cwd(), '../.env'),
      ],
      load: [configuration],
    }),
    OrganizationsModule,
    DatabaseModule,
    AuthModule,
    MembershipsModule,
    DocumentsModule,
    IngestionModule,
    EmbeddingsModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
