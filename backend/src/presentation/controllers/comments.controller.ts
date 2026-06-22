import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommentService } from '../../application/services/comment.service';
import { CreateCommentDto } from '../../application/dtos/comment.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { NotificationService } from '../../application/services/notification.service';
import { TaskService } from '../../application/services/task.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(
    private commentService: CommentService,
    private auditService: AuditService,
    private notificationService: NotificationService,
    private taskService: TaskService,
  ) {}

  @Post()
  async create(@Param('taskId') taskId: string, @Body() createDto: CreateCommentDto, @Req() req: any) {
    const comment = await this.commentService.create(taskId, createDto, req.user.id);
    const task = await this.taskService.findOne(taskId);

    await this.auditService.log({
      actionType: 'COMMENT_ADDED',
      entity: 'task',
      entityId: taskId,
      newValue: { content: createDto.content },
      userId: req.user.id,
      ipAddress: req.ip,
    });

    if (task.createdBy !== req.user.id) {
      await this.notificationService.notifyCommentAdded(
        task, task.createdBy, req.user.fullNameAr,
      );
    }

    return comment;
  }

  @Get()
  async findByTask(@Param('taskId') taskId: string) {
    return this.commentService.findByTask(taskId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body('content') content: string, @Req() req: any) {
    return this.commentService.update(id, content, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.commentService.delete(id, req.user.id);
    return { message: 'Comment deleted successfully' };
  }
}
