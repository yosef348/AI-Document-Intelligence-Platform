import { DatabaseService } from '../../database/database.service';
import type { Membership } from '../../database/schema';
import { CreateMembershipDto } from './dto/create-membership.dto';
export declare class MembershipsService {
    private readonly db;
    constructor(db: DatabaseService);
    private ensureOwnerOrAdmin;
    invite(organizationId: string, invitedBy: string, dto: CreateMembershipDto): Promise<Membership>;
    acceptInvitation(userId: string, organizationId: string): Promise<Membership>;
    listByOrganization(organizationId: string, requesterId: string): Promise<Membership[]>;
    findByUserId(userId: string): Promise<Membership[]>;
    updateRole(organizationId: string, userId: string, updatedBy: string, role: string): Promise<Membership>;
}
