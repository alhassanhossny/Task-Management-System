import { Controller, Get, Put, Delete, Param, UseGuards, Req, Query } from '@nestjs/common';
import { NotificationService } from '../../application/services/notification.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async findByUser(@Req() req: any, @Query('page') page = 1, @Query('limit') limit = 50) {
    return this.notificationService.findByUser(req.user.id, page, limit);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    await this.notificationService.markAsRead(id, req.user.id);
    return { message: 'Notification marked as read' };
  }

  @Put('read-all')
  async markAllAsRead(@Req() req: any) {
    await this.notificationService.markAllAsRead(req.user.id);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.notificationService.delete(id, req.user.id);
    return { message: 'Notification deleted' };
  }

  @Delete()
  async deleteAll(@Req() req: any) {
    await this.notificationService.deleteAll(req.user.id);
    return { message: 'All notifications deleted' };
  }
}
