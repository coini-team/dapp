// Third Party Dependencies.
import { Module, OnModuleInit } from '@nestjs/common';

// Local Dependencies.
import { NotificationsService } from './services/notifications.service';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { ConfigModule } from '../../config/config.module';
import { WalletModule } from '../wallet/wallet.module';
import { TokenModule } from '../token/token.module';
import { NftModule } from '../nft/nft.module';
import { ChainModule } from '../chain/chain.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    ConfigModule,
    TokenModule,
    NftModule,
    WalletModule,
    ChainModule,
    PaymentModule,
    OrderModule,
  ],
  controllers: [],
  providers: [NotificationsService, NotificationsGateway],
  exports: [],
})
export class NotificationsModule implements OnModuleInit {
  constructor(private readonly notificationsService: NotificationsService) {}
  onModuleInit() {
    this.notificationsService.processTransferEvents();
  }
}
