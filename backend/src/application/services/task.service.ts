import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, Brackets } from 'typeorm';
import { Task } from '../../domain/entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, TaskResponseDto, ChangeStatusDto } from '../dtos/task.dto';

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['new', 'cancelled'],
  new: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'cancelled'],
  in_progress: ['waiting_for_response', 'completed'],
  waiting_for_response: ['in_progress'],
  completed: ['closed'],
  closed: [],
  cancelled: [],
};

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createDto: CreateTaskDto, userId: string): Promise<Task> {
    const taskNumber = await this.generateTaskNumber();

    const taskData: Partial<Task> = {
      ...createDto,
      taskNumber,
      createdBy: userId,
      status: 'draft',
      dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
    };
    const task = this.taskRepository.create(taskData as any);

    return this.taskRepository.save(task as any) as any;
  }

  async findAll(filters: TaskFilterDto): Promise<{ data: Task[]; total: number }> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.sourceDepartment', 'sourceDepartment')
      .leftJoinAndSelect('task.targetDepartment', 'targetDepartment')
      .leftJoinAndSelect('task.assignedToDepartment', 'assignedToDepartment')
      .leftJoinAndSelect('task.createdByUser', 'createdByUser')
      .where('task.isActive = :isActive', { isActive: true });

    if (filters.taskNumber) {
      queryBuilder.andWhere('task.taskNumber LIKE :taskNumber', {
        taskNumber: `%${filters.taskNumber}%`,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.departmentId) {
      queryBuilder.andWhere(
        '(task.sourceDepartmentId = :deptId OR task.targetDepartmentId = :deptId OR task.assignedToDepartmentId = :deptId)',
        { deptId: filters.departmentId },
      );
    }

    if (filters.createdBy) {
      queryBuilder.andWhere('task.createdBy = :createdBy', { createdBy: filters.createdBy });
    }

    if (filters.startDate && filters.endDate) {
      queryBuilder.andWhere('task.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
      });
    }

    if (filters.keyword) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('task.titleAr LIKE :keyword', { keyword: `%${filters.keyword}%` })
            .orWhere('task.titleEn LIKE :keyword', { keyword: `%${filters.keyword}%` })
            .orWhere('task.taskNumber LIKE :keyword', { keyword: `%${filters.keyword}%` });
        }),
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;

    queryBuilder.skip((page - 1) * limit).take(limit);
    queryBuilder.orderBy('task.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findByUser(userId: string, filters: TaskFilterDto): Promise<{ data: Task[]; total: number }> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.sourceDepartment', 'sourceDepartment')
      .leftJoinAndSelect('task.targetDepartment', 'targetDepartment')
      .leftJoinAndSelect('task.assignedToDepartment', 'assignedToDepartment')
      .leftJoinAndSelect('task.createdByUser', 'createdByUser')
      .where('task.createdBy = :userId', { userId })
      .andWhere('task.isActive = :isActive', { isActive: true });

    if (filters.status) {
      queryBuilder.andWhere('task.status = :status', { status: filters.status });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    queryBuilder.skip((page - 1) * limit).take(limit);
    queryBuilder.orderBy('task.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'sourceDepartment',
        'targetDepartment',
        'assignedToDepartment',
        'createdByUser',
        'comments',
        'comments.user',
        'comments.replies',
        'comments.replies.user',
        'attachments',
        'attachments.user',
      ],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findByTaskNumber(taskNumber: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { taskNumber, isActive: true },
      relations: [
        'sourceDepartment',
        'targetDepartment',
        'assignedToDepartment',
        'createdByUser',
      ],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (!['draft', 'new'].includes(task.status)) {
      throw new BadRequestException('Task can only be edited in Draft or New status');
    }

    Object.assign(task, updateDto);
    return this.taskRepository.save(task);
  }

  async changeStatus(id: string, changeStatusDto: ChangeStatusDto, userId: string): Promise<Task> {
    const task = await this.findOne(id);
    const newStatus = changeStatusDto.status;
    const currentStatus = task.status;

    const allowedTransitions = VALID_TRANSITIONS[currentStatus];
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot change status from '${currentStatus}' to '${newStatus}'`,
      );
    }

    task.status = newStatus;
    return this.taskRepository.save(task);
  }

  async getDashboardStats(userId: string, isAdmin: boolean): Promise<any> {
    if (isAdmin) {
      const total = await this.taskRepository.count({ where: { isActive: true } });
      const openTasks = await this.taskRepository.count({
        where: { isActive: true, status: 'in_progress' },
      });
      const closedTasks = await this.taskRepository.count({
        where: { isActive: true, status: 'closed' },
      });
      const cancelledTasks = await this.taskRepository.count({
        where: { isActive: true, status: 'cancelled' },
      });

      const deptStats = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoin('task.targetDepartment', 'department')
        .select('department.nameAr', 'departmentNameAr')
        .select('department.nameEn', 'departmentNameEn')
        .addSelect('COUNT(task.id)', 'count')
        .where('task.isActive = :active', { active: true })
        .groupBy('task.targetDepartmentId')
        .addGroupBy('department.nameAr')
        .addGroupBy('department.nameEn')
        .getRawMany();

      return { total, openTasks, closedTasks, cancelledTasks, deptStats };
    }

    const openTasks = await this.taskRepository.count({
      where: { createdBy: userId, isActive: true, status: 'in_progress' },
    });
    const assignedTasks = await this.taskRepository.count({
      where: { assignedTo: userId, isActive: true, status: 'assigned' },
    });
    const waitingTasks = await this.taskRepository.count({
      where: { createdBy: userId, isActive: true, status: 'waiting_for_response' },
    });
    const completedTasks = await this.taskRepository.count({
      where: { createdBy: userId, isActive: true, status: 'completed' },
    });

    return { openTasks, assignedTasks, waitingTasks, completedTasks };
  }

  private async generateTaskNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `TSK-${year}-`;

    const lastTask = await this.taskRepository.findOne({
      where: { taskNumber: Like(`${prefix}%`) },
      order: { createdAt: 'DESC' },
    });

    let sequence = 1;
    if (lastTask) {
      const parts = lastTask.taskNumber.split('-');
      sequence = parseInt(parts[parts.length - 1], 10) + 1;
    }

    return `${prefix}${String(sequence).padStart(5, '0')}`;
  }
}
