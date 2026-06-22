import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  titleAr: string;

  @IsString()
  titleEn: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsNumber()
  sourceDepartmentId?: number;

  @IsOptional()
  @IsNumber()
  targetDepartmentId?: number;

  @IsString()
  assignedTo: string;

  @IsOptional()
  @IsNumber()
  assignedToDepartmentId?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsNumber()
  sourceDepartmentId?: number;

  @IsOptional()
  @IsNumber()
  targetDepartmentId?: number;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsNumber()
  assignedToDepartmentId?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

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
  keyword?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
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
  assignedTo: string;
  assignedToNameAr: string;
  assignedToNameEn: string;
  assignedToDepartmentId: number;
  assignedToDepartmentNameAr: string;
  assignedToDepartmentNameEn: string;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  attachmentCount: number;
}
