// Third Party Dependencies.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local Dependencies.
import { NftController } from './controllers/nft.controller';
import { Network } from '../chain/entities/network.entity';
import { ConfigModule } from '../../config/config.module';
import { NftService } from './services/nft.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [ConfigModule, WalletModule, TypeOrmModule.forFeature([Network])],
  providers: [NftService],
  controllers: [NftController],
  exports: [NftService],
})
export class NftModule {}
