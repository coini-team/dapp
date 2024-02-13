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
    try {
      const {
        projectId,
        endpoint,
        accessToken,
        request,
        response,
        statusCode,
        duration,
        ip,
        callDate
      } = requestTrackingInput;

      const requestEntity = this.requestRepository.create({
        projectId,
        endpoint,
        accessToken,
        request: JSON.stringify(request),
        response: JSON.stringify(response),
        statusCode,
        duration,
        ip,
        callDate
      });

      return await this.requestRepository.save(requestEntity);
    } catch (error) {
      // Manejar el error aquí
      throw new Error('No se pudo crear la solicitud: ' + error.message);
    }
  }
}
