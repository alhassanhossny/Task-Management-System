import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './presentation/modules/auth.module';
import { UsersModule } from './presentation/modules/users.module';
import { DepartmentsModule } from './presentation/modules/departments.module';
import { RolesModule } from './presentation/modules/roles.module';
import { TasksModule } from './presentation/modules/tasks.module';
import { CommentsModule } from './presentation/modules/comments.module';
import { AttachmentsModule } from './presentation/modules/attachments.module';
import { NotificationsModule } from './presentation/modules/notifications.module';
import { AuditModule } from './presentation/modules/audit.module';
import { SettingsModule } from './presentation/modules/settings.module';
import { BackupModule } from './presentation/modules/backup.module';
import { TaskTitlesModule } from './presentation/modules/task-titles.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'task_admin',
        password: process.env.DB_PASSWORD || 'Task@Secure#2024',
        database: process.env.DB_DATABASE || 'task_hospital',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60'),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    RolesModule,
    TasksModule,
    CommentsModule,
    AttachmentsModule,
    NotificationsModule,
    AuditModule,
    SettingsModule,
    BackupModule,
    TaskTitlesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
