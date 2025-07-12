import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ContentItemDto } from './content-item.dto';

export class RemoveContentsRequestDto {
  @ApiProperty({ type: [ContentItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentItemDto)
  contents: ContentItemDto[];
}
