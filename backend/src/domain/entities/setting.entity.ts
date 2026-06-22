import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
