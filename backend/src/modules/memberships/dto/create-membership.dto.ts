import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateMembershipDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(owner|admin|reviewer|analyst|viewer)$/)
  role: string;
}
