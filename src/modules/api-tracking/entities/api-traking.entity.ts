import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('api_traking')
export class ApiTracking {
  @PrimaryColumn({ name: 'userId', nullable: false, type: 'varchar' })
  userId: string;

  @Column({ name: 'endpoint', nullable: false, type: 'varchar' })
  endPoint: string;

  @Column({ name: 'api_key', nullable: true, type: 'varchar' })
  apiKey: string;

  @Column({ name: 'request', nullable: true, type: 'varchar' })
  request: string;

  @Column({ name: 'response', nullable: false, type: 'varchar' })
  response: string;

  @Column({ name: 'status_code', type: 'varchar', default: '' })
  statusCode: string;

  @Column({ name: 'duration', nullable: true, type: 'int' })
  duration: number;

  @Column({ name: 'ip', nullable: true, type: 'varchar' })
  ip: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'call_date' })
  callDate: Date;
}
