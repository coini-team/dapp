// Third Party Dependencies.
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
