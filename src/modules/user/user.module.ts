import { Logger, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericMapper } from '../../shared/helpers';
import { User } from './entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { Role } from '../role/entities/role.entity';
import { RoleGranted } from './entities/roles-granted.entity';
import { Access } from './entities/access.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, RoleGranted, Access]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, GenericMapper, Logger],
})
export class UserModule {}
