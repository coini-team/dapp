// api-tracking.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

// Local Dependencies.
import { ApiRequests } from '../entities/request.entity';
import { RequestDto } from '../dto/request.dto';
import { RequestService } from '../services/request.service';


@Controller('requests')
export class RequestController {
  constructor(private readonly apiTrackingService: RequestService) {}

  @Post()
  async create(@Body() apiTrackingInput: RequestDto): Promise<ApiRequests> {
    return this.apiTrackingService.create(apiTrackingInput);
  }
}
