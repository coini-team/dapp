// Third Party Dependencies.
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local Dependencies.
import { NftController } from './controllers/nft.controller';
import { Network } from '../chain/entities/network.entity';
import { ConfigModule } from '../../config/config.module';
import { NftService } from './services/nft.service';
import { WalletModule } from '../wallet/wallet.module';
import { ProjectModule } from '../project/project.module';
import { Middleware } from '../../middleware/nft.middleware';
import { RequestModule } from "../requests/request.module";

@Module({
  imports: [
    ConfigModule,
    WalletModule,
    ProjectModule,
    TypeOrmModule.forFeature([Network]),
    RequestModule
  ],
  providers: [NftService],
  controllers: [NftController],
  exports: [NftService],
})
export class NftModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware) // Aplicar el middleware
      .forRoutes(NftController); // Para todos los controladores del módulo nft
  }
}
