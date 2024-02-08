// Third Party Dependencies.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local Dependencies.
import { Requests } from './entities/request.entity';
import { RequestService } from './services/request.service';
import { RequestController } from './controllers/request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Requests,
    ])
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}