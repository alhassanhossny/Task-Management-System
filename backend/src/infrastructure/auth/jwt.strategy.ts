import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SuperSecretKeyForHospitalTaskSystem2024!@#$%',
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
      relations: ['role', 'department'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullNameAr: user.fullNameAr,
      fullNameEn: user.fullNameEn,
      roleId: user.roleId,
      role: user.role?.nameEn || 'user',
      permissions: user.role?.permissions || [],
      departmentId: user.departmentId,
    };
  }
}
