import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  imports: [],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
