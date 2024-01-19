import {
  Get,
  Body,
  Patch,
  Param,
  Logger,
  Delete,
  Headers,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { passwordDto } from '../dto/password.dto';
import { GetUserDto } from '../dto';
import { User } from '../entities/user.entity';

@Controller('user')
export class UserController {
  private readonly _logger = new Logger(':::: UserController ::::');
  constructor(private readonly userService: UserService) { }

  @Get()
  async findOne(
    @Headers('authorization') authHeader: string,
  ): Promise<GetUserDto> {
    return await this.userService.get(authHeader);
  }

  @Patch()
  async update(
    @Headers('authorization') authHeader: string,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    return this.userService.update(updateUserDto, authHeader);
  }

  @Delete()
  async remove(@Headers('authorization') authHeader: string,) {
    return this.userService.delete(authHeader);
  }

  @Patch("password")
  async updatePasword(
    @Headers('authorization') authHeader: string,
    @Body() passwordDto
  ): Promise<User> {
    return this.userService.updatePassword(passwordDto, authHeader);
  }
}