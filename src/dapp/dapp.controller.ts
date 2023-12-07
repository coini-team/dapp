import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { DappService } from './dapp.service';

@Controller('dapp')
export class DappController {
  constructor(private readonly dappService: DappService) {}
  @Get()
  getDapp() {
    return 'First dApp';
  }

  @Get(':id')
  getParam(@Param('id') id: string): string {
    return `Get params ${id}`;
  }

  @Post('api/wallet')
  createWallet(@Body('token') token: string) {
    if (token) {
      console.log('Auth Token validation here');
    }
    const wallet = this.dappService.createRandomWallet();
    const res = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      seedphrase: wallet.mnemonic.phrase,
    };
    return res;
  }

  @Post('api/token')
  @HttpCode(HttpStatus.CREATED)
  async deployToken(
    @Body()
    tokenParams: {
      type: string;
      name: string;
      symbol: string;
      supply: number;
    },
  ) {
    //authentication logic

    //get wallet to sign
    const wallet = this.getWallet();
    let contractAddress: string;
    if (tokenParams.type == 'ERC20') {
      contractAddress = await this.deployERC20Token(tokenParams, wallet);
    } else if (tokenParams.type == 'ERC721') {
      contractAddress = await this.deployERC721Token(tokenParams, wallet);
    }

    return { contractAddress };
  }

  @Post('api/erc20/balanceOf')
  async balanceOfERC20Token(@Body('addressERC20') addressERC20: string, @Body('account') account: string){
    const wallet = this.getWallet();
    console.log('addressERC20 Init: ' + addressERC20);
    console.log('account Init: ' + account);
    var balance = await this.dappService.balanceOfERC20Token(wallet, addressERC20, account);
    console.log('balanceController: ' + balance);
    console.log(typeof balance);
    balance = balance.toString();
    return { balance };
  }

  @Post('api/erc20/transfer')
  async transferERC20Token(@Body('addressERC20') addressERC20: string, @Body('to') to: string, @Body('value') value: number){
    const wallet = this.getWallet();
    console.log('addressERC20 Init: ' + addressERC20);
    console.log('to Init: ' + to);
    console.log('value Init: ' + value);
    await this.dappService.transferERC20Token(wallet, addressERC20, to, value);
    return { };
  }

  async deployERC20Token(tokenParams: any, wallet: any) : Promise<string>{
    //call method to deploy the ERC20 token
    const contractAddress = await this.dappService.deployERC20Token(
      wallet,
      tokenParams,
    );

    return contractAddress;
  }

  async deployERC721Token(tokenParams: any, wallet: any) {
    //call method to deploy the ERC20 token
    const contractAddress = await this.dappService.deployERC721Token(
      wallet,
      tokenParams,
    );

    return contractAddress;
  }

  private getWallet(): any {
    return this.dappService.getWallet();
  }

  @Get('owner/:tokenId')
  async getOwnerOfERC721Token(@Param('tokenId') tokenId: string) {
    const owner = await this.dappService.ownerOfERC721(tokenId);
    return { owner };
  }

  @Get('token_URI/:tokenId')
  async getUriOfToken(@Param('tokenId') tokenId: string) {
    const tokenURI = await this.dappService.getTokenURI(tokenId);
    return { tokenURI };
  }
}
