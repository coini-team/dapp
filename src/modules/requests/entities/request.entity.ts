import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('requests')
  export class Requests {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'projectId', nullable: false, type: 'varchar' })
    projectId: string;
  
    @Column({ name: 'endpoint', nullable: false, type: 'varchar' })
    endpoint: string;
  
    @Column({ name: 'access_token', nullable: true, type: 'varchar' })
    accessToken: string;
  
    @Column({ name: 'request', nullable: true, type: 'text' })
    request: string;
  
    @Column({ name: 'response', nullable: false, type: 'text' })
    response: string;
  
    @Column({ name: 'status_code', type: 'varchar', default: '' })
    statusCode: string;
  
    @Column({ name: 'duration', nullable: true, type: 'varchar' })
    duration: string;
  
    @Column({ name: 'ip', nullable: true, type: 'varchar' })
    ip: string;
  
    @UpdateDateColumn({ type: 'timestamp', name: 'call_date' })
    callDate: string;
  }