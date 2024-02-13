// Third Party Dependencies.
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

// Local Dependencies.
import { WalletService } from '../../wallet/services/wallet.service';
import { TokenService } from '../services/token.service';
import { DeployTokenDto } from '../dto/deploy-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../../role/guards/role.guard';
import { ApiKeyGuard } from '../../project/guards/api-key.guard';
import { RoleProtect } from '../../role/decorators/role.decorator';

@Controller('token')
@UseGuards(ApiKeyGuard)
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
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @RoleProtect('MEMBER', 'ADMIN', 'SUPER_ADMIN')
  async deployERC20Token(
    @Body() tokenParams: DeployTokenDto,
    @Query('network') network: string,
  ): Promise<any> {
    try {
      const rpcUrl = await this.walletService.getRpcUrl(network);
      // Get Wallet to Sign.
      const wallet = this.walletService.getWallet(rpcUrl);
      //call method to deploy the ERC20 token
      const result = await this.tokenService.deployERC20Token(
        wallet,
        tokenParams,
        rpcUrl,
      );
      return { success: true, data: result };
    } catch (error) {
      throw error;
    }
  }

  // TODO: receive chain
  // @Post('transfer')
  // public async transferERC20Token(
  //   @Body('address') address: string,
  //   @Body('to') to: string,
  //   @Body('value') value: number,
  // ) {
  //   const wallet = this.walletService.getWallet();
  //   console.log('addressERC20 Init: ' + address);
  //   console.log('to Init: ' + to);
  //   console.log('value Init: ' + value);
  //   await this.tokenService.transferERC20Token(wallet, address, to, value);
  //   return {};
  // }

  // TODO: receive chain
  // @Get('balance')
  // async balanceOfERC20Token(
  //   @Query('address') address: string,
  //   @Query('account') account: string,
  // ) {
  //   console.log('addressERC20 Init: ' + address);
  //   console.log('account Init: ' + account);
  //   const wallet = this.walletService.getWallet();
  //   let balance = await this.tokenService.balanceOfERC20Token(
  //     wallet,
  //     address,
  //     account,
  //   );
  //   console.log('balanceController: ' + balance);
  //   console.log(typeof balance);
  //   balance = balance.toString();
  //   return { balance };
  // }
}
