import {IsNotEmpty, IsString, IsDate, IsJSON, IsObject } from 'class-validator';

export class RequestDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsObject()
  @IsNotEmpty()
  request: object;

  @IsObject()
  @IsNotEmpty()
  response: object;

  @IsString()
  @IsNotEmpty()
  statusCode: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsString()
  @IsNotEmpty()
  callDate: string;
}
