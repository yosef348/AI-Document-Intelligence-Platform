import type { User } from '@supabase/supabase-js';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipRoleDto } from './dto/update-membership-role.dto';
import type { Membership } from '../../database/schema';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
    findByUserId(user: User): Promise<Membership[]>;
    invite(orgId: string, user: User, dto: CreateMembershipDto): Promise<Membership>;
    listByOrganization(orgId: string, user: User): Promise<Membership[]>;
    updateRole(orgId: string, userId: string, user: User, body: UpdateMembershipRoleDto): Promise<Membership>;
}
