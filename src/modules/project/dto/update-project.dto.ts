import { IsEnum, IsInt, IsString, MaxLength } from 'class-validator';
import { ModeEnum } from '../../../shared/enums/mode.enum';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { Chain } from 'src/modules/chain/entities/chain.entity';

export class UpdateProjectDto {
  @IsString()
  @MaxLength(500)
  name: string;

  @IsString()
  description: string;

  @IsEnum(ModeEnum)
  mode: ModeEnum;

  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsInt()
  organization_id: number;

  @IsString()
  chain: Chain;
}
