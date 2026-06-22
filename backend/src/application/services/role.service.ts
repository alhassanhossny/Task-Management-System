import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../domain/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({ order: { nameAr: 'ASC' } });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(data: { nameAr: string; nameEn: string; permissions: string[] }): Promise<Role> {
    const role = this.roleRepository.create(data);
    return this.roleRepository.save(role);
  }

  async update(id: number, data: Partial<{ nameAr: string; nameEn: string; permissions: string[] }>): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, data);
    return this.roleRepository.save(role);
  }

  async seedDefaultRoles(): Promise<void> {
    const count = await this.roleRepository.count();
    if (count > 0) return;

    const roles = [
      {
        nameAr: 'مدير النظام',
        nameEn: 'Admin',
        permissions: ['*'],
      },
      {
        nameAr: 'مستخدم',
        nameEn: 'User',
        permissions: [
          'tasks.create',
          'tasks.view',
          'tasks.update',
          'tasks.status.change',
          'comments.create',
          'comments.view',
          'attachments.upload',
          'attachments.view',
        ],
      },
    ];

    for (const role of roles) {
      await this.roleRepository.save(this.roleRepository.create(role));
    }
  }
}
