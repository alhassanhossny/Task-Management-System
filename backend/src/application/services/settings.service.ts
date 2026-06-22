import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../../domain/entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  async get(key: string): Promise<string | null> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    return setting ? setting.value : null;
  }

  async set(key: string, value: string, description?: string): Promise<Setting> {
    let setting = await this.settingRepository.findOne({ where: { key } });

    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
    } else {
      setting = this.settingRepository.create({ key, value, description });
    }

    return this.settingRepository.save(setting);
  }

  async getAll(): Promise<Setting[]> {
    return this.settingRepository.find({ order: { key: 'ASC' } });
  }

  async delete(key: string): Promise<void> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) throw new NotFoundException(`Setting '${key}' not found`);
    await this.settingRepository.remove(setting);
  }

  async seedDefaults(): Promise<void> {
    const count = await this.settingRepository.count();
    if (count > 0) return;

    const defaults = [
      { key: 'app_name_ar', value: 'نظام إدارة مهام تقنية المعلومات', description: 'Application name in Arabic' },
      { key: 'app_name_en', value: 'IT Task Management System', description: 'Application name in English' },
      { key: 'app_version', value: '1.0.0', description: 'Application version' },
      { key: 'default_language', value: 'ar', description: 'Default language' },
      { key: 'company_name_ar', value: 'المستشفى', description: 'Company name in Arabic' },
      { key: 'company_name_en', value: 'Hospital Name', description: 'Company name in English' },
      { key: 'items_per_page', value: '20', description: 'Default items per page' },
    ];

    for (const s of defaults) {
      await this.settingRepository.save(this.settingRepository.create(s));
    }
  }
}
