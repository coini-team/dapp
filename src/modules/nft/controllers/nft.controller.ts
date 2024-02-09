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
  UsePipes,
  ValidationPipe,
  Headers,
} from '@nestjs/common';

// Local Dependencies.
import { NftService } from '../services/nft.service';
import { WalletService } from '../../wallet/services/wallet.service';
import { DeployNftDto } from '../dto/deploy-nft.dto';
import { AuthGuard } from "@nestjs/passport";

@Controller('nft')
export class NftController {
  constructor(
    private readonly nftService: NftService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * @memberof NftController
   * @description Deploy an ERC721 Token.
   * @param {Object} tokenParams - Token Parameters.
   * @returns {string} - Contract Address.
   */
  @Post()
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(AuthGuard(), ApiKeyGuard)
  public async deployERC721Token(
    @Body() tokenParams: DeployNftDto,
    @Query('chain') chain: string,
    @Headers('authorization') authHeader: string,
  ): Promise<any> {
    try {
      const rpcUrl = await this.walletService.getRpcUrl(chain);
      // Get Wallet to Sign.
      const wallet = this.walletService.getWallet(rpcUrl);
      //call method to deploy the ERC721 token
      const result = await this.nftService.deployERC721Token(
        wallet,
        tokenParams,
        rpcUrl,
        authHeader,
      );
      return { success: true, data: result };
    } catch (error) {
      throw error;
    }
  }

  @Get('owner/:tokenId')
  async getOwnerOfERC721Token(@Param('tokenId') tokenId: string) {
    const owner = await this.nftService.ownerOfERC721(tokenId);
    return { owner };
  }

  @Get('token_URI/:tokenId')
  async getUriOfToken(@Param('tokenId') tokenId: string) {
    const tokenURI = await this.nftService.getTokenURI(tokenId);
    return { tokenURI };
  }

  // TODO: receive chain
  // @Post(':tokenId/set-uri')
  // async setTokenURI(
  //   @Param('tokenId') tokenId: number,
  //   @Body('tokenURI') tokenURI: string,
  // ): Promise<void> {
  //   await this.nftService.setTokenURI(tokenId, tokenURI);
  // }

  // TODO: receive chain
  // @Get(':tokenId/owner')
  // async getOwnerOfToken(@Param('tokenId') tokenId: number): Promise<string> {
  //   return this.nftService.getOwnerOfToken(tokenId);
  // }
}
