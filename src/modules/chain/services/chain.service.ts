//theree party Dependencies
import { Injectable, Logger, BadRequestException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Local Dependencies
import { CryptoNetwork } from '../entities/crypto-network.entity';
import { Network } from '../entities/network.entity';
import { Chain } from '../entities/chain.entity';


@Injectable()
export class ChainService {
  private readonly _logger = new Logger(':::: Project Service ::::', {
    timestamp: true,
  });

  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
    @InjectRepository(Chain)
    private readonly chainRepository: Repository<Chain>,
    @InjectRepository(CryptoNetwork)
    private readonly cryptoNetworkRepository: Repository<CryptoNetwork>,
  ) { }

  /**
  * @memberof ChainService
  * @description This method is used to get all chains from database.
  * @returns {Promise<Chain[]>}
  */
  public async get(): Promise<Chain[]> {
    try {
      return this.chainRepository.find();
    } catch (error) {
      this._logger.error(error);
      throw new BadRequestException(error);
    }
  }

    /**
  * @memberof ChainService
  * @description This method is used to get all chains from database.
  * @returns {Promise<Network[]>}
  */
  public async getNetworkById(
    id: string
  ): Promise<Network[]> {
    try {
      // Search Network by ID.
      // const network = await this.networkRepository.findOne(id);
      const networks = await this.networkRepository.find({
        where: { chain: { id: id } }, // Filter networks by chain ID
        relations: ['chain'], // Load the related chain entity
      });
      if (!networks) {
        throw new NotFoundException(`Network with ID ${id} not found`);
      }
      // Return Network.
      return networks;
    } catch (error) {
      this._logger.error(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * @memberof ChainService
   * @description This method is used to get all networks from database.
   * @returns {Promise<Network[]>}
   */
  public async getAllNetworks(): Promise<Network[]> {
    return this.networkRepository.find();
  }

  /**
   * @memberof ChainService
   * @description This method is used to get all crypto networks from database.
   * @returns {Promise<CryptoNetwork[]>}
   */
  public async getCryptoNetworks(): Promise<CryptoNetwork[]> {
    return await this.cryptoNetworkRepository.find({
      relations: ['network', 'crypto'],
    });
  }
}
