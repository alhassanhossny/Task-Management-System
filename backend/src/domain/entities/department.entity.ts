import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_ar', length: 200 })
  nameAr: string;

  @Column({ name: 'name_en', length: 200 })
  nameEn: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => User, user => user.department)
  users: User[];

  @OneToMany(() => Task, task => task.sourceDepartment)
  sourceTasks: Task[];

  @OneToMany(() => Task, task => task.targetDepartment)
  targetTasks: Task[];
}
