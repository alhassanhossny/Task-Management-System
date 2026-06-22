import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAttachment } from '../../domain/entities/task-attachment.entity';
import { Task } from '../../domain/entities/task.entity';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { Notification } from '../../domain/entities/notification.entity';
import { AttachmentsController } from '../controllers/attachments.controller';
import { AttachmentService } from '../../application/services/attachment.service';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { NotificationService } from '../../application/services/notification.service';
import { TaskService } from '../../application/services/task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskAttachment, Task, AuditLog, Notification]),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentService, AuditService, NotificationService, TaskService],
})
export class AttachmentsModule {}
