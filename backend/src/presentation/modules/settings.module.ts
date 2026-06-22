import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '../../domain/entities/setting.entity';
import { SettingsController } from '../controllers/settings.controller';
import { SettingsService } from '../../application/services/settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
