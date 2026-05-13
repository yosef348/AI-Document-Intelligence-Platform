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

// Lightweight column token objects to satisfy drizzle-orm conditions
export const organizations: { id: string } = { id: 'organizations.id' };
export const memberships: {
  organizationId: string;
  userId: string;
  role: string;
  joinedAt: string;
} = {
  organizationId: 'memberships.organization_id' as unknown as string,
  userId: 'memberships.user_id' as unknown as string,
  role: 'memberships.role' as unknown as string,
  joinedAt: 'memberships.joined_at' as unknown as string,
};
