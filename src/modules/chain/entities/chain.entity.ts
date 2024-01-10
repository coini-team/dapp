// Third Party Dependencies.
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Local Dependencies.
import { Network } from './network.entity';
import { StatusEnum } from '../../../shared/enums/status.enum';

@Entity()
export class Chain {
  @PrimaryColumn()
  id: number;

  @Column({ length: 25 })
  name: string;

  @Column({ length: 50 })
  icon: string;

  @OneToMany(() => Network, (network) => network.chain)
  networks: Network[];

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
