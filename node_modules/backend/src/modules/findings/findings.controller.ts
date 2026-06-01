import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrganizationId } from '../../common/decorators/organization-id.decorator';
import type { User } from '@supabase/supabase-js';
import { FindingsService, FindingsFilter } from './findings.service';
import { UpdateFindingDto } from './dto/update-finding.dto';
import type { Finding } from '../../database/schema/findings';

@Controller('findings')
@UseGuards(SupabaseAuthGuard)
@ApiTags('findings')
@ApiBearerAuth()
export class FindingsController {
  constructor(private readonly findingsService: FindingsService) {}

  @Get()
  async findAll(
    @OrganizationId() organizationId: string,
    @Query() query: Partial<FindingsFilter>,
  ): Promise<{ data: Finding[]; count: number }> {
    const filters: FindingsFilter = {};
    if (query.documentId) filters.documentId = String(query.documentId);
    if (query.severity) filters.severity = String(query.severity);
    if (query.status) filters.status = String(query.status);

    const items = await this.findingsService.findAll(organizationId, filters);

    return { data: items, count: items.length };
  }

  @Get('stats')
  async getStats(@OrganizationId() organizationId: string) {
    return this.findingsService.getStats(organizationId);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @OrganizationId() organizationId: string,
  ): Promise<{ data: Finding }> {
    const item = await this.findingsService.findById(id, organizationId);
    return { data: item };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFindingDto,
    @CurrentUser() user: User,
    @OrganizationId() organizationId: string,
  ): Promise<{ data: Finding }> {
    const updated = await this.findingsService.updateStatus(
      id,
      organizationId,
      user.id,
      dto.status,
    );
    return { data: updated };
  }
}
