import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'action_type', length: 50 })
  actionType: string;

  @Column({ length: 100 })
  entity: string;

  @Column({ name: 'entity_id', length: 50 })
  entityId: string;

  @Column({ name: 'old_value', type: 'jsonb', nullable: true })
  oldValue: any;

  @Column({ name: 'new_value', type: 'jsonb', nullable: true })
  newValue: any;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'ip_address', length: 50, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', length: 500, nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
