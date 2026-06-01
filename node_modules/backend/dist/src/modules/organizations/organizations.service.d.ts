import { DatabaseService } from '../../database/database.service';
import type { Membership, Organization } from '../../database/schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsService {
    private readonly db;
    constructor(db: DatabaseService);
    create(userId: string, dto: CreateOrganizationDto): Promise<Organization>;
    findByUserId(userId: string): Promise<Organization[]>;
    findById(id: string, userId: string): Promise<Organization>;
    getMembership(organizationId: string, userId: string): Promise<Membership>;
    update(id: string, userId: string, dto: UpdateOrganizationDto): Promise<Organization>;
}
