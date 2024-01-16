import { IsString, IsNotEmpty } from 'class-validator';

export class DeployNftDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: "falta el parametro 'name', que debe ser un string " })
  name: string;

  @IsString({ message: 'symbol must be a string' })
  @IsNotEmpty({
    message: "falta el parametro 'symbol'. que debe ser un string ",
  })
  symbol: string;
}
