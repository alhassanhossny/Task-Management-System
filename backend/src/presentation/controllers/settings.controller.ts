import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from '../../application/services/settings.service';
import { RequirePermissions } from '../guards/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  @Get(':key')
  async get(@Param('key') key: string) {
    const value = await this.settingsService.get(key);
    return { key, value };
  }

  @Put(':key')
  @RequirePermissions('settings.update')
  async set(@Param('key') key: string, @Body() body: { value: string; description?: string }) {
    return this.settingsService.set(key, body.value, body.description);
  }

  @Delete(':key')
  @RequirePermissions('settings.delete')
  async delete(@Param('key') key: string) {
    await this.settingsService.delete(key);
    return { message: 'Setting deleted' };
  }
}
