import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { TaskTitle } from './task-title.entity';
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
  descriptionAr: string | null;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string | null;

  @Column({ name: 'source_department_id', nullable: true, type: 'int' })
  sourceDepartmentId: number | null;

  @Column({ name: 'target_department_id', nullable: true, type: 'int' })
  targetDepartmentId: number | null;

  @Column({ name: 'created_by', type: 'varchar' })
  createdBy: string;

  @Column({ name: 'assigned_to', nullable: true, type: 'varchar' })
  assignedTo: string | null;

  @Column({ name: 'assigned_to_department_id', nullable: true, type: 'int' })
  assignedToDepartmentId: number | null;

  @Column({ name: 'task_title_id', type: 'int', nullable: true })
  taskTitleId: number | null;

  @Column({ length: 50, default: 'draft' })
  status: string;

  @Column({ name: 'due_date', nullable: true, type: 'timestamp' })
  dueDate: Date | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @ManyToOne(() => TaskTitle)
  @JoinColumn({ name: 'task_title_id' })
  taskTitle: TaskTitle;

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
