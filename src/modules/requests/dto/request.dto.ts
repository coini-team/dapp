import {IsNotEmpty, IsString, IsInt, IsDate, IsJSON } from 'class-validator';

export class RequestDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  endPoint: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsJSON()
  @IsNotEmpty()
  request: string;

  @IsJSON()
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
