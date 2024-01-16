import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class DeployTokenDto {
  @IsString({ message: "El parametro 'name' debe ser string" })
  @IsNotEmpty({ message: "Falta el parametro 'name'" })
  name: string;

  @IsString({ message: "El parametro 'symbol' debe ser string" })
  @IsNotEmpty({ message: "Falta el parametro 'symbol'" })
  symbol: string;

  @IsNumber({}, { message: "El paramero 'initialSupply' debe ser un número" })
  @IsNotEmpty({ message: "Falta el parametro 'initialSupply'" })
  initialSupply: number;
}
