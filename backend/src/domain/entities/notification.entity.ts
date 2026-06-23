import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 50 })
  type: string;

  @Column({ name: 'title_ar', length: 500 })
  titleAr: string;

  @Column({ name: 'title_en', length: 500 })
  titleEn: string;

  @Column({ name: 'message_ar', type: 'text', nullable: true })
  messageAr: string | null;

  @Column({ name: 'message_en', type: 'text', nullable: true })
  messageEn: string | null;

  @Column({ name: 'entity_type', type: 'varchar', length: 50, nullable: true })
  entityType: string | null;

  @Column({ name: 'entity_id', type: 'varchar', length: 50, nullable: true })
  entityId: string | null;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
