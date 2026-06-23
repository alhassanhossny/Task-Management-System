import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('task_titles')
export class TaskTitle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title_ar', length: 500 })
  titleAr: string;

  @Column({ name: 'title_en', length: 500 })
  titleEn: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
