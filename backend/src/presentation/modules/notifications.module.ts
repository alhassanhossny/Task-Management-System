import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationsController } from '../controllers/notifications.controller';
import { NotificationService } from '../../application/services/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
