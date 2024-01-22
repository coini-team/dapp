// Third Party Dependencies.
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// Local Dependencies.
import { Role } from '../../role/entities/role.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 45)
  name: string;

  @IsString()
  @Length(0, 45)
  lastName: string;

  @IsEmail()
  @Length(1, 45)
  email: string;
  
  @IsString()
  @Length(0, 45)
  wallet:string

  // Asumiendo que 'Role' es una clase con su propia validación
  roles: Role[];
}
