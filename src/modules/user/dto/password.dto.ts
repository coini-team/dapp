// Third Party Dependencies.
import { IsNotEmpty, IsString } from 'class-validator';

export class passwordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}