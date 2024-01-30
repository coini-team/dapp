import { User } from '../../modules/user/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { SignUpDto } from '../dto';
import { Role } from '../../modules/role/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleTypeEnum } from '../../shared/enums/role-type.enum';
import { genSalt, hash } from 'bcryptjs';
import { RoleGranted } from 'src/modules/user/entities/roles-granted.entity';
import { SmtpService } from 'src/modules/smtp/services/smtp.service';
import { NotFoundException } from '@nestjs/common';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { GetUserDto } from 'src/modules/user/dto';
import { GenericMapper } from 'src/shared/helpers';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  private readonly _roleType = RoleTypeEnum;
  private readonly mapper = new GenericMapper();
  constructor(
    @InjectRepository(RoleGranted)
    private readonly _roleGrantedRepository: Repository<RoleGranted>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _smtpService: SmtpService,
  ) {
    super();
  }

  async signUp(user: SignUpDto, token: string) {
    // Get user data from DTO.
    const { name, lastName, email, password }: SignUpDto = user;
    // Get default role from database.
    const defaultRole = await this._roleRepository.findOne({
      where: { name: this._roleType.MEMBER },
    });
    // Generate Salt and Hash password.
    const salt = await genSalt(10);
    // Create new user instance.
    const newUser = this._userRepository.create({
      name,
      lastName,
      email,
      password: await hash(password, salt),
    });

    // Create RoleGranted instance.
    const roleGranted = new RoleGranted();

    // Assign role to user.
    roleGranted.user = newUser;
    roleGranted.role = defaultRole;
    // Set activation token to user.
    newUser.activationToken = token;

    // Send Verification Email.
    await this._smtpService.sendEmailToConfirmEmailAddress(
      newUser.name,
      newUser.email,
      newUser.activationToken,
    );

    // Save user.
    await this._userRepository.save(newUser);

    // Save role granted.
    await this._roleGrantedRepository.save(roleGranted);
  }

  async activateAccount(token: string): Promise<GetUserDto> {
    // Find user by activation token.
    const user = await this._userRepository.findOne({
      where: { activationToken: token },
    });
    // If user not found throw error.
    if (!user) throw new NotFoundException('User not found');

    // Activate user account and remove activation token.
    user.status = StatusEnum.ACTIVE;
    user.activationToken = null;

    // Save user.
    await this._userRepository.save(user);

    // Map user to GetUserDto.
    const userDto: GetUserDto = this.mapper.map(user, GetUserDto);

    return userDto;
  }
}
