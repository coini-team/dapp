// Third Party Dependencies.
import { Injectable } from '@nestjs/common';
import { ethers, HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers';

// Local Dependencies.
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Network } from 'src/modules/chain/entities/network.entity';

@Injectable()
export class WalletService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
  ) { }

  public getWallet(rpcUrl: string): Wallet {
    const provider: JsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet: Wallet = new Wallet(
      this.configService.get(Blockchain.WALLET_PRIVATE_KEY),
      provider,
    );
    return wallet;
  }

  // traer network url
  public async getRpcUrl(chain: string): Promise<string> {
    const network = await this.networkRepository.findOne({ name: chain });
    return network.rpc_url;
  }

  /**
   * @memberof WalletService
   * @description This method is used to get all wallets from database.
   * @returns {Promise<Wallet[]>}
   */
  public getAllWallets(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  /**
   * create random wallet
   * @returns wallet info
   */
  public createRandomWallet(): HDNodeWallet {
    const randomWallet = Wallet.createRandom();
    console.log(`New Wallet Address: ${randomWallet.address}`);
    console.log(`Private Key: ${randomWallet.privateKey}`);

    return randomWallet;
  }

  public createSmartAccount() {

  }
}
