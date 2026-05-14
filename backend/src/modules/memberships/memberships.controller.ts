import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Body, Controller, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@supabase/supabase-js';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipRoleDto } from './dto/update-membership-role.dto';
import type { Membership } from '../../database/schema';

@Controller('memberships')
@UseGuards(SupabaseAuthGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get('user')
  async findByUserId(@CurrentUser() user: User): Promise<Membership[]> {
    return this.membershipsService.findByUserId(user.id);
  }

  @Post(':orgId/invite')
  async invite(
    @Param('orgId') orgId: string,
    @CurrentUser() user: User,
    @Body(new ValidationPipe()) dto: CreateMembershipDto,
  ): Promise<Membership> {
    // Create pending invitation
    await this.membershipsService.invite(orgId, user.id, dto);
    // Immediately accept to maintain current API behavior
    return this.membershipsService.acceptInvitation(dto.userId, orgId);
  }

  @Get(':orgId')
  async listByOrganization(
    @Param('orgId') orgId: string,
    @CurrentUser() user: User,
  ): Promise<Membership[]> {
    return this.membershipsService.listByOrganization(orgId, user.id);
  }

  @Patch(':orgId/:userId')
  async updateRole(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: User,
    @Body(new ValidationPipe()) body: UpdateMembershipRoleDto,
  ): Promise<Membership> {
    return this.membershipsService.updateRole(
      orgId,
      userId,
      user.id,
      body.role,
    );
    return this.membershipsService.updateRole(orgId, userId, user.id, body.role);
  }
}
