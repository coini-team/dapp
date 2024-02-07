// Third Party Dependencies.
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSalt, hash, compare } from 'bcryptjs';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Headers,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

// Local Dependencies.
import { StatusEnum } from '../../../shared/enums/status.enum';
import { GenericMapper } from '../../../shared/helpers';
import { User } from '../entities/user.entity';
import { GetUserDto } from '../dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { passwordDto } from '../dto/password.dto';
import { Role } from '../../role/entities/role.entity';
import { AuthService } from '../../../auth/services/auth.service';
import { RoleGranted } from '../entities/roles-granted.entity';

@Injectable()
export class UserService {
  // Logger.
  private readonly _logger = new Logger(':::: UserService ::::');
  // Mapper for DTOs.
  private readonly mapper = new GenericMapper();
  // Status Enum.
  private readonly _statusEnum = StatusEnum;
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    @InjectRepository(RoleGranted)
    private readonly _roleGrantedRepository: Repository<RoleGranted>,
    private readonly _authService: AuthService,
  ) {}

  async get(@Headers('authorization') authHeader: string): Promise<GetUserDto> {
    try {
      // Validate if the id is empty.
      const userAuth = await this._authService.getUserFromAuthToken(authHeader);

      // Find the user with the id and status active.
      const user = await this._userRepository.findOne({
        where: { status: this._statusEnum.ACTIVE, id: userAuth.id },
        select: ['id', 'name', 'lastName', 'email', 'wallet'],
      });

      return this.mapper.map<User, GetUserDto>(user, GetUserDto);
    } catch (error) {
      // Handle errors appropriately, log them, and rethrow if necessary.
      this._logger.error(error);
      throw new BadRequestException(error.message || 'Bad request');
    }
  }

  async update(
    updates: Partial<User>,
    @Headers('authorization') authHeader: string
  ): Promise<User> {
    await this._authService.getUserFromAuthToken(authHeader);
    const userExists: User = await this._userRepository.findOne({ where: { status: this._statusEnum.ACTIVE } });
    !userExists && new NotFoundException();
  
    // Actualizar solo los campos proporcionados en el objeto 'updates'
    Object.assign(userExists, updates);
  
    return await this._userRepository.save(userExists);
  }

  async delete(
    @Headers('authorization') authHeader: string
  ): Promise<User> {
    await this._authService.getUserFromAuthToken(authHeader);
    // Validate if the user exists.
    const userExists: User = await this._userRepository.findOne({
      where: { status: this._statusEnum.ACTIVE },
    });

    // Verificar si el usuario existe
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar el campo 'status' a 'inactive'
    userExists.status = this._statusEnum.INACTIVE;

    // Guardar los cambios en la base de datos
    return await this._userRepository.save(userExists);
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
    // Validate if the id is empty.
    !userId && new BadRequestException('id must be sent');
    // Validate if the user exists.
    const userExists: User = await this._userRepository.findOne(userId, {
      where: { status: this._statusEnum.ACTIVE },
    });
    // Validate if the user exists.
    !userExists && new NotFoundException();
    // Validate if the role exists.
    const roleExists = await this._roleRepository.findOne(roleId, {
      where: { status: this._statusEnum.ACTIVE },
    });
    // Validate if the role exists.
    !roleExists && new NotFoundException();
    // Add the role to the user.
    const roleGranted = this._roleGrantedRepository.create({
      user: userExists,
      role: roleExists,
    });

    // Save the role.
    await this._roleGrantedRepository.save(roleGranted);

    // Save the user.
    await this._userRepository.save(userExists);
    // Return true.
    return true;
  }

  async updatePassword(
    passwordDto: passwordDto,
    @Headers('authorization') authHeader: string
  ): Promise<User> {
    // Obtain user from authentication token
  const user: User = await this._authService.getUserFromAuthToken(authHeader);

  // Validate user existence and status
  if (!user || user.status !== this._statusEnum.ACTIVE) {
    throw new NotFoundException("User not found or inactive.");
  }

  // Extract hashedAuthToken from the password field in authHeader
  const hashedAuthToken: string = user.password;

  // Decrypt the current password using the extracted hash
  const isCurrentPasswordValid: boolean = await compare(
    passwordDto.currentPassword,
    hashedAuthToken
  );

  // If the current password is valid, update it with the new password
  if (isCurrentPasswordValid) {
    // Encrypt the new password with bcrypt
    //const hashedNewPassword: string = await bcrypt.hash(passwordDto.newPassword, 40);
    const salt = await genSalt(10);
    
    const hashedNewPassword = await hash(passwordDto.newPassword, salt); 
    
    // Update user's password
    user.password = hashedNewPassword;

    // Save the updated user in the repository
    return await this._userRepository.save(user);
  } else {
    // Throw an exception if the current password is not valid
    throw new UnauthorizedException("Invalid current password.");
  }
  }
} 
