// Third Party Dependencies.
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Local Dependencies.
import { MessageService } from '../../modules/message/services/message.service';
import { ConfigService } from 'src/config/config.service';
import { JwtEnv } from '../../config/config.keys';
import { AuthRepository } from '../repositories/auth.repository';
import { SignInDto, SignUpDto } from '../dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { SmtpService } from 'src/modules/smtp/services/smtp.service';
import { GetUserDto } from 'src/modules/user/dto';

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
    private readonly _smtpService: SmtpService,
  ) {}

  /**
   * @memberof AuthService
   * @description This method is used to sign up a user.
   * @param {SignUpDto} user
   * @returns {Promise<void>}
   * @throws {ConflictException}
   */
  async signUp(user: SignUpDto): Promise<void> {
    const { email }: SignUpDto = user;
    const userExist: User = await this._userRepository.findOne({
      where: { email },
    });
    if (userExist) throw new ConflictException('User already exist');
    // Generate Token for verification.
    const token = await this.generateActivationHash(email);

    return this._authRepository.signUp(user, token);
  }

  /**
   * @memberof AuthService
   * @description This method is used to sign in a user.
   * @param {Partial<SignInDto>} user
   * @returns {Promise<{
   *  tokens: { accessToken: string; refreshToken: string };
   * user: JwtPayload;
   * }>}
   * @throws {ConflictException}
   * @throws {UnauthorizedException}
   * @throws {BadRequestException}
   */
  async signIn(user: Partial<SignInDto>): Promise<{
    tokens: { accessToken: string; refreshToken: string };
    user: JwtPayload;
  }> {
    const { email, password, wallet } = user;

    let userExist;

    if (
      (email && wallet) ||
      (password && wallet) ||
      (email && password && wallet)
    ) {
      throw new BadRequestException(
        'Choice one authentication method. With wallet or with mail',
      );
    } else if (email && password) {
      // Autenticación por correo electrónico y contraseña
      userExist = await this._userRepository.findOne({
        where: { email },
      });
    } else if (wallet) {
      // Autenticación por billetera
      userExist = await this._userRepository.findOne({
        where: { wallet },
      });
    }

    if (!userExist) throw new ConflictException('User does not exist');

    // Validar la contraseña si se proporciona
    if (password) {
      const isMatch = await compare(password, userExist.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: userExist.id,
      name: userExist.name,
      email: userExist.email,
    };

    const tokens = this.generateTokens(payload);

    return {
      user: payload,
      tokens,
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to activate account.
   * @param {string} token
   * @returns {Promise<{ message: string; status: number }>}
   * @throws {NotFoundException}
   */
  async activateAccount(
    token: string,
  ): Promise<{ message: string; status: number }> {
    const user = await this._authRepository.activateAccount(token);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this._smtpService.sendEmailToSuccessfullAccountActivation(
      user.name,
      user.email,
    );

    return {
      message: 'Account Activated',
      status: 200,
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
   * @description This method is used to generate activation hash.
   * @param {string} email
   * @returns {Promise<string>}
   */
  async generateActivationHash(email: string): Promise<string> {
    const salt = await genSalt();
    const hashedEmail = await hash(email, salt);
    return hashedEmail;
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
