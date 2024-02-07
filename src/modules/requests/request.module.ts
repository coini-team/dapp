// Third Party Dependencies.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local Dependencies.
import { ApiRequests } from './entities/request.entity';
import { RequestService } from './services/request.service';
import { RequestController } from './controllers/request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ApiRequests,
    ])
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class ApiTrakingModule {}