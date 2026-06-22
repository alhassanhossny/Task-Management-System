import { Controller, Get, Post, Delete, Param, UseGuards, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AttachmentService } from '../../application/services/attachment.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { NotificationService } from '../../application/services/notification.service';
import { TaskService } from '../../application/services/task.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/attachments')
export class AttachmentsController {
  constructor(
    private attachmentService: AttachmentService,
    private auditService: AuditService,
    private notificationService: NotificationService,
    private taskService: TaskService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async upload(
    @Param('taskId') taskId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    const attachments = await this.attachmentService.uploadMultiple(taskId, files, req.user.id);
    const task = await this.taskService.findOne(taskId);

    await this.auditService.log({
      actionType: 'ATTACHMENT_UPLOADED',
      entity: 'task',
      entityId: taskId,
      newValue: { count: files.length, filenames: files.map(f => f.originalname) },
      userId: req.user.id,
      ipAddress: req.ip,
    });

    if (task.createdBy !== req.user.id) {
      await this.notificationService.notifyAttachmentUploaded(
        task, task.createdBy, req.user.fullNameAr,
      );
    }

    return attachments;
  }

  @Get()
  async findByTask(@Param('taskId') taskId: string) {
    return this.attachmentService.findByTask(taskId);
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const { stream, attachment } = await this.attachmentService.getFileStreamAsync(id);
    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
    stream.pipe(res);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const attachment = await this.attachmentService.findOne(id);
    await this.attachmentService.delete(id);

    await this.auditService.log({
      actionType: 'ATTACHMENT_DELETED',
      entity: 'task',
      entityId: attachment.taskId,
      oldValue: { filename: attachment.originalName },
      userId: req.user.id,
      ipAddress: req.ip,
    });

    return { message: 'Attachment deleted successfully' };
  }
}
