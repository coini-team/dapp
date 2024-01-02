// Third Party Dependencies.
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Local Dependencies.
import { walletType } from 'src/shared/enums/wallet-type.enum';
import { StatusEnum } from '../../../shared/enums/status.enum';

@Entity()
export class ReceiverWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  address: string;

  @Column({
    type: 'enum',
    enum: walletType,
  })
  type: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;
}
