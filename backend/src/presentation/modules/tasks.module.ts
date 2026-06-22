import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../domain/entities/task.entity';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { Notification } from '../../domain/entities/notification.entity';
import { TasksController } from '../controllers/tasks.controller';
import { TaskService } from '../../application/services/task.service';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { NotificationService } from '../../application/services/notification.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, AuditLog, Notification]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TaskService, AuditService, NotificationService],
  exports: [TaskService],
})
export class TasksModule {}
