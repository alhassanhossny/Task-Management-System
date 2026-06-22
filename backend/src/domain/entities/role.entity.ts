import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_ar', length: 100 })
  nameAr: string;

  @Column({ name: 'name_en', length: 100 })
  nameEn: string;

  @Column({ type: 'jsonb', default: [] })
  permissions: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => User, user => user.role)
  users: User[];
}
