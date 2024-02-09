// api-tracking.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';

// Local Dependencies.
import { Requests } from '../entities/request.entity';
import { RequestDto } from '../dto/request.dto';
import { RequestService } from '../services/request.service';


@Controller('requests')
export class RequestController {
  constructor(private readonly _requestService: RequestService) { }

  @Post()
  async create(@Body() apiTrackingInput: RequestDto): Promise<Requests> {
    return await this._requestService.create(apiTrackingInput);
  }
}
