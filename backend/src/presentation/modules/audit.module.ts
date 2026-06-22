import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AuditController } from '../controllers/audit.controller';
import { AuditService } from '../../infrastructure/audit/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
