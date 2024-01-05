import { 
  Body, 
  Controller, 
  Post, 
  Query, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { WalletService } from '../../wallet/services/wallet.service';
import { PaymentService } from '../services/payment.service';
import { SendPaymentDto } from '../dto/send-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly walletService: WalletService,
    ) { }
  
   /**
   * @memberof PaymentController
   * @description Send an ERC721 Token.
   * @param {Object} sendPayment - Payment Parameters.
   * @returns {string} - Receiver Address.
   */  
  @Post('send')
  @UsePipes(ValidationPipe)
  async sendTokens(
    @Body() sendPayment: SendPaymentDto,
    @Query('chain') chain: string,
  ) {
    const rpcUrl = await this.walletService.getRpcUrl(chain);
    return await this.paymentService.sendERC20tokens(
      sendPayment,
      rpcUrl,
    );
  }
}
