// Third Party Dependencies.
import { Contract, ethers, Wallet } from 'ethers';
import { Injectable, NotFoundException } from '@nestjs/common';

// Local Dependencies.
import FactoryERC721_ABI from '../../../contracts/abis/FactoryERC721_ABI.json';
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';
import { DeployNftDto } from '../dto/deploy-nft.dto';

@Injectable()
export class NftService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * @todo Refactor this.
   * @task Deploy ERC721 Token.
   * @description This method will deploy an ERC721 Token.
   */
  async deployERC721Token(
    wallet: Wallet,
    tokenParams: DeployNftDto,
    rpcUrl: string,
  ): Promise<any> {
    const { name, symbol } = tokenParams;
    const methodName = 'createNewContract(string,string)'; // TODO: Change this to the correct method name from the ABI.
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC721_FACTORY_ADDRESS),
      FactoryERC721_ABI,
      wallet.connect(provider),
    );
    try {
      const result = await contract[methodName](name, symbol);
      console.log(
        `ERC721 Smart Contract Method "${methodName}" Result:`,
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

  /**
   * @todo Refactor this.
   * @task Get ERC721 Contract.
   * @description This method will return the ERC721 Contract.
   */
  async getERC721Contract(wallet: Wallet): Promise<Contract> {
    // TODO: Change this to the correct ABI.
    const abi = [
      {
        constant: false,
        inputs: [
          {
            name: '_name',
            type: 'string',
          },
          {
            name: '_symbol',
            type: 'string',
          },
        ],
        name: 'createNewContract',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'contractAddress',
            type: 'address',
          },
        ],
        name: 'NewContract',
        type: 'event',
      },
    ];

    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC721_FACTORY_ADDRESS),
      abi,
      wallet,
    );

    return contract;
  }

  /**
   * @todo Refactor this.
   * @task Get Owner of ERC721 Token.
   * @description This method will return the owner of an ERC721 Token.
   */
  async ownerOfERC721(tokenId: string): Promise<string> {
    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_TESNET_URL);
    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC721_FACTORY_ADDRESS),
      [], // TODO: Add ABI.
      provider,
    );
    try {
      const owner = await contract.ownerOf(tokenId);
      return owner;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @todo Refactor this.
   * @task Get Token URI.
   * @description This method will return the URI of an ERC721 Token.
   */
  async getTokenURI(tokenId: string): Promise<string> {
    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_TESNET_URL);
    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC721_FACTORY_ADDRESS),
      [], // TODO: Add ABI.
      provider,
    );
    try {
      const uri = await contract.tokenURI(tokenId);
      return uri;
    } catch (error) {
      throw error;
    }
  }

  // TODO: receive chain
  // async setTokenURI(tokenId: number, tokenURI: string): Promise<void> {
  //   const wallet = this.walletService.getWallet();
  //   const contractERC721 = await this.getERC721Contract(wallet);
  //   const owner = await contractERC721.ownerOf(tokenId);

  //   if (owner !== (await wallet.getAddress())) {
  //     throw new Error("No tienes permiso para establecer el URI del token.");
  //   }

  //   // Llamar a la función del contrato para establecer el URI del token
  //   await contractERC721.setTokenURI(tokenId, tokenURI);
  // }

  // TODO: receive chain
  // async getOwnerOfToken(tokenId: number): Promise<string> {
  //   const wallet = this.walletService.getWallet();
  //   const contractERC721 = await this.getERC721Contract(wallet);

  //   if (!(await contractERC721.ownerOf(tokenId)).call()) {
  //     throw new Error('Token no existente');
  //   }

  //   // Llamar a la función del contrato para obtener el propietario del token
  //   return await contractERC721.ownerOf(tokenId);
  // }
}
