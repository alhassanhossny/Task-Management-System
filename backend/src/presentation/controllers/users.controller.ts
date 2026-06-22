import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto, UpdateUserDto } from '../../application/dtos/user.dto';
import { RequirePermissions } from '../guards/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post()
  @RequirePermissions('users.create')
  async create(@Body() createDto: CreateUserDto, @Req() req: any) {
    return this.userService.create(createDto, req.user.id);
  }

  @Get()
  @RequirePermissions('users.view')
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @RequirePermissions('users.view')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('users.update')
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.userService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions('users.delete')
  async deactivate(@Param('id') id: string) {
    await this.userService.deactivate(id);
    return { message: 'User deactivated successfully' };
  }

  @Get('department/:departmentId')
  async findByDepartment(@Param('departmentId') departmentId: number) {
    return this.userService.findByDepartment(departmentId);
  }
}
