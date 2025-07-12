import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { ContentType } from 'src/common/enums/content-type.enum';

export class ContentItemDto {
  @ApiProperty({ example: 1, description: '컨텐츠 ID' })
  @IsNumber()
  id: number;

  @ApiProperty({
    enum: ContentType,
    description: '컨텐츠 타입 (movie | tv)',
    example: ContentType.MOVIE,
  })
  @IsEnum(ContentType, {
    message: 'contentType은 현재 movie 또는 tv만 가능합니다.',
  })
  contentType: ContentType;
}
