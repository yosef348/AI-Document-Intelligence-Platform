import type { User } from '@supabase/supabase-js';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import type { Membership, Organization } from '../../database/schema';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(user: User, dto: CreateOrganizationDto): Promise<Organization>;
    findMine(user: User): Promise<Organization[]>;
    findById(id: string, user: User): Promise<Organization>;
    getMembership(id: string, user: User): Promise<Membership>;
    update(id: string, user: User, dto: UpdateOrganizationDto): Promise<Organization>;
}
