import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { memberships, organizations } from '../../database/schema';
import type { Membership, Organization } from '../../database/schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly db: DatabaseService) {}

  async create(
    userId: string,
    dto: CreateOrganizationDto,
  ): Promise<Organization> {
    try {
      const created = await this.db.db.transaction(async (tx) => {
        const [org] = await tx
          .insert(organizations)
          .values({ ...dto, createdBy: userId, updatedBy: userId })
          .returning();

        await tx.insert(memberships).values({
          organizationId: org.id,
          userId,
          role: 'owner',
          joinedAt: new Date(),
        });

        return org;
      });

      return created;
    } catch (err) {
      // Postgres unique violation
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code?: string }).code === '23505'
      ) {
        throw new ConflictException(
          'Organization with this slug already exists',
        );
      }
      throw err as Error;
    }
  }

  async findByUserId(userId: string): Promise<Organization[]> {
    const result = await this.db.db
      .select({ organization: organizations })
      .from(organizations)
      .innerJoin(
        memberships,
        and(
          eq(memberships.organizationId, organizations.id),
          eq(memberships.userId, userId),
          isNotNull(memberships.joinedAt),
        ),
      );
    return (result as Array<{ organization: Organization }>).map(
      (r: { organization: Organization }) => r.organization,
    );
  }

  async findById(id: string, userId: string): Promise<Organization> {
    // Ensure user has membership and organization exists
    const rows = await this.db.db
      .select({ organization: organizations })
      .from(organizations)
      .innerJoin(
        memberships,
        and(
          eq(memberships.organizationId, organizations.id),
          eq(organizations.id, id),
          eq(memberships.userId, userId),
          isNotNull(memberships.joinedAt),
        ),
      );

    const org = rows.at(0)?.organization;
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  async getMembership(
    organizationId: string,
    userId: string,
  ): Promise<Membership> {
    const [member] = await this.db.db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.organizationId, organizationId),
          eq(memberships.userId, userId),
          isNotNull(memberships.joinedAt),
        ),
      );

    if (!member) {
      throw new NotFoundException('Membership not found');
    }
    return member;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateOrganizationDto,
  ): Promise<Organization> {
    // verify role owner or admin
    const membership = await this.getMembership(id, userId);
    if (!['owner', 'admin'].includes(membership.role)) {
      throw new ForbiddenException('Insufficient role');
    }

    try {
      const [updated] = await this.db.db
        .update(organizations)
        .set({ ...dto, updatedBy: userId, updatedAt: new Date() })
        .where(eq(organizations.id, id))
        .returning();

      if (!updated) {
        throw new NotFoundException('Organization not found');
      }
      return updated;
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('Slug already exists');
      }
      throw err as Error;
    }
  }
}
