// Third Party Dependencies.
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local Dependencies.
import { TokenController } from './controllers/token.controller';
import { Network } from '../chain/entities/network.entity';
import { ConfigModule } from '../../config/config.module';
import { TokenService } from './services/token.service';
import { WalletModule } from '../wallet/wallet.module';
import { Middleware } from '../../middleware/nft.middleware';
import { RequestModule } from "../requests/request.module";
import { ProjectModule } from "../project/project.module";

@Module({
  imports: [ConfigModule, WalletModule, TypeOrmModule.forFeature([Network]), RequestModule, ProjectModule],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware) // Aplicar el middleware
      .forRoutes(TokenController); // Para todos los controladores del módulo nft
  }
}
