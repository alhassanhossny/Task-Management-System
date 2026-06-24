import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TaskTitleService } from '../../application/services/task-title.service';
import { CreateTaskTitleDto, UpdateTaskTitleDto } from '../../application/dtos/task-title.dto';
import { RequirePermissions } from '../guards/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('task-titles')
export class TaskTitlesController {
  constructor(private taskTitleService: TaskTitleService) {}

  @Post()
  @RequirePermissions('task-titles.create')
  async create(@Body() createDto: CreateTaskTitleDto) {
    return this.taskTitleService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.taskTitleService.findAll();
  }

  @Get('active')
  async findActive() {
    return this.taskTitleService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.taskTitleService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('task-titles.update')
  async update(@Param('id') id: number, @Body() updateDto: UpdateTaskTitleDto) {
    return this.taskTitleService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions('task-titles.delete')
  async remove(@Param('id') id: number) {
    await this.taskTitleService.remove(id);
    return { message: 'Task title deleted successfully' };
  }
}
