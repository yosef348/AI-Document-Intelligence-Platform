import { IsIn, IsNotEmpty } from 'class-validator';
import { ALLOWED_ROLES, type MembershipRole } from './create-membership.dto';

export class UpdateMembershipRoleDto {
  @IsIn(ALLOWED_ROLES)
  @IsNotEmpty()
  role: MembershipRole;
}
