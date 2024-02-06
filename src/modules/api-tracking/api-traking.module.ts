// Third Party Dependencies.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local Dependencies.
import { ApiTracking } from './entities/api-traking.entity';
import { ApiTrackingService } from './services/api-traking.service';
import { ApiTrackingController } from './controllers/api-traking.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ApiTracking,
    ])
  ],
  providers: [ApiTrackingService],
  controllers: [ApiTrackingController],
})
export class ApiTrakingModule {}