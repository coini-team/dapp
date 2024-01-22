import { IsNotEmpty, IsString } from 'class-validator';

export class SendPaymentDto {
  @IsString({ message: "El parametro 'sender' debe un string." })
  @IsNotEmpty({ message: "Falta el parametro 'sender'" })
  sender: string;

  @IsString({ message: "El parametro 'amount' debe ser un string." })
  @IsNotEmpty({ message: "Falta el parametro 'amount'" })
  amount: bigint;

  @IsString({ message: "El parametro 'token' debe ser un string." })
  @IsNotEmpty({ message: "Falta el parametro 'token'" })
  token: string;
}
