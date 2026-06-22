import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { RoleService } from '../../application/services/role.service';
import { RequirePermissions } from '../guards/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private roleService: RoleService) {}

  @Get()
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @Post()
  @RequirePermissions('roles.create')
  async create(@Body() data: { nameAr: string; nameEn: string; permissions: string[] }) {
    return this.roleService.create(data);
  }

  @Put(':id')
  @RequirePermissions('roles.update')
  async update(@Param('id') id: number, @Body() data: any) {
    return this.roleService.update(id, data);
  }
}
