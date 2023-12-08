// Third Party Dependencies.
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

// Local Dependencies.
import { WalletService } from '../../wallet/services/wallet.service';
import { TokenService } from '../services/token.service';

@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * @memberof TokenController
   * @description Deploy an ERC20 Token.
   * @param {Object} tokenParams - Token Parameters.
   * @returns {string} - Contract Address.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async deployERC20Token(
    @Body()
    tokenParams: {
      type: string;
      name: string;
      symbol: string;
      initialSupply: number;
      decimals: number
    },
  ): Promise<string> {
    // Get Wallet to Sign.
    const wallet = this.walletService.getWallet();
    //call method to deploy the ERC20 token
    const contractAddress = await this.tokenService.deployERC20Token(
      wallet,
      tokenParams,
    );

    return contractAddress;
  }

  // TODO: fix BigNumberish
  @Post('transfer')
  public async transferERC20Token(
    @Body('address') address: string,
    @Body('to') to: string,
    @Body('value') value: number,
  ) {
    const wallet = this.walletService.getWallet();
    console.log('addressERC20 Init: ' + address);
    console.log('to Init: ' + to);
    console.log('value Init: ' + value);
    await this.tokenService.transferERC20Token(wallet, address, to, value);
    return {};
  }

  @Get('balance')
  async balanceOfERC20Token(
    @Query('address') address: string,
    @Query('account') account: string,
  ) {
    console.log('addressERC20 Init: ' + address);
    console.log('account Init: ' + account);
    const wallet = this.walletService.getWallet();
    let balance = await this.tokenService.balanceOfERC20Token(
      wallet,
      address,
      account,
    );
    console.log('balanceController: ' + balance);
    console.log(typeof balance);
    balance = balance.toString();
    return { balance };
  }
}
