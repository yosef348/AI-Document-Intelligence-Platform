import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@supabase/supabase-js';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import type { Membership, Organization } from '../../database/schema';

@Controller('organizations')
@UseGuards(SupabaseAuthGuard)
@ApiTags('organizations')
@ApiBearerAuth()
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.create(user.id, dto);
  }

  @Get()
  async findMine(@CurrentUser() user: User): Promise<Organization[]> {
    return this.organizationsService.findByUserId(user.id);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Organization> {
    return this.organizationsService.findById(id, user.id);
  }

  @Get(':id/membership')
  async getMembership(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Membership> {
    return this.organizationsService.getMembership(id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.update(id, user.id, dto);
  }
}
