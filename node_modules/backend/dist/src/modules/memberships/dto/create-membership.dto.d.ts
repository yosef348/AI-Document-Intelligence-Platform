export type MembershipRole = 'owner' | 'admin' | 'reviewer' | 'analyst' | 'viewer';
export declare const ALLOWED_ROLES: MembershipRole[];
export declare class CreateMembershipDto {
    userId: string;
    role: MembershipRole;
}
