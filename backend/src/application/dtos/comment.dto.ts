import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];
}
