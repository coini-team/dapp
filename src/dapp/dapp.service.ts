import { Injectable } from '@nestjs/common';
import { Contract, HDNodeWallet, Wallet, ethers } from 'ethers';

@Injectable()
export class DappService {
  private readonly ERC20FactoryAddress =
    '0xE2B580433Bc05Ac3cEfF0041654c4176149Cb7c0';
  private readonly ERC721FactoryAddress =
    '0x7665ca8bDf738423BE54736c4796E1505D74d09d';
  private readonly walletPrivateKey: string;

  getWallet(): Wallet {
    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_TESNET_URL);
    const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    return wallet;
  }

  createRandomWallet(): HDNodeWallet {
    const randomWallet = Wallet.createRandom();
    console.log(`New Wallet Address: ${randomWallet.address}`);
    console.log(`Private Key: ${randomWallet.privateKey}`);

    return randomWallet;
  }

  async deployERC20Token(
    wallet: Wallet,
    tokenParams: { name: string; symbol: string; supply: number },
  ): Promise<string> {
    const { name, symbol, supply } = tokenParams;
    const methodName = 'CreateNewERC20Token(string,string,uint256)';

    const contract = await this.getERC20Contract(wallet);

    try {
      const result = await contract[methodName](name, symbol, supply);
      console.log(`Smart Contract Method "${methodName}" Result:`, result);

      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async deployERC721Token(
    wallet: Wallet,
    tokenParams: { name: string; symbol: string },
  ): Promise<string> {
    const { name, symbol } = tokenParams;

    const abi = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_symbol",
            "type": "string"
          },
        ],
        "name": "createNewContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    const methodName = 'createNewContract(string,string)';

    const contract = new ethers.Contract(
      this.ERC721FactoryAddress,
      abi,
      wallet,
    );

    try {
      const result = await contract[methodName](name, symbol);
      console.log(`Smart Contract Method "${methodName}" Result:`, result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getERC721Contract(wallet: Wallet): Promise<Contract> {
    const abi = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_symbol",
            "type": "string"
          },
        ],
        "name": "createNewContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "contractAddress",
            "type": "address"
          }
        ],
        "name": "NewContract",
        "type": "event"
      },
    ];

    const contract = new ethers.Contract(
      this.ERC721FactoryAddress,
      abi,
      wallet,
    );

    return contract;
  }

  async getERC20Contract(wallet: Wallet): Promise<Contract> {
    const abi = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_symbol",
            "type": "string"
          },
          {
            "name": "_supply",
            "type": "uint256"
          }
        ],
        "name": "CreateNewERC20",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "erc20TokenAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "NewERC20TokenContract",
        "type": "event"
      },
    ];

    const contract = new ethers.Contract(this.ERC20FactoryAddress, abi, wallet);

    return contract;
  }

  async balanceOfERC20Token(
    wallet: Wallet,
    addressERC20: string,
    account: string
  ): Promise<string> {

    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    console.log('wallet', wallet);
    const contract = new ethers.Contract(addressERC20, abi, wallet);
    var balance = await contract.balanceOf(account);
    console.log("addressERC20: " + addressERC20);
    console.log("account: " + account);
    console.log("balance: " + balance);
    return balance;
  }

  async transferERC20Token(
    wallet: Wallet,
    addressERC20: string,
    to: string,
    value: number
  ): Promise<void> {

    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    console.log('wallet', wallet);
    const contract = new ethers.Contract(addressERC20, abi, wallet);
    var balance = await contract.transfer(to, value);
    console.log("addressERC20: " + addressERC20);
    console.log("to: " + to);
    console.log("value: " + value);
    return;
  }

  async listenForEvent() {
    console.log(':::Listening for contract events:::');
    const contractERC721 = await this.getERC721Contract(this.getWallet());
    contractERC721.on('NewContract', (contractAddress) => {
      console.log('Event received:', contractAddress);
    });

    const contractERC20 = await this.getERC20Contract(this.getWallet());
    contractERC20.on('NewERC20TokenContract', (erc20TokenAddress, index) => {
      console.log('Event received:', erc20TokenAddress);
      console.log('Array index:', index);
    });
  }

  async ownerOfERC721(tokenId: string): Promise<string> {
    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_TESNET_URL);
    const contract = new ethers.Contract(this.ERC721FactoryAddress, abi , provider) ; 
    try {
      const owner = await contract.ownerOf(tokenId);
      return owner;
    } catch (error) {
      throw error;
    }
  }

  async getTokenURI(tokenId: string): Promise<string> {
    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_TESNET_URL);
    const contract = new ethers.Contract(this.ERC721FactoryAddress, abi, provider);
    try {
      const uri = await contract.tokenURI(tokenId);
      return uri;
    } catch (error) {
      throw error;
    }
  }
}

