// Third party Dependencies.
import { Controller } from '@nestjs/common';

// Local Dependencies.
import { WalletService } from '../../wallet/services/wallet.service';
import { PaymentService } from '../services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly walletService: WalletService,
  ) {}
}
