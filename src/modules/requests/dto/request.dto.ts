import {IsNotEmpty, IsString, IsInt, IsDate } from 'class-validator';

export class RequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  endPoint: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  request: string;

  @IsString()
  @IsNotEmpty()
  response: string;

  @IsString()
  statusCode: string;

  @IsInt()
  duration: number;

  @IsString()
  ip: string;

  @IsDate()
  callDate: Date;
}
