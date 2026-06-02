import { IsIn, IsString } from 'class-validator';

export class UpdateFindingDto {
  @IsString()
  @IsIn(['open', 'acknowledged', 'in_review', 'resolved', 'dismissed', 'false_positive'])
  status!: string;
}
