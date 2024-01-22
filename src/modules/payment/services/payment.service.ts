// Third party Dependencies.
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';

// Local Dependencies.
import { ReceiverWallet } from 'src/modules/wallet/entities/receiver-wallet.entity';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { Network } from '../../chain/entities/network.entity';
import { SendPaymentDto } from '../dto/send-payment.dto';

@Injectable()
export class PaymentService {
  private readonly _logger: Logger = new Logger('PaymentService', {
    timestamp: true,
  });

  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(ReceiverWallet)
    private readonly receiverWalletRepository: Repository<ReceiverWallet>,
    @InjectRepository(Network)
    private readonly NetworkRepository: Repository<Network>,
  ) {}

  /**
   * @memberof PaymentService
   * @description Send an ERC20 Token to a Receiver Wallet.
   * @param chain
   * @param {SendPaymentDto} sendPayment
   * @param {string} typeReceiverWallet
   * @returns {Promise<string>}
   */
  async sendERC20tokens(
    chain: string,
    sendPayment: SendPaymentDto,
    typeReceiverWallet: string,
  ): Promise<string> {
    try {
      // Destructure the sendPayment object
      const { sender, token, amount } = sendPayment;

      // Verify that the chain parameter is present.
      if (!chain) {
        throw new NotFoundException(
          "Chain parameter is missing. Please add 'chain' parameter to the request.",
        );
      }

      // Get the sender wallet from the database.
      const senderWallet = await this.walletRepository.findOne({
        address: sender,
      });

      // Verify that the sender wallet is present.
      if (!senderWallet) {
        throw new NotFoundException('Sender Wallet not found in database.');
      }

      // Get the network from the database.
      const networkObject = await this.NetworkRepository.findOne({
        rpc_chain_name: chain,
      });

      // Verify that the network is present.
      if (!networkObject) {
        throw new NotFoundException('Network not found in database.');
      }

      // Get the network rpc_url for the provider and the sender private key.
      const network = networkObject.rpc_url;
      const senderPrivateKey = senderWallet.privateKey;

      // Create a provider and a wallet instance.
      const provider = new ethers.JsonRpcProvider(network);
      const wallet = new ethers.Wallet(senderPrivateKey, provider);

      // Create a contract instance.
      const erc20Contract = new ethers.Contract(
        token,
        ['function transfer(address to, uint256 amount)'], // TODO: Move this to a constant.
        wallet,
      );

      // Get the receiver wallet with the typeReceiverWallet parameter from the database.
      const receiverWallet = await this.receiverWalletRepository.findOne({
        type: typeReceiverWallet,
      });

      // Verify that the receiver wallet is present.
      if (!receiverWallet) {
        throw new NotFoundException('Receiver Wallet not found in database.');
      }

      // Get the receiver wallet address.
      const receiverAddress = receiverWallet.address;

      // const decimalAmount = getEthParsedAmount('4000n', 6);
      // console.log('=> decimalAmount:', `${decimalAmount} - ${typeof decimalAmount}`);
      console.log('=> amount to send:', amount);

      // Send the tokens to the receiver wallet.
      const transaction = await erc20Contract.transfer(receiverAddress, amount);

      // Log the transaction hash.
      this._logger.log(`Transaction hash: ${transaction.hash}`);

      // Wait for the transaction to be confirmed.
      await transaction.wait();

      // Log that the transaction was confirmed.
      this._logger.log(`Transaction confirmed: ${transaction.hash}`);

      // Return a success message.
      return 'Amount: ' + amount + '. Transaction confirmed successfully';
    } catch (error) {
      this._logger.error('Error sending tokens: ' + error.message);
      // TODO: Improve this error handling.
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new NotFoundException(
          "Insufficient funds to cover the transaction's cost",
        );
      }
      throw new NotFoundException(`Error sending tokens: ${error.message}`);
    }
  }
}
