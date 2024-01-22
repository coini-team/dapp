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
import { Project } from 'src/modules/project/entities/project.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', nullable: false, length: 45, type: 'varchar' })
  name: string;

  @Column({ name: 'last_name', nullable: true, length: 45, type: 'varchar' })
  lastName: string;

  @Column({ name: 'email', nullable: true, length: 45, type: 'varchar' })
  email: string;

  @Column({ name: 'password', nullable: false, length: 255, type: 'varchar' })
  password: string;

  @Column({ name: 'wallet', nullable: false, length: 45, type: 'varchar' })
  wallet: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable({
    name: 'access',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
  })
  projects: Project[];

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
