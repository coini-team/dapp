// Third Party Dependencies.
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Local Dependencies.
import { MessageModule } from '../modules/message/message.module';
import { AuthRepository } from './repositories/auth.repository';
import { Role } from '../modules/role/entities/role.entity';
import { ConfigService } from '../config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '../config/config.module';
import { AuthService } from './services/auth.service';
import { JwtEnv } from '../config/config.keys';
import { AuthController } from './controllers/auth.controller';
import { User } from '../modules/user/entities/user.entity';
import { SmtpModule } from 'src/modules/smtp/smtp.module';
import { RoleGranted } from 'src/modules/user/entities/roles-granted.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User, RoleGranted]),
    MessageModule,
    SmtpModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.get(JwtEnv.JWT_REFRESH_SECRET),
          signOptions: {
            expiresIn: config.get(JwtEnv.JWT_REFRESH_EXPIRES_IN),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
