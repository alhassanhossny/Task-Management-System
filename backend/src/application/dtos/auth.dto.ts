import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class RegisterDto {
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

  @IsOptional()
  @IsString()
  departmentId?: number;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullNameAr: string;
    fullNameEn: string;
    role: string;
    permissions: string[];
  };
}
