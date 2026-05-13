import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@supabase/supabase-js';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import type { Membership } from '../../database/schema';

@Controller('memberships')
@UseGuards(SupabaseAuthGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post(':orgId/invite')
  async invite(
    @Param('orgId') orgId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateMembershipDto,
  ): Promise<Membership> {
    return this.membershipsService.invite(orgId, user.id, dto);
  }

  @Get(':orgId')
  async listByOrganization(@Param('orgId') orgId: string): Promise<Membership[]> {
    return this.membershipsService.listByOrganization(orgId);
  }

  @Get('user')
  async findByUserId(@CurrentUser() user: User): Promise<Membership[]> {
    return this.membershipsService.findByUserId(user.id);
  }

  @Patch(':orgId/:userId')
  async updateRole(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: User,
    @Body() body: { role: string },
  ): Promise<Membership> {
    return this.membershipsService.updateRole(orgId, userId, user.id, body.role);
  }
}
