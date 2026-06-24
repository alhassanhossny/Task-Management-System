import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DepartmentService } from '../../application/services/department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../../application/dtos/department.dto';
import { RequirePermissions } from '../guards/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private departmentService: DepartmentService) {}

  @Post()
  @RequirePermissions('departments.create')
  async create(@Body() createDto: CreateDepartmentDto) {
    return this.departmentService.create(createDto);
  }

  @Get()
  @RequirePermissions('departments.view')
  async findAll() {
    return this.departmentService.findAll();
  }

  @Get('active')
  async findActive() {
    return this.departmentService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('departments.update')
  async update(@Param('id') id: number, @Body() updateDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions('departments.delete')
  async remove(@Param('id') id: number) {
    await this.departmentService.remove(id);
    return { message: 'Department deleted successfully' };
  }
}
