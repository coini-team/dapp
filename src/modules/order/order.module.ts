// Third Party Dependencies.
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

// Local Dependencies.
import { ConfigModule } from '../../config/config.module';
import { OrderService } from './services/order.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
