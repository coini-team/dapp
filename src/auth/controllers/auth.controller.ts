// Third Party Dependencies.
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

// Local Dependencies.
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../services/auth.service';
import { SignInDto, SignUpDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  /**
   * @memberof AuthController
   * @description This method is used to sign up a user.
   * @param signUpDto
   * @returns {Promise<void>}
   */
  @Post('signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this._authService.signUp(signUpDto);
  }

  /**
   * @memberof AuthController
   * @description This method is used to sign in a user.
   * @param signInDto
   * @returns {Promise<{
   *   tokens: { accessToken: string; refreshToken: string };
   *   user: JwtPayload;
   *   }>}
   */
  @Post('signin')
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInDto: Partial<SignInDto>): Promise<{
    tokens: { accessToken: string; refreshToken: string };
    user: JwtPayload;
  }> {
    return this._authService.signIn(signInDto);
  }

  /**
   * @memberof AuthController
   * @description This method is used activate a user account.
   * @param token
   * @returns {Promise<User>}
   */
  @Post('activate-account')
  @UsePipes(ValidationPipe)
  async activateAccount(@Body('token') token: string) {
    return this._authService.activateAccount(token);
  }

  /**
   * @memberof AuthController
   * @description This method is used to send a reset password email.
   * @param email
   * @returns {Promise<void>}
   */
  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body('email') email: string) {
    return this._authService.forgotPassword(email);
  }

  /**
   * @memberof AuthController
   * @description This method is used to reset a user password.
   * @param resetPasswordDto
   * @returns {Promise<void>}
   */
  @Post('reset-password')
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() resetPasswordDto: { token: string; password: string }) {
    return this._authService.resetPassword(resetPasswordDto);
  }
}
