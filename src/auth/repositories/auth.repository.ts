import { User } from '../../modules/user/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { SignUpDto } from '../dto';
import { Role } from '../../modules/role/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleTypeEnum } from '../../shared/enums/role-type.enum';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  private readonly _roleType = RoleTypeEnum;
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {
    super();
  }

  async signUp(user: SignUpDto) {
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
      roles: [defaultRole],
    });

    // Save user.
    await this._userRepository.save(newUser);
  }
}