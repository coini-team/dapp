import {
  IsAlphanumeric,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TxStatus } from '../../../shared/enums/tx-status.enum';
import { WalletTransactionFromScrapperDto } from './wallet-transaccion-from-scrapper.dto';

export class OrderReceiveDto {
  @IsString()
  @IsEnum(TxStatus)
  status: TxStatus;

  @IsString()
  @IsAlphanumeric()
  orderCode: string;

  @IsString()
  dynamicWallet: string;

  @ValidateIf((c) => !c.error)
  @ValidateNested()
  @Type(() => WalletTransactionFromScrapperDto)
  walletTransactionData: WalletTransactionFromScrapperDto;

  @IsOptional()
  error?: { message: string };
}
