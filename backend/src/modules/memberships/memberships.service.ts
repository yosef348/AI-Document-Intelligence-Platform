import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { memberships } from '../../database/schema/memberships';
import type { Membership } from '../../database/schema';
import { CreateMembershipDto, ALLOWED_ROLES } from './dto/create-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(private readonly db: DatabaseService) {}

  private async ensureOwnerOrAdmin(userId: string, organizationId: string): Promise<Membership> {
    const [membership] = await this.db.db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.organizationId, organizationId),
          eq(memberships.userId, userId),
          isNotNull(memberships.joinedAt),
        ),
      );

    if (!membership || !['owner', 'admin'].includes((membership as Membership).role)) {
      throw new ForbiddenException('Insufficient role');
    }

    return membership as Membership;
  }

  async invite(organizationId: string, invitedBy: string, dto: CreateMembershipDto): Promise<Membership> {
    // Verify inviter has role in ['owner','admin']
    await this.ensureOwnerOrAdmin(invitedBy, organizationId);

    // Check for existing membership to prevent duplicates
    const [existing] = await this.db.db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.organizationId, organizationId),
          eq(memberships.userId, dto.userId),
        ),
      );

    if (existing) {
      throw new ConflictException('User is already a member of this organization');
    }

    // Insert into memberships table
    const [created] = await this.db.db
      .insert(memberships)
      .values({
        organizationId,
        userId: dto.userId,
        role: dto.role,
        invitedBy,
        joinedAt: null, // Set to null for pending invite
      })
      .returning();

    return created as Membership;
  }

  async acceptInvitation(userId: string, organizationId: string): Promise<Membership> {
    // Update the membership to set joinedAt = new Date()
    const [updated] = await this.db.db
      .update(memberships)
      .set({ joinedAt: new Date() })
      .where(
        and(
          eq(memberships.organizationId, organizationId),
          eq(memberships.userId, userId),
          isNull(memberships.joinedAt), // Only accept pending invites
        ),
      )
      .returning();

    if (!updated) {
      throw new NotFoundException('Pending invitation not found');
    }

    return updated as Membership;
  }

  async listByOrganization(organizationId: string, requesterId: string): Promise<Membership[]> {
    // Verify requester is a member of the organization with owner/admin role
    await this.ensureOwnerOrAdmin(requesterId, organizationId);

    const result = await this.db.db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.organizationId, organizationId),
          isNotNull(memberships.joinedAt),
        ),
      );

    return result as Membership[];
  }

  async findByUserId(userId: string): Promise<Membership[]> {
    const result = await this.db.db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          isNotNull(memberships.joinedAt),
        ),
      );

    return result as Membership[];
  }

  async updateRole(organizationId: string, userId: string, updatedBy: string, role: string): Promise<Membership> {
    // Validate role
    if (!ALLOWED_ROLES.includes(role as any)) {
      throw new BadRequestException(`Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}`);
    }

    // Prevent self-modification
    if (updatedBy === userId) {
      throw new ForbiddenException('Cannot modify your own role');
    }

    // Verify updatedBy has role in ['owner','admin']
    await this.ensureOwnerOrAdmin(updatedBy, organizationId);

    // Perform atomic check and update in transaction
    return await this.db.db.transaction(async (tx) => {
      // Get target membership
      const [targetMembership] = await tx
        .select()
        .from(memberships)
        .where(
          and(
            eq(memberships.organizationId, organizationId),
            eq(memberships.userId, userId),
            isNotNull(memberships.joinedAt),
          ),
        );

      if (!targetMembership) {
        throw new NotFoundException('Membership not found');
      }

      // Protect last owner: if target is owner and new role is not owner, check owner count
      if ((targetMembership as Membership).role === 'owner' && role !== 'owner') {
        const ownerRows = await tx
          .select()
          .from(memberships)
          .where(
            and(
              eq(memberships.organizationId, organizationId),
              eq(memberships.role, 'owner'),
              isNotNull(memberships.joinedAt),
            ),
          );

        if (ownerRows.length === 1) {
          throw new ForbiddenException('Cannot remove the last owner of the organization');
        }
      }

      // Update membership role
      const [updated] = await tx
        .update(memberships)
        .set({ role })
        .where(
          and(
            eq(memberships.organizationId, organizationId),
            eq(memberships.userId, userId),
            isNotNull(memberships.joinedAt),
          ),
        )
        .returning();

      if (!updated) {
        throw new NotFoundException('Membership not found');
      }

      return updated as Membership;
    });
  }
}
