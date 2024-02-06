// Third Party Dependencies.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Local Dependencies.
import { ApiRequests } from '../entities/request.entity';
import { RequestDto } from '../dto/request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(ApiRequests)
    private readonly requestRepository: Repository<ApiRequests>,
  ) {}

  async create(requestTrackingInput: RequestDto): Promise<ApiRequests> {
    const requestTracking = this.requestRepository.create(requestTrackingInput);
    return await this.requestRepository.save(requestTracking);
  }
}
