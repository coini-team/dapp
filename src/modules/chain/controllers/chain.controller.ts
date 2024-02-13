import { Controller, Get, Param } from '@nestjs/common';
import { ChainService } from '../services/chain.service';
import { Chain } from '../entities/chain.entity';
import { Network } from '../entities/network.entity';

@Controller('chain')
export class ChainController {
  constructor(private readonly chainService: ChainService) { }

  /**
  * @memberof ChainController
  * @description Find all Chain Endpoint.
  * @returns {Promise<Chain[]>}
  */
  @Get()
  get(): Promise<Chain[]> {
    return this.chainService.get();
  }

  /**
  * @memberof ChainController
  * @description Find all Chain Endpoint.
  * @param {string} id
  * @returns {Promise<Chain[]>}
  */
  @Get(':id')
  getNetworkById(
    @Param('id') id: string,
  ): Promise<Network[]> {
    return this.chainService.getNetworkById(id);
  }
}
