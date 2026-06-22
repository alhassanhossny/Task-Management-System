import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TaskAttachment } from '../../domain/entities/task-attachment.entity';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar'];

@Injectable()
export class AttachmentService {
  private uploadDir: string;

  constructor(
    @InjectRepository(TaskAttachment)
    private attachmentRepository: Repository<TaskAttachment>,
  ) {
    this.uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    taskId: string,
    file: Express.Multer.File,
    userId: string,
  ): Promise<TaskAttachment> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(`File type ${ext} is not allowed`);
    }

    const filename = `${uuidv4()}${ext}`;
    const taskDir = path.join(this.uploadDir, taskId);

    if (!fs.existsSync(taskDir)) {
      fs.mkdirSync(taskDir, { recursive: true });
    }

    const filePath = path.join(taskDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    const attachment = this.attachmentRepository.create({
      taskId,
      userId,
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath,
    });

    return this.attachmentRepository.save(attachment);
  }

  async uploadMultiple(
    taskId: string,
    files: Express.Multer.File[],
    userId: string,
  ): Promise<TaskAttachment[]> {
    const attachments: TaskAttachment[] = [];

    for (const file of files) {
      const attachment = await this.upload(taskId, file, userId);
      attachments.push(attachment);
    }

    return attachments;
  }

  async findByTask(taskId: string): Promise<TaskAttachment[]> {
    return this.attachmentRepository.find({
      where: { taskId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TaskAttachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    return attachment;
  }

  async delete(id: string): Promise<void> {
    const attachment = await this.findOne(id);

    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    await this.attachmentRepository.remove(attachment);
  }

  async countByTask(taskId: string): Promise<number> {
    return this.attachmentRepository.count({ where: { taskId } });
  }

  async getFileStreamAsync(id: string): Promise<{ stream: fs.ReadStream; attachment: TaskAttachment }> {
    const attachment = await this.findOne(id);

    if (!fs.existsSync(attachment.path)) {
      throw new NotFoundException('File not found on disk');
    }

    const stream = fs.createReadStream(attachment.path);
    return { stream, attachment };
  }
}
