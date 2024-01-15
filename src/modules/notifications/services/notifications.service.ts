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
import { getDecimalAmount } from 'src/shared/utils/decimal.util';

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
  ) {}

  /**
   * @memberof NotificationsService
   * @description Listen for contract events.
   * @returns {Promise<void>}
   */
  async processTransferEvents() {
    // Get All Networks from Database.
    const networks: Network[] = await this.chainService.getAllNetworks();
    // Map Networks and Create Providers.
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
    // Get All Crypto Networks from Database.
    const cryptoNetworks: CryptoNetwork[] =
      await this.chainService.getCryptoNetworks();
    // Get All Wallets from Database.
    const wallets = await this.walletService.getAllWallets();
    // Map Crypto Networks and Create Contracts.
    cryptoNetworks.forEach((cryptoNetwork) => {
      // For each wallet, listen for Transfer events.
      wallets.forEach((wallet) => {
        // Create Contract.
        const contract = new ethers.Contract(
          cryptoNetwork.contract,
          erc20TokenABI,
          providers.find(
            (provider) => provider.id === cryptoNetwork.network.id,
          ),
        );
        // Filter to only get Transfer events from the wallet.
        const filter = contract.filters.Transfer(null, wallet.address);
        // Listen for events on the contract.
        contract.on(filter, async (event) => {
          // Destructure the event.
          const { log, args } = event;
          // TODO: Refactor this code.
          // Create the order receive data.
          const orderReceive: OrderReceiveDto = {
            status: TxStatus.SUCCESS,
            orderCode: 'xxx', // TODO
            dynamicWallet: wallet.address,
            walletTransactionData: {
              txhash: log.transactionHash,
              address: args[0],
              value: Number(getDecimalAmount(args[2])),
              token: 'USDC', // TODO: Add Inner Join to get the token name.
              contract: cryptoNetwork.contract,
              timestamp: new Date().toISOString(),
            },
          };
          console.log('=> orderReceive:', orderReceive);

          // const status = 201;
          // Send the order receive data to the order service.
          const status =
            await this._orderService.sendOrderToCoini(orderReceive); // TODO: Uncomment this line.

          // Send the tokens to the receiver wallet.
          this._paymentService.sendERC20tokens(
            cryptoNetwork.network.rpc_chain_name,
            {
              sender: wallet.address,
              token: cryptoNetwork.contract,
              amount: event.args[2].toString(),
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
}
