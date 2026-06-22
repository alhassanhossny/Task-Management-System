import { Controller, Get, Post, Delete, Param, UseGuards, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BackupService } from '../../application/services/backup.service';
import { RequirePermissions } from '../guards/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('backup')
export class BackupController {
  constructor(private backupService: BackupService) {}

  @Post('export')
  @RequirePermissions('backup.export')
  async exportDatabase() {
    const filePath = await this.backupService.exportDatabase();
    return { message: 'Backup created successfully', filePath };
  }

  @Post('import')
  @RequirePermissions('backup.import')
  @UseInterceptors(FileInterceptor('file'))
  async importDatabase(@UploadedFile() file: any) {
    await this.backupService.importDatabase(file.path);
    return { message: 'Database imported successfully' };
  }

  @Post('export-attachments')
  @RequirePermissions('backup.export')
  async exportAttachments() {
    const filePath = await this.backupService.exportAttachments();
    return { message: 'Attachments exported successfully', filePath };
  }

  @Get('list')
  @RequirePermissions('backup.view')
  async listBackups() {
    return this.backupService.listBackups();
  }

  @Delete(':filename')
  @RequirePermissions('backup.delete')
  async deleteBackup(@Param('filename') filename: string) {
    await this.backupService.deleteBackup(filename);
    return { message: 'Backup deleted successfully' };
  }
}
