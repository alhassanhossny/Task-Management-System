import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskComment } from '../../domain/entities/task-comment.entity';
import { Task } from '../../domain/entities/task.entity';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { Notification } from '../../domain/entities/notification.entity';
import { CommentsController } from '../controllers/comments.controller';
import { CommentService } from '../../application/services/comment.service';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { NotificationService } from '../../application/services/notification.service';
import { TaskService } from '../../application/services/task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskComment, Task, AuditLog, Notification]),
  ],
  controllers: [CommentsController],
  providers: [CommentService, AuditService, NotificationService, TaskService],
})
export class CommentsModule {}
