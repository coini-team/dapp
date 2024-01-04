// Third Party Dependencies.
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Local Dependencies.
import { Role } from '../../role/entities/role.entity';
import { StatusEnum } from '../../../shared/enums/status.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false, length: 45, type: 'varchar' })
  name: string;

  @Column({ name: 'last_name', nullable: true, length: 45, type: 'varchar' })
  lastName: string;

  @Column({ name: 'email', nullable: true, length: 45, type: 'varchar' })
  email: string;

  @Column({ name: 'password', nullable: false, length: 255, type: 'varchar' })
  password: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
