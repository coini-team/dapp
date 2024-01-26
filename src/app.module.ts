// Third Party Dependencies.
import { Module } from '@nestjs/common';

// Local Dependencies.
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TokenModule } from './modules/token/token.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { Configuration } from './config/config.keys';
import { NftModule } from './modules/nft/nft.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './modules/message/message.module';
import { ProjectModule } from './modules/project/project.module';
import { SampleModule } from './modules/sample/sample.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ChainModule } from './modules/chain/chain.module';
import { RoleModule } from './modules/role/role.module';
import { OrderModule } from './modules/order/order.module';
import { SmtpModule } from './modules/smtp/smtp.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    DatabaseModule,
    TokenModule,
    NftModule,
    NotificationsModule,
    WalletModule,
    UserModule,
    AuthModule,
    ProjectModule,
    MessageModule,
    SampleModule,
    PaymentModule,
    ChainModule,
    RoleModule,
    OrderModule,
    SmtpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
    // Set port from config service.
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
