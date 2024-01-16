// Third Party Dependencies.
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Local Dependencies.
import { MessageService } from '../../modules/message/services/message.service';
import { ConfigService } from 'src/config/config.service';
import { JwtEnv } from '../../config/config.keys';
import { AuthRepository } from '../repositories/auth.repository';
import { SignInDto, SignUpDto } from '../dto';
import { compare } from 'bcryptjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RoleTypeEnum } from '../../shared/enums/role-type.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../modules/user/entities/user.entity';

@Injectable()
export class AuthService {
  /**
   * @memberof AuthService
   * @description This method is used to create an instance of AuthService class.
   * @param messageBirdService
   * @param jwtService
   */
  constructor(
    private readonly messageBirdService: MessageService,
    private readonly configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _authRepository: AuthRepository,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async signUp(user: SignUpDto) {
    const { email }: SignUpDto = user;
    const userExist: User = await this._userRepository.findOne({
      where: { email },
    });

    if (userExist) throw new ConflictException('User already exist');

    return this._authRepository.signUp(user);
  }

  async signIn(user: SignInDto): Promise<{
    tokens: { accessToken: string; refreshToken: string };
    user: JwtPayload;
  }> {
    const { email, password } = user;

    const userExist = await this._userRepository.findOne({
      where: { email },
    });

    if (!userExist) throw new ConflictException('User does not exist');

    const isMatch = await compare(password, userExist.password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      id: userExist.id,
      name: userExist.name,
      email: userExist.email,
      roles: userExist.roles.map((role) => role.name as RoleTypeEnum),
    };

    const tokens = this.generateTokens(payload);

    return {
      user: payload,
      tokens,
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to send verification message to recipient.
   * @param {string} recipient
   * @returns {Promise<{ id: string; message: string }>}
   */
  async sendVerifyMessage(
    recipient: string,
  ): Promise<{ id: string; message: string }> {
    // Send message to recipient.
    const response =
      await this.messageBirdService.sendVerificationCode(recipient);
    // Return Response.
    return {
      message: 'Verification Send',
      id: response.id,
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to verify message code.
   * @param {{ recipient: string; token: string }} {
   *    recipient,
   *    token,
   *    }
   * @returns {Promise<{ id: string; message: string }>}
   */
  async verifyMessageCode({
    recipient,
    token,
  }): Promise<{ id: string; message: string }> {
    // Verify Code.
    const response = await this.messageBirdService.verifyCode(recipient, token);
    // Return Response.
    return {
      message: 'Verification Send',
      id: response.id,
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to generate tokens, Access Token and Refresh Token.
   * @param {JwtPayload} payload
   * @returns {Promise<{ accessToken: string; refreshToken: string }>}
   */
  public generateTokens(payload): {
    accessToken: string;
    refreshToken: string;
  } {
    // Generate tokens and return.
    return {
      accessToken: this._jwtService.sign(payload, {
        secret: this.configService.get(JwtEnv.JWT_REFRESH_SECRET),
        expiresIn: this.configService.get(JwtEnv.JWT_REFRESH_EXPIRES_IN),
      }),
      refreshToken: this._jwtService.sign(payload, {
        secret: this.configService.get(JwtEnv.JWT_REFRESH_SECRET),
        expiresIn: this.configService.get(JwtEnv.JWT_REFRESH_EXPIRES_IN),
      }),
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to refresh tokens with refresh token.
   * @param {string} refresh
   * @returns {Promise<{ accessToken: string; refreshToken: string }>}
   */
  async refreshToken(
    refresh: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Validate refresh token and get payload.
    const validate = await this._jwtService.verify(refresh, {
      secret: this.configService.get(JwtEnv.JWT_REFRESH_SECRET),
    });
    // If refresh token is invalid, throw an error.
    if (!validate) throw new Error('refresh token expires');
    // Destructure payload.
    const { id, name } = validate;
    // Generate new tokens and return.
    return this.generateTokens({
      id,
      name,
    });
  }

  /**
   * @memberof AuthService
   * @description This method is used to verify token.
   * @param {string} token
   * @returns {Promise<JwtPayload>}
   */
  public verifyToken(token: string): JwtPayload {
    // Verify token and return payload.
    return this._jwtService.verify(token, {
      secret: this.configService.get(JwtEnv.JWT_REFRESH_SECRET),
    });
  }

  /**
   * @memberof AuthService
   * @description This method is used to get the user from the authorization token.
   * @param {string} authHeader
   * @returns {Promise<User>}
   * @throws {UnauthorizedException}
   * @throws {NotFoundException}
   */
  async getUserFromAuthToken(authHeader: string): Promise<User> {
    // Check if Authorization header is provided.
    if (!authHeader)
      throw new UnauthorizedException('Authorization header is missing.');
    // Verify if Authorization header is valid.
    const token = authHeader.split(' ')[1];
    // Check if token is provided.
    if (!token) throw new UnauthorizedException('Invalid token.');
    // Verify if token is valid.
    const decodedToken = this.verifyToken(token);
    // Search for User.
    const user = await this._userRepository.findOne({
      where: { id: decodedToken.id },
    });
    // Check if User exists.
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }
}
