import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany, ManyToOne, JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Department } from './department.entity';
import { Task } from './task.entity';
import { Notification } from './notification.entity';
import { AuditLog } from './audit-log.entity';
import { TaskComment } from './task-comment.entity';
import { TaskAttachment } from './task-attachment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  username: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name_ar', length: 200 })
  fullNameAr: string;

  @Column({ name: 'full_name_en', length: 200 })
  fullNameEn: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Task, task => task.createdByUser, { lazy: true })
  createdTasks: Task[];

  @OneToMany(() => Notification, notification => notification.user, { lazy: true })
  notifications: Notification[];

  @OneToMany(() => AuditLog, audit => audit.user, { lazy: true })
  auditLogs: AuditLog[];

  @OneToMany(() => TaskComment, comment => comment.user, { lazy: true })
  comments: TaskComment[];

  @OneToMany(() => TaskAttachment, attachment => attachment.user, { lazy: true })
  attachments: TaskAttachment[];
}
