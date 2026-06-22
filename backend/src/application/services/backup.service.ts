import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private backupDir: string;

  constructor() {
    this.backupDir = process.env.BACKUP_DIR || '/app/backups';
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async exportDatabase(): Promise<string> {
    const dbName = process.env.DB_DATABASE || 'task_hospital';
    const dbUser = process.env.DB_USERNAME || 'task_admin';
    const dbPassword = process.env.DB_PASSWORD || 'Task@Secure#2024';
    const dbHost = process.env.DB_HOST || 'postgres';

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupDir, `backup-${timestamp}.sql`);

    try {
      await execAsync(
        `PGPASSWORD="${dbPassword}" pg_dump -h ${dbHost} -U ${dbUser} -d ${dbName} --clean --if-exists > ${backupFile}`,
        { timeout: 300000 },
      );
      return backupFile;
    } catch (error) {
      throw new InternalServerErrorException(`Database backup failed: ${error.message}`);
    }
  }

  async importDatabase(filePath: string): Promise<void> {
    const dbName = process.env.DB_DATABASE || 'task_hospital';
    const dbUser = process.env.DB_USERNAME || 'task_admin';
    const dbPassword = process.env.DB_PASSWORD || 'Task@Secure#2024';
    const dbHost = process.env.DB_HOST || 'postgres';

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Backup file not found');
    }

    try {
      await execAsync(
        `PGPASSWORD="${dbPassword}" psql -h ${dbHost} -U ${dbUser} -d ${dbName} < ${filePath}`,
        { timeout: 300000 },
      );
    } catch (error) {
      throw new InternalServerErrorException(`Database import failed: ${error.message}`);
    }
  }

  async exportAttachments(): Promise<string> {
    const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveFile = path.join(this.backupDir, `attachments-${timestamp}.zip`);

    return new Promise((resolve, reject) => {
      try {
        const output = fs.createWriteStream(archiveFile);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve(archiveFile));
        archive.on('error', (err) => reject(err));

        archive.pipe(output);

        if (fs.existsSync(uploadDir)) {
          archive.directory(uploadDir, 'uploads');
        }

        archive.finalize();
      } catch (error) {
        reject(new InternalServerErrorException(`Attachments export failed: ${error.message}`));
      }
    });
  }

  async listBackups(): Promise<{ filename: string; size: number; date: Date }[]> {
    if (!fs.existsSync(this.backupDir)) {
      return [];
    }

    const files = fs.readdirSync(this.backupDir);
    return files
      .filter(f => f.endsWith('.sql') || f.endsWith('.zip'))
      .map(f => {
        const stat = fs.statSync(path.join(this.backupDir, f));
        return { filename: f, size: stat.size, date: stat.mtime };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async deleteBackup(filename: string): Promise<void> {
    const filePath = path.join(this.backupDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Backup file not found');
    }
    fs.unlinkSync(filePath);
  }
}
