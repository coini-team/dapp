// api-tracking.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

// Local Dependencies.
import { ApiTracking } from '../entities/api-traking.entity';
import { ApiTrackingDto } from '../dto/api-traking.dto';
import { ApiTrackingService } from '../services/api-traking.service';


@Controller('api-tracking')
export class ApiTrackingController {
  constructor(private readonly apiTrackingService: ApiTrackingService) {}

  @Post()
  async create(@Body() apiTrackingInput: ApiTrackingDto): Promise<ApiTracking> {
    return this.apiTrackingService.create(apiTrackingInput);
  }
}
