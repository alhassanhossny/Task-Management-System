import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../domain/entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../dtos/department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentRepository.findOne({
      where: [{ code: createDto.code }],
    });

    if (existing) {
      throw new ConflictException('Department code already exists');
    }

    const department = this.departmentRepository.create(createDto);
    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      order: { nameAr: 'ASC' },
    });
  }

  async findActive(): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { isActive: true },
      order: { nameAr: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async update(id: number, updateDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    Object.assign(department, updateDto);
    return this.departmentRepository.save(department);
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);
    try {
      await this.departmentRepository.remove(department);
    } catch (error: any) {
      if (error?.code === '23503') {
        throw new ConflictException('Cannot delete department that is in use by users or tasks');
      }
      throw error;
    }
  }

  async seedDefaultDepartments(): Promise<void> {
    const count = await this.departmentRepository.count();
    if (count > 0) return;

    const departments = [
      { nameAr: 'تقنية المعلومات', nameEn: 'IT', code: 'IT' },
      { nameAr: 'الاستقبال', nameEn: 'Reception', code: 'REC' },
      { nameAr: 'الطوارئ', nameEn: 'Emergency', code: 'EMR' },
      { nameAr: 'محاسبة المرضى', nameEn: 'Patients Accounting', code: 'PAT_ACC' },
      { nameAr: 'الخزينة', nameEn: 'Treasury', code: 'TRS' },
      { nameAr: 'المحاسبة العامة', nameEn: 'General Accounting', code: 'GEN_ACC' },
      { nameAr: 'التسويق', nameEn: 'Marketing', code: 'MKT' },
      { nameAr: 'العقود', nameEn: 'Contracts', code: 'CTR' },
      { nameAr: 'العيادات الخارجية', nameEn: 'Out Clinics', code: 'OUT_CLN' },
      { nameAr: 'الصيدلية الخارجية', nameEn: 'Out Pharmacy', code: 'OUT_PHR' },
      { nameAr: 'الصيدلية الداخلية', nameEn: 'Inner Pharmacy', code: 'INN_PHR' },
      { nameAr: 'المختبر', nameEn: 'Lab', code: 'LAB' },
      { nameAr: 'المستودعات', nameEn: 'Inventory', code: 'INV' },
      { nameAr: 'السكرتارية', nameEn: 'Secretary', code: 'SEC' },
      { nameAr: 'الموارد البشرية', nameEn: 'HR', code: 'HR' },
      { nameAr: 'الإدارة', nameEn: 'Management', code: 'MGT' },
    ];

    for (const dept of departments) {
      await this.departmentRepository.save(
        this.departmentRepository.create(dept),
      );
    }
  }
}
