import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @Type(() => Number)
  @IsNumber()
  taskTitleId: number;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sourceDepartmentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetDepartmentId?: number;
}

export class UpdateTaskDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  taskTitleId?: number;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sourceDepartmentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetDepartmentId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class ChangeStatusDto {
  @IsString()
  status: string;
}

export class TaskFilterDto {
  @IsOptional()
  @IsString()
  taskNumber?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  direction?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class TaskResponseDto {
  id: string;
  taskNumber: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  sourceDepartmentId: number;
  sourceDepartmentNameAr: string;
  sourceDepartmentNameEn: string;
  targetDepartmentId: number;
  targetDepartmentNameAr: string;
  targetDepartmentNameEn: string;
  createdBy: string;
  createdByNameAr: string;
  createdByNameEn: string;
  taskTitleId: number;
  taskTitleAr: string;
  taskTitleEn: string;
  status: string;
  submittedAt: string;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  attachmentCount: number;
}
