import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateTaskTitleDto {
  @IsString()
  titleAr: string;

  @IsString()
  titleEn: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateTaskTitleDto {
  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
