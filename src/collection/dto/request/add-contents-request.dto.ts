import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ContentItemDto } from './content-item.dto';

export class AddContentsRequestDto {
  @ApiProperty({ type: [ContentItemDto], description: '추가할 컨텐츠 목록' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentItemDto)
  contents: ContentItemDto[];
}
