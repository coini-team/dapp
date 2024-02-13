// Third Party Dependencies.
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

// Local Dependencies.
import { Project } from 'src/modules/project/entities/project.entity';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { Chain } from './chain.entity';

@Entity()
export class Network {
  @PrimaryColumn()
  id: number;

  @Column({ length: 25 })
  name: string;

  @Column({ length: 50 })
  icon: string;

  @Column({ length: 20 })
  rpc_chain_name: string;

  @Column({ length: 10 })
  rpc_chain_id: string;

  @Column({ length: 100 })
  rpc_url: string;

  @Column({ length: 100 })
  rpc_ws: string;

  @OneToMany(() => Project, (project) => project.network)
  projects: Project[];

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;

  @ManyToOne(() => Chain, (chain) => chain.networks)
  @JoinColumn({ name: 'chain_id' })
  chain: Chain;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
