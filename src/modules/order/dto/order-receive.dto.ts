import {
  IsAlphanumeric,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { txStatus } from '../../../shared/enums/tx-status.enum';
import { WalletTransactionFromScrapperDto } from './wallet-transaccion-from-scrapper.dto';

export class OrderReceiveDto {
  @IsString()
  @IsEnum(txStatus)
  status: txStatus;

  @IsString()
  @IsAlphanumeric()
  orderCode: string;

  @ValidateIf((c) => !c.error)
  @ValidateNested()
  @Type(() => WalletTransactionFromScrapperDto)
  walletTransactionData: WalletTransactionFromScrapperDto;

  @IsOptional()
  error: { message: string };
}
