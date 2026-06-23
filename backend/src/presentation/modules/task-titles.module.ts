import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTitle } from '../../domain/entities/task-title.entity';
import { TaskTitlesController } from '../controllers/task-titles.controller';
import { TaskTitleService } from '../../application/services/task-title.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTitle])],
  controllers: [TaskTitlesController],
  providers: [TaskTitleService],
  exports: [TaskTitleService],
})
export class TaskTitlesModule {}
