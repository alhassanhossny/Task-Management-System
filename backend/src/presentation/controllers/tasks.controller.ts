import { Controller, Get, Post, Put, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { TaskService } from '../../application/services/task.service';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, ChangeStatusDto } from '../../application/dtos/task.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuditService } from '../../infrastructure/audit/audit.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private taskService: TaskService,
    private auditService: AuditService,
  ) {}

  @Post()
  async create(@Body() createDto: CreateTaskDto, @Req() req: any) {
    if (!createDto.sourceDepartmentId && req.user.departmentId) {
      createDto.sourceDepartmentId = req.user.departmentId;
    }
    const task = await this.taskService.create(createDto, req.user.id);
    
    await this.auditService.log({
      actionType: 'TASK_CREATED',
      entity: 'task',
      entityId: task.id,
      newValue: { taskTitleId: task.taskTitleId, titleAr: task.titleAr, titleEn: task.titleEn },
      userId: req.user.id,
      ipAddress: req.ip,
    });

    return task;
  }

  @Get()
  async findAll(@Query() filters: TaskFilterDto) {
    return this.taskService.findAll(filters);
  }

  @Get('my')
  async findByUser(@Query() filters: TaskFilterDto, @Req() req: any) {
    return this.taskService.findByUser(req.user.id, filters);
  }

  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    const isAdmin = req.user.permissions.includes('*');
    return this.taskService.getDashboardStats(req.user.id, isAdmin);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Get('number/:taskNumber')
  async findByTaskNumber(@Param('taskNumber') taskNumber: string) {
    return this.taskService.findByTaskNumber(taskNumber);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateTaskDto, @Req() req: any) {
    const oldTask = await this.taskService.findOne(id);
    const task = await this.taskService.update(id, updateDto);

    await this.auditService.log({
      actionType: 'TASK_UPDATED',
      entity: 'task',
      entityId: id,
      oldValue: { titleAr: oldTask.titleAr, titleEn: oldTask.titleEn },
      newValue: { titleAr: task.titleAr, titleEn: task.titleEn },
      userId: req.user.id,
      ipAddress: req.ip,
    });

    return task;
  }

  @Put(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
    @Req() req: any,
  ) {
    const oldTask = await this.taskService.findOne(id);
    const task = await this.taskService.changeStatus(id, changeStatusDto, req.user.id);

    await this.auditService.log({
      actionType: 'STATUS_CHANGED',
      entity: 'task',
      entityId: id,
      oldValue: { status: oldTask.status },
      newValue: { status: task.status },
      userId: req.user.id,
      ipAddress: req.ip,
    });

    return task;
  }
}
