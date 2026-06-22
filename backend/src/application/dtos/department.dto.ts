import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  nameAr: string;

  @IsString()
  nameEn: string;

  @IsString()
  code: string;

  @IsOptional()
  isActive?: boolean;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  isActive?: boolean;
}
