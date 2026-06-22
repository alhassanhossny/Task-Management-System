import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { TaskComment } from './task-comment.entity';
import { TaskAttachment } from './task-attachment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_number', unique: true, length: 20 })
  taskNumber: string;

  @Column({ name: 'title_ar', length: 500 })
  titleAr: string;

  @Column({ name: 'title_en', length: 500 })
  titleEn: string;

  @Column({ name: 'description_ar', type: 'text', nullable: true })
  descriptionAr: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ name: 'source_department_id', nullable: true })
  sourceDepartmentId: number;

  @Column({ name: 'target_department_id', nullable: true })
  targetDepartmentId: number;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string;

  @Column({ name: 'assigned_to_department_id', nullable: true })
  assignedToDepartmentId: number;

  @Column({ length: 50, default: 'draft' })
  status: string;

  @Column({ name: 'due_date', nullable: true })
  dueDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'source_department_id' })
  sourceDepartment: Department;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'target_department_id' })
  targetDepartment: Department;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'assigned_to_department_id' })
  assignedToDepartment: Department;

  @OneToMany(() => TaskComment, comment => comment.task)
  comments: TaskComment[];

  @OneToMany(() => TaskAttachment, attachment => attachment.task)
  attachments: TaskAttachment[];
}
