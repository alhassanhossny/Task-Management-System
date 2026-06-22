import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskComment } from '../../domain/entities/task-comment.entity';
import { CreateCommentDto } from '../dtos/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(TaskComment)
    private commentRepository: Repository<TaskComment>,
  ) {}

  async create(taskId: string, createDto: CreateCommentDto, userId: string): Promise<TaskComment> {
    const comment = this.commentRepository.create({
      taskId,
      userId,
      content: createDto.content,
      parentId: createDto.parentId || null,
      mentions: createDto.mentions || [],
    });

    return this.commentRepository.save(comment);
  }

  async findByTask(taskId: string): Promise<TaskComment[]> {
    const comments = await this.commentRepository.find({
      where: { taskId, parentId: null },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'ASC' },
    });

    return comments;
  }

  async findOne(id: string): Promise<TaskComment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'task'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, content: string, userId: string): Promise<TaskComment> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.content = content;
    comment.isEdited = true;
    return this.commentRepository.save(comment);
  }

  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.softDelete(id);
  }

  async countByTask(taskId: string): Promise<number> {
    return this.commentRepository.count({ where: { taskId } });
  }
}
