// Third Party Dependencies.
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

// Local Dependencies.
import { StatusEnum } from '../../../shared/enums/status.enum';
import { GenericMapper } from '../../../shared/helpers';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { GetUserDto } from '../dto';
import { Role } from '../../role/entities/role.entity';

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
  ) {}

  async get(id: number): Promise<GetUserDto> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Find the user with the id and status active.
    const user: User = await this._userRepository.findOne(id, {
      where: { status: this._statusEnum.ACTIVE },
    });
    // Validate if the user exists.
    !user && new NotFoundException();
    // Map the user to the GetUserDto and return it.
    return this.mapper.map<User, GetUserDto>(user, GetUserDto);
  }
  x;
  async create(user: CreateUserDto): Promise<GetUserDto> {
    // Map the user to the User entity.
    const userEntity: User = this.mapper.map<CreateUserDto, User>(user, User);
    // Save the user and return it.
    const userCreated: User = await this._userRepository.save(userEntity);
    // Map the user to the GetUserDto and return it.
    return this.mapper.map<User, GetUserDto>(userCreated, GetUserDto);
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Validate if the user exists.
    const userExists: User = await this._userRepository.findOne(id, {
      where: { status: this._statusEnum.ACTIVE },
    });
    // Validate if the user exists.
    !userExists && new NotFoundException();
    // Update the user and return it.
    return await this._userRepository.save({
      ...userExists,
      ...user,
    });
  }

  async delete(id: number): Promise<void> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Validate if the user exists.
    const userExists: User = await this._userRepository.findOne(id, {
      where: { status: this._statusEnum.ACTIVE },
    });
    // Validate if the user exists.
    !userExists && new NotFoundException();
    // Delete the user.
    await this._userRepository.update(id, {
      status: this._statusEnum.INACTIVE,
    });
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
    const roleExists: Role = await this._roleRepository.findOne(roleId, {
      where: { status: this._statusEnum.ACTIVE },
    });
    // Validate if the role exists.
    !roleExists && new NotFoundException();
    // Add the role to the user.
    userExists.roles = [...userExists.roles, roleExists];
    // Save the user.
    await this._userRepository.save(userExists);
    // Return true.
    return true;
  }
}
