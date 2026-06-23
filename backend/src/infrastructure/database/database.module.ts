import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import { Department } from '../../domain/entities/department.entity';
import { Task } from '../../domain/entities/task.entity';
import { TaskComment } from '../../domain/entities/task-comment.entity';
import { TaskAttachment } from '../../domain/entities/task-attachment.entity';
import { Notification } from '../../domain/entities/notification.entity';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { Setting } from '../../domain/entities/setting.entity';
import { TaskTitle } from '../../domain/entities/task-title.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Department,
      Task,
      TaskComment,
      TaskAttachment,
      Notification,
      AuditLog,
      Setting,
      TaskTitle,
    ]),
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class DatabaseModule {}
