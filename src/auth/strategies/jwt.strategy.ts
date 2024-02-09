import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { JwtEnv } from '../../config/config.keys';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly _statusEnum = StatusEnum;

  constructor(
    private readonly _configService: ConfigService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(JwtEnv.JWT_REFRESH_SECRET),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const { email } = payload;
    const user = await this._userRepository.findOne({
      where: { email, status: this._statusEnum.ACTIVE },
      relations: ['rolesGranted', 'rolesGranted.role'],
    });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
