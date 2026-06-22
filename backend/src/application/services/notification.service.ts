import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(params: {
    userId: string;
    type: string;
    titleAr: string;
    titleEn: string;
    messageAr?: string;
    messageEn?: string;
    entityType?: string;
    entityId?: string;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create(params);
    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: string, page = 1, limit = 50): Promise<{ data: Notification[]; total: number }> {
    const [data, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id, userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.notificationRepository.delete({ id, userId });
  }

  async deleteAll(userId: string): Promise<void> {
    await this.notificationRepository.delete({ userId });
  }

  async notifyTaskCreated(task: any, targetUserId: string): Promise<void> {
    await this.create({
      userId: targetUserId,
      type: 'task_created',
      titleAr: 'تم إنشاء مهمة جديدة',
      titleEn: 'New Task Created',
      messageAr: `تم إنشاء مهمة جديدة رقم: ${task.taskNumber}`,
      messageEn: `New task created: ${task.taskNumber}`,
      entityType: 'task',
      entityId: task.id,
    });
  }

  async notifyTaskAssigned(task: any, userId: string): Promise<void> {
    await this.create({
      userId,
      type: 'task_assigned',
      titleAr: 'تم تعيين مهمة لك',
      titleEn: 'Task Assigned to You',
      messageAr: `تم تعيين مهمة رقم: ${task.taskNumber} إليك`,
      messageEn: `Task ${task.taskNumber} has been assigned to you`,
      entityType: 'task',
      entityId: task.id,
    });
  }

  async notifyStatusChanged(task: any, userId: string, newStatus: string): Promise<void> {
    await this.create({
      userId,
      type: 'status_changed',
      titleAr: 'تم تغيير حالة المهمة',
      titleEn: 'Task Status Changed',
      messageAr: `تم تغيير حالة المهمة ${task.taskNumber} إلى ${newStatus}`,
      messageEn: `Task ${task.taskNumber} status changed to ${newStatus}`,
      entityType: 'task',
      entityId: task.id,
    });
  }

  async notifyCommentAdded(task: any, userId: string, commenterName: string): Promise<void> {
    await this.create({
      userId,
      type: 'comment_added',
      titleAr: 'تم إضافة تعليق جديد',
      titleEn: 'New Comment Added',
      messageAr: `أضاف ${commenterName} تعليقاً على المهمة ${task.taskNumber}`,
      messageEn: `${commenterName} added a comment on task ${task.taskNumber}`,
      entityType: 'task',
      entityId: task.id,
    });
  }

  async notifyAttachmentUploaded(task: any, userId: string, uploaderName: string): Promise<void> {
    await this.create({
      userId,
      type: 'attachment_uploaded',
      titleAr: 'تم إضافة مرفق جديد',
      titleEn: 'New Attachment Added',
      messageAr: `أضاف ${uploaderName} مرفقاً إلى المهمة ${task.taskNumber}`,
      messageEn: `${uploaderName} added an attachment to task ${task.taskNumber}`,
      entityType: 'task',
      entityId: task.id,
    });
  }
}
