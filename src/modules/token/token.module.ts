// Third Party Dependencies.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local Dependencies.
import { TokenController } from './controllers/token.controller';
import { Network } from '../chain/entities/network.entity';
import { ConfigModule } from '../../config/config.module';
import { TokenService } from './services/token.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [ConfigModule, WalletModule, TypeOrmModule.forFeature([Network])],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
