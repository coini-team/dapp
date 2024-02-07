import {
    Column,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('requests')
  export class ApiRequests {
    @PrimaryColumn({ name: 'projectId', nullable: false, type: 'varchar' })
    ProjectId: string;
  
    @Column({ name: 'endpoint', nullable: false, type: 'varchar' })
    endpoint: string;
  
    @Column({ name: 'access_token', nullable: true, type: 'varchar' })
    accessToken: string;
  
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