// src/preference/dto/request/update-preference-request.dto.ts
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { GenreIdsDto } from './genre-ids.dto';

@ApiExtraModels(GenreIdsDto)
export class UpdatePreferenceRequestDto {
  @ApiProperty({
    description: '영화 선호 장르 정보',
    type: GenreIdsDto,
    nullable: false,
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GenreIdsDto)
  movie: GenreIdsDto;

  @ApiProperty({
    description: 'TV 시리즈 선호 장르 정보',
    type: GenreIdsDto,
    nullable: false,
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GenreIdsDto)
  tv: GenreIdsDto;
}
