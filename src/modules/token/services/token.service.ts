// Third Party Dependencies.
import { Contract, ethers, Wallet } from 'ethers';
import { Injectable, NotFoundException } from '@nestjs/common';

// Local Dependencies.
import FactoryERC20_ABI from '../../../contracts/abis/FactoryERC20_ABI.json';
import ERC20_ABI from '../../../contracts/abis/ERC20_ABI.json';
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';
import { DeployTokenDto } from '../dto/deploy-token.dto';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  async deployERC20Token(
    wallet: Wallet,
    tokenParams: DeployTokenDto,
    rpcUrl: string,
  ): Promise<any> {
    const { name, symbol, initialSupply } = tokenParams;
    const methodName = 'CreateNewERC20Token(string,string,uint256)';
    const provider = new ethers.JsonRpcProvider(rpcUrl);

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
      console.error(error);
      if (error.code === 'INSUFFICIENT_FUNDS') {
        const errorMessage =
          'Saldo insuficiente para cubrir el costo de la transacción';

        // Puedes lanzar una excepción personalizada si lo prefieres
        throw new NotFoundException(errorMessage);
      }
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
