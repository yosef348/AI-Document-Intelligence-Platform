export type Organization = {
    id: string;
    name: string;
    slug: string;
    createdBy: string;
    updatedBy: string;
    updatedAt?: Date | null;
};
export type MembershipRole = 'owner' | 'admin' | 'member';
export type Membership = {
    organizationId: string;
    userId: string;
    role: MembershipRole;
    joinedAt: Date | null;
};
export declare const organizations: {
    id: string;
};
export declare const memberships: {
    organizationId: string;
    userId: string;
    role: string;
    joinedAt: string;
};
