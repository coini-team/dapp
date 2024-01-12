import { OmitType } from '@nestjs/mapped-types';
import { IsDateString, IsNumber, IsPositive, IsString } from 'class-validator';
import { Wallet } from '../../wallet/entities/wallet.entity';

export class TransactionCoiniCreateDto {
  @IsString()
  txhash: string;

  @IsString()
  address: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsString()
  token: string;

  wallet: Wallet;
}

export class WalletTransactionFromScrapperDto extends OmitType(
  TransactionCoiniCreateDto,
  ['wallet'] as const,
) {
  @IsString()
  timestamp: string;

  @IsString()
  contract: string;
}
