// Third Party Dependencies.
import { IsInt, IsString, Length } from 'class-validator';
import { Network } from 'src/modules/chain/entities/network.entity';

export class CreateProjectDto {
  @IsString()
  user_id: string;

  @IsInt()
  organization_id: number;

  @IsString()
  @Length(1, 500)
  name: string;

  @IsString()
  mode: string;

  @IsString()
  status: string;

  @IsString()
  description: string;

  @IsString()
  network_id: Network;
}
