// Third Party Dependencies.
import { Contract, ethers, Wallet } from 'ethers';
import { Injectable, NotFoundException } from '@nestjs/common';

// Local Dependencies.
import FactoryERC20_ABI from '../../../contracts/abis/FactoryERC20_ABI.json';
import { Network } from 'src/modules/chain/entities/network.entity';
import ERC20_ABI from '../../../contracts/abis/ERC20_ABI.json';
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Network)
    private readonly NetworkRepository: Repository<Network>,
    ) {}

  async deployERC20Token(
    wallet: Wallet,
    tokenParams: { name: string; symbol: string; initialSupply: number },
    chain: string,
  ): Promise<any> {
    const { name, symbol, initialSupply } = tokenParams;
    const methodName = 'CreateNewERC20Token(string,string,uint256)';

    // traer network url
    const urlNetwork = await this.NetworkRepository.findOne({ name: chain });
    if (!urlNetwork) {
      throw new NotFoundException('Chain no encontrado en la base de datos');
    }
 
    const network = urlNetwork.rpc_url;
    const provider = new ethers.JsonRpcProvider(network);

    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC20_FACTORY_ADDRESS),
      FactoryERC20_ABI,
      wallet.connect(provider),
    );
    try {
      const result = await contract[methodName](name, symbol, initialSupply);
      console.log(
        `ERC20 Smart Contract Method "${methodName}" Result:`,
        result,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  getFactoryERC20Contract(wallet: Wallet): Contract {
    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC20_FACTORY_ADDRESS),
      FactoryERC20_ABI,
      wallet,
    );

    return contract;
  }

  async balanceOfERC20Token(
    wallet: Wallet,
    address: string,
    account: string,
  ): Promise<string> {
    //console.log('wallet', wallet);
    const contract = new ethers.Contract(address, ERC20_ABI, wallet);
    const balance = await contract.balanceOf(account);

    console.log(
      'addressERC20: ' +
        address +
        '\n' +
        'account: ' +
        account +
        '\n' +
        'balance: ' +
        balance,
    );

    return balance;
  }

  async transferERC20Token(
    wallet: Wallet,
    address: string,
    to: string,
    value: number,
  ): Promise<void> {
    //console.log('wallet: ', wallet);
    const contract = new ethers.Contract(address, ERC20_ABI, wallet);
    await contract.transfer(to, value);
    console.log(
      'addressERC20: ' +
        address +
        '\n' +
        'to: ' +
        to +
        '\n' +
        'value: ' +
        value,
    );

    return;
  }
}
