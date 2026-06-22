import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../domain/entities/department.entity';
import { DepartmentsController } from '../controllers/departments.controller';
import { DepartmentService } from '../../application/services/department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentsModule {}
