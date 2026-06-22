import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { RequirePermissions } from '../guards/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @RequirePermissions('audit.view')
  async findAll(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.auditService.findAll(page, limit);
  }

  @Get('entity/:entity/:entityId')
  async findByEntity(@Param('entity') entity: string, @Param('entityId') entityId: string) {
    return this.auditService.findByEntity(entity, entityId);
  }

  @Get('action/:actionType')
  @RequirePermissions('audit.view')
  async findByActionType(@Param('actionType') actionType: string, @Query('page') page = 1, @Query('limit') limit = 50) {
    return this.auditService.findByActionType(actionType, page, limit);
  }
}
