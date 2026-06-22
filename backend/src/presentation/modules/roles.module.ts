import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../domain/entities/role.entity';
import { RolesController } from '../controllers/roles.controller';
import { RoleService } from '../../application/services/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RolesModule {}
