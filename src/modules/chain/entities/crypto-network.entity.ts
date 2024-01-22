import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Local Dependencies.
import { StatusEnum } from '../../../shared/enums/status.enum';
import { Network } from './network.entity';
import { Crypto } from './crypto.entity';

@Entity()
export class CryptoNetwork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  contract: string;

  @Column({ nullable: false })
  decimals: number;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;

  @ManyToOne(() => Network)
  @JoinColumn({ name: 'network_id' })
  network: Network;

  @ManyToOne(() => Crypto, (crypto) => crypto.cryptoNetworks)
  @JoinColumn({ name: 'crypto_id' })
  crypto: Crypto;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
