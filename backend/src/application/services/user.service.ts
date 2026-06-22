import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: string): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
      createdBy,
    });

    const savedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['role', 'department'],
      order: { createdAt: 'DESC' },
    });
    return users.map(user => this.mapToResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'department'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'department'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto['passwordHash'] = await bcrypt.hash(updateUserDto.password, salt);
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(updatedUser);
  }

  async deactivate(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async findByDepartment(departmentId: number): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: { departmentId, isActive: true },
      relations: ['role', 'department'],
    });
    return users.map(user => this.mapToResponseDto(user));
  }

  private mapToResponseDto(user: User): UserResponseDto {
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
