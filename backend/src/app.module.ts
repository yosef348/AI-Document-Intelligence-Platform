import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './modules/organizations/organizations.module';

@Module({
  imports: [OrganizationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
