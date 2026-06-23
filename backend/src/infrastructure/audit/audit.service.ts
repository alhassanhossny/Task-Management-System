import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../domain/entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(params: {
    actionType: string;
    entity: string;
    entityId: string;
    oldValue?: any;
    newValue?: any;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const auditLogData: Partial<AuditLog> = {
      actionType: params.actionType,
      entity: params.entity,
      entityId: params.entityId,
      oldValue: params.oldValue || null,
      newValue: params.newValue || null,
      userId: params.userId || null,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    };
    const auditLog = this.auditLogRepository.create(auditLogData as any);
    return this.auditLogRepository.save(auditLog as any) as any;
  }

  async findByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entity, entityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(page = 1, limit = 50): Promise<{ data: AuditLog[]; total: number }> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findByActionType(actionType: string, page = 1, limit = 50): Promise<{ data: AuditLog[]; total: number }> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: { actionType },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }
}
