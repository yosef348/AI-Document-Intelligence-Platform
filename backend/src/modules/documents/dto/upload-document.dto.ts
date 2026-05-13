import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';

export class UploadDocumentDto {
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsIn(['contract', 'invoice', 'report', 'email', 'other'])
  @IsNotEmpty()
  type: string;
}
