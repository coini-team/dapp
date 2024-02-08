// Third Party Dependencies.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Local Dependencies.
import { Requests } from '../entities/request.entity';
import { RequestDto } from '../dto/request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Requests)
    private readonly requestRepository: Repository<Requests>,
  ) {}

  async create(requestTrackingInput: RequestDto): Promise<Requests> {
    const requestTracking = this.requestRepository.create(requestTrackingInput);
    return await this.requestRepository.save(requestTracking);
  }
}
