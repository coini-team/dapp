import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { ModeEnum } from 'src/shared/enums/mode.enum';
// import { Chain } from 'src/modules/chain/entities/chain.entity';
import { Access } from 'src/modules/user/entities/access.entity';
import { Network } from 'src/modules/chain/entities/network.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  organization_id: number; // TODO: Add Relation with Organization.

  @Column({ length: 500 })
  name: string;

  @Column()
  description: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({
    name: 'refresh_token',
  })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: ModeEnum,
    default: ModeEnum.DEVELOPMENT,
  })
  mode: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;

  @OneToMany(() => Access, (access) => access.project)
  accessList: Access[];

  @ManyToOne(() => Network, (network) => network.rpc_chain_name)
  @JoinColumn({ name: 'network' }) 
  network: Network;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
