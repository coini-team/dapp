import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Network } from '../entities/network.entity';
import { CryptoNetwork } from '../entities/crypto-network.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChainService {
  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
    @InjectRepository(CryptoNetwork)
    private readonly cryptoNetworkRepository: Repository<CryptoNetwork>,
  ) {}

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
