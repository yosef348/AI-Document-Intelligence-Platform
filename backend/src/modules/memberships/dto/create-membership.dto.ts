import { IsNotEmpty, IsUUID, IsIn } from 'class-validator';

export type MembershipRole =
  | 'owner'
  | 'admin'
  | 'reviewer'
  | 'analyst'
  | 'viewer';

export const ALLOWED_ROLES: MembershipRole[] = [
  'owner',
  'admin',
  'reviewer',
  'analyst',
  'viewer',
];

export class CreateMembershipDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsIn(ALLOWED_ROLES)
  @IsNotEmpty()
  role: MembershipRole;
}
