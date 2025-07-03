import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { GenreIdsDto } from './genre-ids.dto';

export class UpdatePreferenceRequestDto {
  @ApiPropertyOptional({
    description: '영화 장르 ID 목록',
    type: () => GenreIdsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GenreIdsDto)
  movie: GenreIdsDto;

  @ApiPropertyOptional({
    description: 'TV 시리즈 장르 ID 목록',
    type: () => GenreIdsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GenreIdsDto)
  tv: GenreIdsDto;
}
