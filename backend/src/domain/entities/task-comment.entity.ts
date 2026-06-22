import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('task_comments')
export class TaskComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_id' })
  taskId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'mentions', type: 'jsonb', nullable: true })
  mentions: string[];

  @Column({ name: 'is_edited', default: false })
  isEdited: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Task, task => task.comments)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TaskComment, comment => comment.replies)
  @JoinColumn({ name: 'parent_id' })
  parent: TaskComment;

  @OneToMany(() => TaskComment, comment => comment.parent)
  replies: TaskComment[];
}
