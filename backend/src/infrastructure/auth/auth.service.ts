import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { LoginDto } from '../../application/dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
      relations: ['role', 'department'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto, ipAddress?: string) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role?.nameEn || 'user',
      permissions: user.role?.permissions || [],
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    await this.userRepository.update(user.id, {
      refreshToken,
      lastLogin: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullNameAr: user.fullNameAr,
        fullNameEn: user.fullNameEn,
        role: user.role?.nameEn || 'user',
        roleAr: user.role?.nameAr || 'مستخدم',
        permissions: user.role?.permissions || [],
        departmentId: user.departmentId,
        departmentNameAr: user.department?.nameAr || '',
        departmentNameEn: user.department?.nameEn || '',
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, isActive: true },
        relations: ['role', 'department'],
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = {
        sub: user.id,
        username: user.username,
        role: user.role?.nameEn || 'user',
        permissions: user.role?.permissions || [],
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: process.env.JWT_EXPIRATION || '1h',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      });

      await this.userRepository.update(user.id, { refreshToken: newRefreshToken });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'department'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullNameAr: user.fullNameAr,
      fullNameEn: user.fullNameEn,
      roleId: user.roleId,
      roleNameAr: user.role?.nameAr || '',
      roleNameEn: user.role?.nameEn || '',
      departmentId: user.departmentId,
      departmentNameAr: user.department?.nameAr || '',
      departmentNameEn: user.department?.nameEn || '',
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };
  }
}

@Injectable()
export class JwtAuthGuard {
  constructor(private jwtService: JwtService) {}

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
