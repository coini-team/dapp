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
  UseGuards,
} from '@nestjs/common';

// Local Dependencies.
import { NftService } from '../services/nft.service';
import { WalletService } from '../../wallet/services/wallet.service';
import { DeployNftDto } from '../dto/deploy-nft.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtect } from '../../role/decorators/role.decorator';
import { RoleGuard } from '../../role/guards/role.guard';
import { ApiKeyGuard } from '../../project/guards/api-key.guard';

@Controller('nft')
@UseGuards(ApiKeyGuard)
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
  @RoleProtect('MEMBER', 'ADMIN', 'SUPER_ADMIN')
  public async deployERC721Token(
    @Body() tokenParams: DeployNftDto,
    @Query('network') network: string,
    @Headers('x-api-key') authHeader: string,
  ): Promise<any> {
    try {
      const rpcUrl = await this.walletService.getRpcUrl(network);
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
  @RoleProtect('MEMBER', 'ADMIN', 'SUPER_ADMIN')
  async getOwnerOfERC721Token(@Param('tokenId') tokenId: string) {
    const owner = await this.nftService.ownerOfERC721(tokenId);
    return { owner };
  }

  @Get('token_URI/:tokenId')
  @RoleProtect('MEMBER', 'ADMIN', 'SUPER_ADMIN')
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
