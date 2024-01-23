// Third Party Dependencies.
import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';

// Local Dependencies.
import { WalletService } from '../../wallet/services/wallet.service';
import { Network } from '../../chain/entities/network.entity';
import { ChainService } from '../../chain/services/chain.service';
import erc20TokenABI from 'src/contracts/abis/ERC20_ABI.json';
import { CryptoNetwork } from '../../chain/entities/crypto-network.entity';
import { OrderService } from '../../order/services/order.service';
import { PaymentService } from '../../payment/services/payment.service';
import { ReceiverWalletType } from '../../../shared/enums/receiver-wallet-type.enum';
import { TxStatus } from 'src/shared/enums/tx-status.enum';
import { OrderReceiveDto } from 'src/modules/order/dto/order-receive.dto';
import {
  getEthDecimalAmount,
  getEthBigAmount,
} from 'src/shared/utils/decimal.util';

@Injectable()
export class NotificationsService {
  private readonly _logger: Logger = new Logger('NotificationsService', {
    timestamp: true,
  });
  constructor(
    private readonly walletService: WalletService,
    private readonly chainService: ChainService,
    private readonly _paymentService: PaymentService,
    private readonly _orderService: OrderService,
  ) { }

  /**
   * @memberof NotificationsService
   * @description Listen for contract events.
   * @returns {Promise<void>}
   */
  async processTransferEvents() {
    // Map Networks and Create Providers.
    const networks: Network[] = await this.chainService.getAllNetworks();
    const providers = await Promise.all(
      networks.map(async (network) => {
        return {
          id: network.id,
          name: network.rpc_chain_name,
          provider: new ethers.WebSocketProvider(
            network.rpc_ws,
            network.rpc_chain_name,
          ),
        };
      }),
    );
    // Map Crypto Networks and Create Contracts to listen transfer events
    const tokens: CryptoNetwork[] = await this.chainService.getCryptoNetworks();
    const wallets = await this.walletService.getAllWallets();
    tokens.forEach((token) => {
      wallets.forEach((wallet) => {
        const contract = new ethers.Contract(
          token.contract,
          erc20TokenABI,
          providers.find((provider) => provider.id === token.network.id),
        );

        // Filter only get Transfer events from the wallet.
        const filter = contract.filters.Transfer(null, wallet.address);
        contract.on(filter, async (event) => {
          const { log, args } = event;
          const status = 201;

          // hit coini webhook sending order payload
          const status_ = await this.hitCoiniWebhook(
            wallet.address,
            log.transactionHash,
            args[0],
            getEthDecimalAmount(args[2].toString(), token.decimals),
            token.crypto.name,
            token.contract,
          );
          console.log('=> status_:', status_);

          // Send the tokens to the receiver wallet.
          this._paymentService.sendERC20tokens(
            token.network.rpc_chain_name,
            {
              sender: wallet.address,
              token: token.contract,
              amount: getEthBigAmount(args[2].toString(), token.decimals),
            },
            // If the status is 201, the receiver wallet is recognized. Otherwise, it is unrecognized.
            status === 201
              ? ReceiverWalletType.RECOGNIZED_TX
              : ReceiverWalletType.UNRECOGNIZED_TX,
          );
        });
      });
    });
  }

  async hitCoiniWebhook(dynamicWallet, txhash, address, value, token, contract) {
    // Create the order payload
    const orderReceive: OrderReceiveDto = {
      status: TxStatus.SUCCESS,
      orderCode: 'xxx', // TODO
      dynamicWallet,
      walletTransactionData: {
        txhash,
        address,
        value,
        token, // TODO: Add Inner Join to get the token name.
        contract,
        timestamp: new Date().toISOString(),
      },
    };
    console.log('=> orderReceive:', orderReceive);

    // Send the order receive data to the order service.
    return await this._orderService.sendOrderToCoini(orderReceive);
  }
}
