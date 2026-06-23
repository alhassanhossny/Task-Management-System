import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DepartmentService } from '../../application/services/department.service';
import { RoleService } from '../../application/services/role.service';
import { SettingsService } from '../../application/services/settings.service';
import { UserService } from '../../application/services/user.service';
import { TaskTitleService } from '../../application/services/task-title.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const departmentService = app.get(DepartmentService);
    const roleService = app.get(RoleService);
    const settingsService = app.get(SettingsService);
    const userService = app.get(UserService);
    const taskTitleService = app.get(TaskTitleService);

    console.log('Seeding departments...');
    await departmentService.seedDefaultDepartments();

    console.log('Seeding roles...');
    await roleService.seedDefaultRoles();

    console.log('Seeding settings...');
    await settingsService.seedDefaults();

    console.log('Creating admin user...');
    try {
      await userService.create({
        username: 'admin',
        email: 'admin@hospital.local',
        password: 'Admin@2024',
        fullNameAr: 'مدير النظام',
        fullNameEn: 'System Admin',
        roleId: 1,
        departmentId: 1,
        isActive: true,
      });
      console.log('Admin user created: admin / Admin@2024');
    } catch (e) {
      console.log('Admin user already exists');
    }

    console.log('Creating department users...');
    const deptNames = [
      { ar: 'تقنية المعلومات', en: 'IT' },
      { ar: 'الاستقبال', en: 'Reception' },
      { ar: 'الطوارئ', en: 'Emergency' },
      { ar: 'محاسبة المرضى', en: 'Patients Accounting' },
      { ar: 'الخزينة', en: 'Treasury' },
      { ar: 'المحاسبة العامة', en: 'General Accounting' },
      { ar: 'التسويق', en: 'Marketing' },
      { ar: 'العقود', en: 'Contracts' },
      { ar: 'العيادات الخارجية', en: 'Out Clinics' },
      { ar: 'الصيدلية الخارجية', en: 'Out Pharmacy' },
      { ar: 'الصيدلية الداخلية', en: 'Inner Pharmacy' },
      { ar: 'المختبر', en: 'Lab' },
      { ar: 'المستودعات', en: 'Inventory' },
      { ar: 'السكرتارية', en: 'Secretary' },
      { ar: 'الموارد البشرية', en: 'HR' },
      { ar: 'الإدارة', en: 'Management' },
    ];
    for (let i = 1; i < deptNames.length; i++) {
      const deptId = i + 1;
      try {
        await userService.create({
          username: `user${deptId}`,
          email: `user${deptId}@hospital.local`,
          password: '123',
          fullNameAr: `مستخدم ${deptNames[i].ar}`,
          fullNameEn: `${deptNames[i].en} User`,
          roleId: 2,
          departmentId: deptId,
          isActive: true,
        });
        console.log(`User created: user${deptId} / 123 (${deptNames[i].en})`);
      } catch (e) {
        console.log(`User user${deptId} already exists`);
      }
    }

    console.log('Seeding task titles...');
    const titles = [
      { titleAr: 'تعطل جهاز كمبيوتر', titleEn: 'Computer Malfunction', sortOrder: 1 },
      { titleAr: 'مشكلة شبكة', titleEn: 'Network Issue', sortOrder: 2 },
      { titleAr: 'طلب برنامج جديد', titleEn: 'New Software Request', sortOrder: 3 },
      { titleAr: 'صيانة طابعة', titleEn: 'Printer Maintenance', sortOrder: 4 },
      { titleAr: 'مشكلة في نظام المستشفى', titleEn: 'Hospital System Issue', sortOrder: 5 },
      { titleAr: 'طلب حساب جديد', titleEn: 'New Account Request', sortOrder: 6 },
      { titleAr: 'استعادة بيانات', titleEn: 'Data Recovery', sortOrder: 7 },
      { titleAr: 'تحديث نظام', titleEn: 'System Update', sortOrder: 8 },
      { titleAr: 'تركيب جهاز جديد', titleEn: 'New Device Installation', sortOrder: 9 },
      { titleAr: 'مشكلة أمان', titleEn: 'Security Issue', sortOrder: 10 },
      { titleAr: 'دعم فني', titleEn: 'Technical Support', sortOrder: 11 },
      { titleAr: 'أخرى', titleEn: 'Other', sortOrder: 12 },
    ];
    for (const t of titles) {
      try { await taskTitleService.create(t); } catch { }
    }
    console.log(`${titles.length} task titles seeded`);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

seed();
