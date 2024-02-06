import { Module } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { AuthModule } from '../../auth/auth.module';
import { User } from '../user/entities/user.entity';
import { Chain } from '../chain/entities/chain.entity';
import { Access } from '../user/entities/access.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, Chain, Access]),
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
