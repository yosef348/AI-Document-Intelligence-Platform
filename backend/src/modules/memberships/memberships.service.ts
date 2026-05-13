import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { memberships } from '../../database/schema';
import type { Membership } from '../../database/schema';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(private readonly db: DatabaseService) {}

  async invite(organizationId: string, invitedBy: string, dto: CreateMembershipDto): Promise<Membership> {
    // Verify inviter has role in ['owner','admin']
    const [inviterMembership] = await this.db.db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.organizationId, organizationId),
          eq(memberships.userId, invitedBy),
          isNotNull(memberships.joinedAt),
        ),
      );

    if (!inviterMembership || !['owner', 'admin'].includes((inviterMembership as Membership).role)) {
      throw new ForbiddenException('Insufficient role');
    }

    // Insert into memberships table
    const [created] = await this.db.db
      .insert(memberships)
      .values({
        organizationId,
        userId: dto.userId,
        role: dto.role,
        invitedBy,
        joinedAt: new Date(),
      })
      .returning();

    return created as Membership;
  }

  async listByOrganization(organizationId: string): Promise<Membership[]> {
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
    // Verify updatedBy has role in ['owner','admin']
    const [updaterMembership] = await this.db.db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.organizationId, organizationId),
          eq(memberships.userId, updatedBy),
          isNotNull(memberships.joinedAt),
        ),
      );

    if (!updaterMembership || !['owner', 'admin'].includes((updaterMembership as Membership).role)) {
      throw new ForbiddenException('Insufficient role');
    }

    // Update membership role
    const [updated] = await this.db.db
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
  }
}
