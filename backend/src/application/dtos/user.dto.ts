import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullNameAr: string;

  @IsString()
  fullNameEn: string;

  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  fullNameAr?: string;

  @IsOptional()
  @IsString()
  fullNameEn?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  fullNameAr: string;
  fullNameEn: string;
  roleId: number;
  roleNameAr: string;
  roleNameEn: string;
  departmentId: number | null;
  departmentNameAr: string;
  departmentNameEn: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}
