// Third Party Dependencies.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Local Dependencies.
import { ApiTracking } from '../entities/api-traking.entity';
import { ApiTrackingDto } from '../dto/api-traking.dto';

@Injectable()
export class ApiTrackingService {
  constructor(
    @InjectRepository(ApiTracking)
    private readonly apiTrackingRepository: Repository<ApiTracking>,
  ) {}

  async create(apiTrackingInput: ApiTrackingDto): Promise<ApiTracking> {
    const apiTracking = this.apiTrackingRepository.create(apiTrackingInput);
    return await this.apiTrackingRepository.save(apiTracking);
  }
}
