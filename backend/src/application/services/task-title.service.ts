import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskTitle } from '../../domain/entities/task-title.entity';
import { CreateTaskTitleDto, UpdateTaskTitleDto } from '../dtos/task-title.dto';

@Injectable()
export class TaskTitleService {
  constructor(
    @InjectRepository(TaskTitle)
    private taskTitleRepository: Repository<TaskTitle>,
  ) {}

  async create(createDto: CreateTaskTitleDto): Promise<TaskTitle> {
    const title = this.taskTitleRepository.create(createDto);
    return this.taskTitleRepository.save(title);
  }

  async findAll(): Promise<TaskTitle[]> {
    return this.taskTitleRepository.find({
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async findActive(): Promise<TaskTitle[]> {
    return this.taskTitleRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TaskTitle> {
    const title = await this.taskTitleRepository.findOne({ where: { id } });
    if (!title) throw new NotFoundException('Task title not found');
    return title;
  }

  async update(id: number, updateDto: UpdateTaskTitleDto): Promise<TaskTitle> {
    const title = await this.findOne(id);
    Object.assign(title, updateDto);
    return this.taskTitleRepository.save(title);
  }

  async deactivate(id: number): Promise<void> {
    const title = await this.findOne(id);
    title.isActive = false;
    await this.taskTitleRepository.save(title);
  }
}
