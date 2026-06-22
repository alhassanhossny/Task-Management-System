import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DepartmentService } from '../../application/services/department.service';
import { RoleService } from '../../application/services/role.service';
import { SettingsService } from '../../application/services/settings.service';
import { UserService } from '../../application/services/user.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const departmentService = app.get(DepartmentService);
    const roleService = app.get(RoleService);
    const settingsService = app.get(SettingsService);
    const userService = app.get(UserService);

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

    console.log('Creating demo user...');
    try {
      await userService.create({
        username: 'user',
        email: 'user@hospital.local',
        password: 'User@2024',
        fullNameAr: 'مستخدم عادي',
        fullNameEn: 'Regular User',
        roleId: 2,
        departmentId: 2,
        isActive: true,
      });
      console.log('Demo user created: user / User@2024');
    } catch (e) {
      console.log('Demo user already exists');
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

seed();
